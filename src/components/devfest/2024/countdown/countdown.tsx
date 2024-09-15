import configValues from "helpers/config";
import React, { useEffect, useState, useMemo } from "react";
import { CountdownBlock } from "./countdown-block";

const Countdown: React.FC = () => {
  const targetDate = useMemo(() => new Date(configValues.eventDate), []);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      // If the target date is in the past, set all values to 0
      if (targetDate.getTime() <= now.getTime()) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      const difference = targetDate.getTime() - now.getTime();

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTime(); // Run once immediately

    const intervalId = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [targetDate]);

  return (
    <div className="mx-auto flex max-w-screen-lg flex-wrap justify-between space-y-4 p-9 sm:flex-nowrap sm:space-x-4 sm:space-y-0">
      <CountdownBlock
        value={timeLeft.days}
        label="dias"
        bgColor="bg-blue-200"
        textColor="black"
      />
      <CountdownBlock
        value={timeLeft.hours}
        label="horas"
        bgColor="bg-red-500"
        textColor="white"
      />
      <CountdownBlock
        value={timeLeft.minutes}
        label="minutos"
        bgColor="bg-yellow-400"
        textColor="black"
      />
      <CountdownBlock
        value={timeLeft.seconds}
        label="segundos"
        bgColor="bg-gray-200"
        textColor="black"
      />
    </div>
  );
};

export { Countdown };
