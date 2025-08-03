const changeTimeZone = (date: Date | string, timeZone: string) => {
  if (typeof date === "string") {
    return new Date(
      new Date(date).toLocaleString("en-US", {
        timeZone,
      }),
    );
  }

  return new Date(
    date.toLocaleString("en-US", {
      timeZone,
    }),
  );
};

const calcDateDistance = (date: Date) => {
  const countDownDate = date.getTime();
  const now = new Date().getTime();

  const distance = countDownDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return {
    distance,
    days,
    hours,
    minutes,
    seconds,
  };
};

const toHumanDate = (dataStr: string) => {
  const date = new Date(dataStr);
  const formatter = new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const formatted = formatter.format(date);

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

export { changeTimeZone, calcDateDistance, toHumanDate };
