import React from "react";
import Image from "next/image";
import styles from "./Tag.module.css";

interface TagProps {
  children: React.ReactElement | string;
  icon?: string;
}

export const Tag = ({ children, icon }: TagProps) => {
  return (
    <div className={styles.Tag}>
      {icon && <Image src={icon} alt="" />}
      {children}
    </div>
  );
};
