import React from "react";
import Image from "next/image";
import styles from "./Tag.module.css";
import clsx from "clsx";

interface TagProps {
  children: React.ReactElement | string;
  icon?: string;
}

export const Tag = ({ children, icon }: TagProps) => {
  return (
    <div
      className={clsx(styles.Tag, icon ? styles.TagWithIcon : styles.TagNoIcon)}
    >
      {icon && <Image src={icon} alt="" />}
      {children}
    </div>
  );
};
