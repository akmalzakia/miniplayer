import { TooltipPosition } from "../utils/enums";
import Tooltip from "./Tooltip";

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
  return (
    <>
      <Tooltip<HTMLButtonElement>
        position={tooltipPosition}
        tooltipClass='text-xs text-nowrap'
        tooltipElement={tooltipContent}
        tooltipEnabled={!!tooltipContent}
      >
        {({ ref, setHover }) => (
          <button
            ref={ref}
            className={`text-white p-2 rounded-full shadow-lg no-underline bg-spotify-green ${className}`}
            onClick={onClick}
            onMouseEnter={() => {
              setHover(true);
            }}
            onMouseLeave={() => {
              setHover(false);
            }}
          >
            {children}
          </button>
        )}
      </Tooltip>
    </>
  );
}

export default Button;
