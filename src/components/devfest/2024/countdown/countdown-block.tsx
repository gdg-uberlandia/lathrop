import React from "react";

type Props = {
  value: number;
  label: string;
  bgColor: string;
  textColor: string;
};

const CountdownBlock: React.FC<Props> = ({
  bgColor,
  label,
  textColor,
  value,
}) => {
  return (
    <div
      className={`flex flex-col items-center grow-1 w-full grow justify-center aspect-w-1 aspect-h-1 h-40 ${bgColor} text-${textColor} rounded-md border-2 border-black`}
    >
      <span className="text-7xl font-bold">{value}</span>
      <span className="text-2xl">{label}</span>
    </div>
  );
};

export { CountdownBlock };
