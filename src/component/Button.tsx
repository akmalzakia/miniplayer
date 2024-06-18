import { useImperativeHandle, useRef } from "react";
import { TooltipPosition } from "../utils/enums";
import Tooltip from "./Tooltip";

interface Props extends React.PropsWithChildren {
  onClick?(ev: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  className?: string;
  tooltipContent?: React.ReactNode;
  tooltipPosition?: TooltipPosition;
  innerRef?: React.Ref<HTMLButtonElement | null>;
}

function Button({
  onClick,
  children,
  className,
  tooltipContent,
  tooltipPosition = TooltipPosition.Bottom,
  innerRef,
}: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useImperativeHandle(innerRef, () => buttonRef.current);
  return (
    <>
      <Tooltip<HTMLButtonElement>
        position={tooltipPosition}
        tooltipClass='text-xs text-nowrap'
        tooltipElement={tooltipContent}
        tooltipEnabled={!!tooltipContent}
        innerRef={buttonRef}
      >
        {({ ref, setHover }) => {
          return (
            <button
              ref={ref}
              className={`text-white p-2 rounded-full shadow-lg no-underline bg-spotify-green ${className}`}
              onClick={(ev) => {
                onClick?.(ev);
              }}
              onMouseEnter={() => {
                setHover(true);
              }}
              onMouseLeave={() => {
                setHover(false);
              }}
            >
              {children}
            </button>
          );
        }}
      </Tooltip>
    </>
  );
}

export default Button;
