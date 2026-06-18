import React, { useRef, useState, useEffect } from 'react';

export default function Reveal({
  children,
  delay = 0,
  direction = 'up',
  duration = 700
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Unobserve after element becomes visible to run animation only once
          if (currentRef) {
            observer.unobserve(currentRef);
          }
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before it fully rolls in
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Map directions to CSS transform properties
  const getDirectionClass = () => {
    switch (direction) {
      case 'down':
        return isVisible ? 'translate-y-0' : '-translate-y-10';
      case 'left':
        return isVisible ? 'translate-x-0' : 'translate-x-10';
      case 'right':
        return isVisible ? 'translate-x-0' : '-translate-x-10';
      case 'up':
      default:
        return isVisible ? 'translate-y-0' : 'translate-y-10';
    }
  };

  return (
    <div
      ref={ref}
      className={`transition-all ease-out`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        opacity: isVisible ? 1 : 0,
        transform: getDirectionClass()
      }}
    >
      {children}
    </div>
  );
}
