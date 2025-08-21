import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollRestore = () => {
  const location = useLocation();

  useEffect(() => {
    // Restore scroll when location changes
    const restoreScroll = () => {
      // Remove any modal-related classes and styles
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.documentElement.style.overflow = '';
      
      // Scroll to top
      window.scrollTo(0, 0);
    };

    // Small delay to ensure cleanup happens after navigation
    const timeoutId = setTimeout(restoreScroll, 50);

    return () => clearTimeout(timeoutId);
  }, [location.pathname]);

  return null;
};

export default ScrollRestore; 