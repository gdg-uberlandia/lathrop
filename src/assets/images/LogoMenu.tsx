interface LogoProps {
  color?: string;
  height?: number;
  width?: number;
}

const LogoMenu = ({ color = "#fff", height = 32, width = 32 }: LogoProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask
      id="mask0_8499_13779"
      style={{ maskType: "alpha" }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width={width}
      height={height}
    >
      <rect width={width} height={height} fill={color} />
    </mask>
    <g mask="url(#mask0_8499_13779)">
      <path d="M3 7V5H21V7H3ZM3 19V17H21V19H3ZM3 13V11H21V13H3Z" fill={color} />
    </g>
  </svg>
);
export default LogoMenu;
