import React, { useRef, useEffect, useState } from 'react';

interface AnimatePresenceProps {
  children: React.ReactNode;
}

export const AnimatePresence: React.FC<AnimatePresenceProps> = ({ children }) => {
  return <>{children}</>;
};

export const useInView = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return { ref, isInView };
};

export const FadeIn: React.FC<{
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  className?: string;
}> = ({
  children,
  direction = 'up',
  delay = 0,
  className = '',
}) => {
  const { ref, isInView } = useInView();

  const directionClasses = {
    up: 'translate-y-8',
    down: '-translate-y-8',
    left: 'translate-x-8',
    right: '-translate-x-8',
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${className} ${
        isInView
          ? 'opacity-100 transform-none'
          : `opacity-0 ${directionClasses[direction]}`
      }`}
      style={{ 
        transitionDelay: `${delay * 100}ms`,
        willChange: 'transform, opacity' 
      }}
    >
      {children}
    </div>
  );
};