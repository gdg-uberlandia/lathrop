import * as React from "react";
import LogoDevfestCerrado from "assets/images/LogoDevfestCerrado";
import LogoGDG from "assets/images/LogoGDG";
import LogoWTM from "assets/images/LogoWTM";
import configValues from "helpers/config";

interface LogoProps {
    color?: string
    height?: number,
    width?: number,
}
const Logo = (props: LogoProps) => {
    const logos = new Map([
        ['wtm', <LogoWTM width={153} height={45} color="white" />],
        ['gdg', <LogoGDG width={153} height={45} color="white" />],
        ['devfest-cerrado', <LogoDevfestCerrado width={153} height={45} color="white" />]
    ]);
    return logos.get(configValues?.organizedBy);
}

export default Logo;