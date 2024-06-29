import { useCallback } from "react";

function useDynamicTopbar<T extends HTMLElement>(topbarContentEl: T | null) {
  const topbarContentTriggerRef = useCallback(
    (node: HTMLDivElement) => {
      if (!node) return;
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            topbarContentEl?.classList.add("invisible");
          } else {
            topbarContentEl?.classList.remove("invisible");
          }
        },
        {
          threshold: 0.5,
        }
      );

      observer.observe(node);
    },
    [topbarContentEl]
  );

  return topbarContentTriggerRef;
}

export default useDynamicTopbar;
