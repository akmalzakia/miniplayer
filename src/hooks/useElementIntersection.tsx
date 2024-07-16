interface ObserverOptions {
  root?: Document | Element | null | undefined;
  rootMargin?: string | undefined;
  threshold?: number | number[] | undefined;
}

function useElementIntersection() {
  function observeElementIntersectTop(
    node: HTMLDivElement,
    callback: () => void,
    root?: Document | Element | null | undefined
  ) {
    function handleIntersect(entries: IntersectionObserverEntry[]) {
      const target = entries[0];

      if (!target.isIntersecting) return;

      callback();
    }

    const observer = new IntersectionObserver(handleIntersect, {
      root: root,
      rootMargin: "-1% 0% -99% 0%",
      threshold: 0,
    });

    observer.observe(node);
  }

  function observeElementVisibility(
    node: HTMLDivElement,
    onVisible?: () => void,
    onHidden?: () => void,
    options?: ObserverOptions,
  ) {
    function handleIntersect(entries: IntersectionObserverEntry[]) {
      const target = entries[0];

      if (target.isIntersecting) {
        onVisible?.();
      } else {
        onHidden?.();
      }
    }

    const observer = new IntersectionObserver(handleIntersect, options);

    observer.observe(node);
  }

  return { observeElementIntersectTop, observeElementVisibility };
}

export default useElementIntersection;
