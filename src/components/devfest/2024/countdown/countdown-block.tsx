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
      className={`flex h-40 w-full grow flex-col items-center justify-center ${bgColor} text-${textColor} rounded-md border-2 border-black`}
    >
      <span className="text-7xl font-bold">{value}</span>
      <span className="text-2xl">{label}</span>
    </div>
  );
};

export { CountdownBlock };
