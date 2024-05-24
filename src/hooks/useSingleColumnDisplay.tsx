import { useLayoutEffect, useRef, useState } from "react";


function useSingleColumnDisplay(minColSize = 100) {
  const [size, setSize] = useState(0);

  const columnRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    function updateColumnSize() {
      if (!columnRef.current) return;

      const w = columnRef.current?.clientWidth;
      const numOfColumns = Math.floor(w / minColSize);
      setSize(numOfColumns);
    }

    updateColumnSize();

    window.addEventListener("resize", updateColumnSize);
    return () => window.removeEventListener("resize", updateColumnSize);
  }, [minColSize]);

  return [size, columnRef] as const;
}

export default useSingleColumnDisplay
