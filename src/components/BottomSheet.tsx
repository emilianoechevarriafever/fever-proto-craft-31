import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const BottomSheet = ({ isOpen, onClose, title, children }: BottomSheetProps) => {
  // Block body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Add class to body to prevent scrolling
      document.body.classList.add('modal-open');
      
      // Prevent iOS bounce/overscroll
      const preventDefault = (e: TouchEvent) => {
        e.preventDefault();
      };
      
      document.addEventListener('touchmove', preventDefault, { passive: false });
      
      return () => {
        document.removeEventListener('touchmove', preventDefault);
      };
    } else {
      // Remove class from body to restore scrolling
      document.body.classList.remove('modal-open');
    }
  }, [isOpen]);

  // Additional cleanup effect to ensure scroll is restored when component unmounts
  useEffect(() => {
    return () => {
      // Always clean up when component unmounts
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
        style={{ touchAction: 'none' }}
      />
      
      {/* Sheet */}
      <div 
        className="fever-bottom-sheet fever-slide-up z-50 h-[90vh] flex flex-col"
        style={{ 
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          touchAction: 'none',
          overscrollBehavior: 'none'
        }}
        onTouchMove={(e) => {
          // Allow scroll within the bottom sheet content
          const target = e.target as HTMLElement;
          const scrollableParent = target.closest('[data-scrollable="true"]') || 
                                  target.closest('.overflow-y-auto') ||
                                  target.closest('.overflow-y-scroll');
          if (!scrollableParent) {
            e.preventDefault();
          }
        }}
      >
        {/* Header - Optional */}
        {title && (
          <div className="flex items-center justify-between p-5 border-b border-border flex-shrink-0">
            <h2 className="fever-h2">{title}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        )}
        
        {/* Content */}
        <div className={`flex-1 flex flex-col ${title ? 'p-5' : ''}`} style={{ overflow: 'hidden' }}>
          {children}
        </div>
      </div>
    </>
  );
};

export default BottomSheet;