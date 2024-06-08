import { useRef, useState } from "react";
import Tooltip from "./Tooltip";
import { TooltipPosition } from "../utils/enums";

interface Props extends React.PropsWithChildren {
  onClick?(): void;
  className?: string;
  tooltipContent?: React.ReactNode;
  tooltipPosition?: TooltipPosition;
}

function Button({
  onClick,
  children,
  className,
  tooltipContent,
  tooltipPosition = TooltipPosition.Bottom,
}: Props) {
  const [isHover, setIsHover] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isTooltipShowing = tooltipContent && isHover && buttonRef.current;

  return (
    <>
      {isTooltipShowing && (
        <Tooltip
          position={tooltipPosition}
          element={buttonRef.current}
        >
          {tooltipContent}
        </Tooltip>
      )}
      <button
        ref={buttonRef}
        className={`text-white p-2 rounded-full shadow-lg no-underline bg-spotify-green ${className}`}
        onClick={onClick}
        onMouseEnter={() => {
          setIsHover(true);
        }}
        onMouseLeave={() => {
          setIsHover(false);
        }}
      >
        {children}
      </button>
    </>
  );
}

export default Button;
