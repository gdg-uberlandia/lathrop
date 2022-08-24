import * as React from "react";

interface LogoProps {
  color?: string
}

const LogoMenu = ({ color = '#000' }: LogoProps) => (
  <svg width="512" height="330" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ zoom: 0.06, width: "350px" }}>
    <path fillRule="evenodd" clipRule="evenodd" d="M7.24 1.995C2.335 4.986.009 9.521.005 16.102c-.005 6.586 2.53 11.131 7.999 14.344L11.5 32.5h489l3.497-2.054c5.469-3.213 8.004-7.758 7.999-14.344-.004-6.58-2.33-11.116-7.237-14.107C501.53.026 499.21.007 256 .007 12.79.007 10.47.027 7.24 1.995Zm0 149C2.36 153.97.008 158.527.008 165c0 6.473 2.354 11.03 7.234 14.005 3.229 1.969 5.549 1.988 248.759 1.988 243.21 0 245.53-.019 248.759-1.988 4.88-2.975 7.234-7.532 7.234-14.005 0-6.473-2.354-11.03-7.234-14.005-3.229-1.969-5.549-1.988-248.759-1.988-243.21 0-245.53.019-248.76 1.988Zm5.035 146.966C4.332 299.872.007 305.527.007 314c0 6.473 2.354 11.03 7.234 14.005 3.206 1.955 5.29 1.988 128.759 1.988 123.469 0 125.553-.033 128.759-1.988 4.907-2.991 7.233-7.526 7.237-14.107.005-6.586-2.53-11.131-7.999-14.344-3.472-2.039-4.366-2.055-125.997-2.211-67.375-.087-123.951.191-125.725.618Z" fill={color} />
  </svg>
);

export default LogoMenu;