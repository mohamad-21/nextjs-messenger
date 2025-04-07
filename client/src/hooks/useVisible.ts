import { RefObject, useEffect, useState } from "react";

export function useIsVisible(ref: RefObject<any>) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (ref.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting && !isIntersecting) {
          setIsIntersecting(entry.isIntersecting);
        }
      })

      observer.observe(ref.current);

      return () => {
        observer.disconnect();
      }
    }
  }, [ref]);

  return isIntersecting;
}