import * as React from 'react';
import { cn } from '@/lib/utils';

export const Stepper = ({ value, max, children, className }) => {
  return (
    <div className={cn('flex items-center w-full', className)}>
      {React.Children.map(children, (child, idx) =>
        React.cloneElement(child, {
          active: value === idx,
          completed: value > idx,
          first: idx === 0,
          last: idx === React.Children.count(children) - 1,
        })
      )}
    </div>
  );
};

export const Step = ({ value, active, completed, first, last, children }) => {
  return (
    <div className="flex flex-col items-center flex-1 min-w-0 relative">
      <StepIndicator active={active} completed={completed} />
      <div className="mt-2 text-xs font-medium text-center text-gray-700 min-w-[80px]">{children}</div>
    </div>
  );
};

export const StepIndicator = ({ active, completed }) => (
  <div
    className={cn(
      'w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all',
      active
        ? 'bg-blue-500 border-blue-500 text-white'
        : completed
        ? 'bg-blue-100 border-blue-500 text-blue-500'
        : 'bg-gray-200 border-gray-300 text-gray-400'
    )}
  >
    {completed ? (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
    ) : null}
  </div>
);

export const StepSeparator = ({ completed }) => (
  <div className={cn('h-1 w-full rounded transition-all', completed ? 'bg-blue-500' : 'bg-gray-200')} />
); 