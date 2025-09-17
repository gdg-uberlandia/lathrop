import { IconLoader2 } from "@tabler/icons-react";

export default function Loading() {
  return (
    <div className="w-full h-svh absolute flex items-center justify-center z-10 bg-black/80">
      <IconLoader2 className="size-14 animate-spin text-devBlue-dark" />
    </div>
  );
}
