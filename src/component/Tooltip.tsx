import { useRef, useState } from "react";
import TooltipComponent from "./TooltipComponent";
import { TooltipPosition } from "../utils/enums";

interface ChildrenProps<T> {
  ref: React.RefObject<T>;
  setHover: (hover: boolean) => void;
}

interface Props<T> {
  position: TooltipPosition;
  children: (props: ChildrenProps<T>) => React.ReactNode;
  tooltipElement?: React.ReactNode;
  tooltipClass?: string;
  tooltipEnabled?: boolean;
}

function Tooltip<T extends HTMLElement>({
  children,
  position,
  tooltipElement,
  tooltipClass,
  tooltipEnabled = true,
}: Props<T>) {
  const [isHover, setIsHover] = useState(false);
  const ref = useRef<T>(null);

  return (
    <>
      {tooltipEnabled && ref.current && isHover && (
        <TooltipComponent
          position={position}
          element={ref.current}
          className={tooltipClass}
        >
          {tooltipElement}
        </TooltipComponent>
      )}
      {children({ ref: ref, setHover: setIsHover })}
    </>
  );
}

export default Tooltip;
