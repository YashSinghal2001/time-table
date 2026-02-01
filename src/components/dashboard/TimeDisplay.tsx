import React, { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';

const FlipCard: React.FC<{ value: string }> = ({ value }) => {
  // We need to track BOTH the current display value and the previous value to animate between them.
  // When 'value' prop changes, it becomes the 'next' value we want to flip TO.
  // The 'current' display remains the OLD value until animation completes.
  
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);
  const previousValueRef = useRef(value);

  useEffect(() => {
    if (value !== previousValueRef.current) {
      // Start animation
      setIsAnimating(true);
      
      const timer = setTimeout(() => {
        // Animation complete: Update state to new static value
        setIsAnimating(false);
        setDisplayValue(value);
        previousValueRef.current = value;
      }, 500); // 500ms matches CSS animation duration

      return () => clearTimeout(timer);
    }
  }, [value]);

  // Logic:
  // Static State: Top=Current, Bottom=Current
  // Animation State:
  //   1. Top(Old) rotates DOWN to -90deg (revealing Top(New) behind it? No, revealing nothing if we don't stack right)
  //   2. Bottom(New) rotates UP from 90deg to 0deg (covering Bottom(Old))
  
  // Correct Stacking for Flip Effect:
  // Base Layer (Static): Top(New) + Bottom(Old) -> This is what you see "underneath" the flipping cards.
  // Animating Layer: Top(Old) [Flips Down] + Bottom(New) [Flips Up]
  
  const topHalfStatic = value; // The new value (eventual top)
  const bottomHalfStatic = previousValueRef.current; // The old value (still visible at bottom initially)
  
  const topHalfAnimating = previousValueRef.current; // Old value flipping down
  const bottomHalfAnimating = value; // New value flipping up

  // Special styling for AM/PM card (smaller text)
  const isAmPm = value === 'AM' || value === 'PM';

  return (
    <div className={`flip-card ${isAmPm ? 'w-8 h-8 md:w-11 md:h-12 text-[10px] md:text-sm' : 'w-7 h-9 md:w-10 md:h-12 text-sm md:text-2xl'} font-bold bg-gray-100 dark:bg-gray-800 rounded-lg ${isAnimating ? 'flip-animating' : ''}`}>
      
      {/* 1. Base Layer (Static Background) */}
      {/* Visible parts during animation: Top(New) is visible when Top(Old) flips down. Bottom(Old) is visible until Bottom(New) flips up. */}
      <div className="absolute inset-0 flex flex-col">
          <div className="h-1/2 overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-t-lg border-b border-gray-300 dark:border-gray-600 flex justify-center items-end">
             <span className="transform translate-y-1/2">{isAnimating ? topHalfStatic : displayValue}</span>
          </div>
          <div className="h-1/2 overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-b-lg flex justify-center items-start">
             <span className="transform -translate-y-1/2">{isAnimating ? bottomHalfStatic : displayValue}</span>
          </div>
      </div>

      {/* 2. Animating Layer (Only present during animation) */}
      {isAnimating && (
        <>
          {/* Top Half (Old Value) -> Flips DOWN */}
          <div className="absolute inset-0 h-1/2 overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-t-lg border-b border-gray-300 dark:border-gray-600 flex justify-center items-end z-10 origin-bottom current flip-card-top backface-hidden">
            <span className="transform translate-y-1/2">{topHalfAnimating}</span>
          </div>
          
          {/* Bottom Half (New Value) -> Flips UP */}
          <div className="absolute top-1/2 left-0 right-0 h-1/2 overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-b-lg flex justify-center items-start z-10 origin-top next flip-card-bottom backface-hidden">
            <span className="transform -translate-y-1/2">{bottomHalfAnimating}</span>
          </div>
        </>
      )}
    </div>
  );
};

export const TimeDisplay: React.FC = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // Sync with system seconds to avoid drift
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Format: hh, mm, ss, a
  const hours = format(now, 'hh');
  const minutes = format(now, 'mm');
  const seconds = format(now, 'ss');
  const ampm = format(now, 'a');

  return (
    <div className="flex flex-col items-center justify-center h-full px-2 py-1 max-w-full overflow-hidden">
      <div className="flex items-center gap-0.5 md:gap-1">
        <div className="flex gap-0.5">
            <FlipCard value={hours[0]} />
            <FlipCard value={hours[1]} />
        </div>
        <div className="text-sm md:text-2xl font-bold text-gray-400 pb-0.5">:</div>
        <div className="flex gap-0.5">
            <FlipCard value={minutes[0]} />
            <FlipCard value={minutes[1]} />
        </div>
        <div className="text-sm md:text-2xl font-bold text-gray-400 pb-0.5">:</div>
        <div className="flex gap-0.5">
            <FlipCard value={seconds[0]} />
            <FlipCard value={seconds[1]} />
        </div>
        <div className="ml-1 flex items-center h-full">
            <FlipCard value={ampm} />
        </div>
      </div>
      <div className="text-[10px] md:text-sm text-gray-500 dark:text-gray-400 mt-1.5 font-medium tracking-wide truncate max-w-full">
        {format(now, 'EEEE, MMMM do, yyyy')}
      </div>
    </div>
  );
};
