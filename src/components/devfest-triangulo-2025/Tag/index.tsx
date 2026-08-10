import React from "react";
import Image from "next/image";
import clsx from "clsx";

interface TagProps {
  children: React.ReactElement | string;
  icon?: string;
}

export const Tag = ({ children, icon }: TagProps) => {
  return (
    <div
      className={clsx(
        "inline-flex w-fit p-px",
        icon ? "rounded-lg bg-devGray" : "rounded-full bg-devfest-gradient",
      )}
    >
      <div
        className={clsx(
          "inline-flex min-h-2 items-center gap-2.5 bg-black text-sm leading-none text-white/80 sm:text-base",
          icon ? "rounded-[7px] px-6 py-3" : "rounded-full px-4 py-2",
        )}
      >
        {icon && <Image src={icon} alt="" />}
        {children}
      </div>
    </div>
  );
};
