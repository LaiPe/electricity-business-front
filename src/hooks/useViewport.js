import { useState, useEffect } from 'react';

const DEFAULT_BREAKPOINTS = { mobile: 768, tablet: 1024 };

export default function useViewport(breakpoints = DEFAULT_BREAKPOINTS) {
  const [size, setSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = size.width <= breakpoints.mobile;
  const isTablet = size.width > breakpoints.mobile && size.width <= breakpoints.tablet;
  const isDesktop = size.width > breakpoints.tablet;
  const format = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';

  return { ...size, isMobile, isTablet, isDesktop, format };
}
