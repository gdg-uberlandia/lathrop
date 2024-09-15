import * as React from "react";
import LogoDevfestCerrado from "assets/images/LogoDevfestCerrado";
import LogoGDG from "assets/images/LogoGDG";
import LogoWTM from "assets/images/LogoWTM";
import configValues from "helpers/config";

interface LogoProps {
  color?: string;
  height?: number;
  width?: number;
  key?: string;
}

const Logo = (props: LogoProps) => {
  switch (configValues?.organizedBy) {
    case "wtm":
      return (
        <LogoWTM
          width={props.width}
          height={props.height}
          color={props.color}
        />
      );
    case "gdg":
      return (
        <LogoGDG
          width={props.width}
          height={props.height}
          color={props.color}
        />
      );
    case "devfest-cerrado":
      return (
        <LogoDevfestCerrado
          width={props.width}
          height={props.height}
          color={props.color}
        />
      );
  }
};

export default Logo;
