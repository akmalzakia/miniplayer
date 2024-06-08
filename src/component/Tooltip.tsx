import { useLayoutEffect, useRef, useState } from "react";
import { TooltipPosition } from "../utils/enums";
import { createPortal } from "react-dom";

interface Props extends React.PropsWithChildren {
  position: TooltipPosition;
  element: HTMLElement;
}

function Tooltip({ position, children, element }: Props) {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const rect = element.getBoundingClientRect();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const root = document.getElementById("root");
  const margin = 5; //px
  console.log(rect);

  let tooltipStyle: {
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };

  useLayoutEffect(() => {
    if (!tooltipRef.current) return;

    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const w = tooltipRect.width;
    const h = tooltipRect.height;

    setWidth(w);
    setHeight(h);
  }, []);

  switch (position) {
    case TooltipPosition.Bottom:
      tooltipStyle = {
        top: rect.top + rect.height + margin,
        left: rect.left + rect.width / 2 - width / 2,
      };
      break;
    case TooltipPosition.Right:
      tooltipStyle = {
        top: rect.top + rect.height / 2 - height / 2,
        left: rect.left + rect.width + margin,
      };
      break;
    case TooltipPosition.Top:
      tooltipStyle = {
        top: rect.top - height - margin,
        left: rect.left + rect.width / 2 - width / 2,
      };
      break;
    case TooltipPosition.Left:
      tooltipStyle = {
        top: rect.top + rect.height / 2 - height / 2,
        left: rect.left - width - margin,
      };
      break;
    default: {
      const _exh: never = position;
      return _exh;
    }
  }

  return (
    root &&
    createPortal(
      <div
        ref={tooltipRef}
        className={`absolute bg-gray-700 text-xs p-1 rounded-md shadow-lg text-nowrap z-10`}
        style={tooltipStyle}
      >
        {children}
      </div>,
      root
    )
  );
}

export default Tooltip;
