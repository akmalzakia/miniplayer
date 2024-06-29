import { useCallback } from "react";

function useDynamicTopbar<T extends HTMLElement>(
  topbarContentRef: React.RefObject<T>
) {
  const topbarContentTriggerRef = useCallback(
    (
      node: HTMLDivElement,
      onTriggerVisible?: () => void,
      onTriggerInvisible?: () => void
    ) => {
      if (!node) return;
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            topbarContentRef.current?.classList.add("invisible");
            onTriggerVisible?.();
          } else {
            topbarContentRef.current?.classList.remove("invisible");
            onTriggerInvisible?.();
          }
        }
      );

      observer.observe(node);
    },
    [topbarContentRef]
  );

  return topbarContentTriggerRef;
}

export default useDynamicTopbar;
