import { useEffect, useImperativeHandle, useRef, useState } from "react";
import TooltipComponent from "./TooltipComponent";
import { TooltipPosition } from "../utils/enums";

interface ChildrenProps<T> {
  ref?: React.RefObject<T>;
  setHover: (hover: boolean) => void;
}

interface Props<T> {
  position: TooltipPosition;
  children: (props: ChildrenProps<T>) => React.ReactNode;
  tooltipElement?: React.ReactNode;
  tooltipClass?: string;
  tooltipEnabled?: boolean;
  innerRef?: React.Ref<T | null>;
}

function Tooltip<T extends HTMLElement>({
  children,
  position,
  tooltipElement,
  tooltipClass,
  tooltipEnabled = true,
  innerRef,
}: Props<T>) {
  const [isHover, setIsHover] = useState(false);
  const tooltipRef = useRef<T>(null);

  useImperativeHandle(innerRef, () => tooltipRef.current);

  useEffect(() => {
    tooltipRef.current?.addEventListener("click", () => {
      setIsHover((hover) => !hover);
    });
  }, []);

  return (
    <>
      {tooltipEnabled && tooltipRef.current && isHover && (
        <TooltipComponent
          position={position}
          element={tooltipRef.current}
          className={tooltipClass}
        >
          {tooltipElement}
        </TooltipComponent>
      )}
      {children({ ref: tooltipRef, setHover: setIsHover })}
    </>
  );
}

export default Tooltip;
