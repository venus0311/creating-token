import React from 'react';

interface RadioGroupProps {
  options: Array<{ value: string; label: string }>;
  selectedValue: string;
  onChange: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ options, selectedValue, onChange }) => {
  return (
    <div role="radiogroup" className="grid grid-cols-2 gap-4">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={selectedValue === option.value}
          data-state={selectedValue === option.value ? 'checked' : 'unchecked'}
          className="w-full group flex items-center gap-1.5 rounded-md bg-background-200 p-6"
          onClick={() => onChange(option.value)}
        >
          <div className="relative h-4 w-4 rounded-full border border-background-300 bg-white group-data-[state=checked]:border-white/60 group-data-[state=checked]:bg-primary-300 group-data-[state=checked]:ring-1 group-data-[state=checked]:ring-primary-300/60 group-data-[state=checked]:ring-offset-1 group-data-[state=checked]:ring-offset-background-200">
            {selectedValue === option.value && (
              <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-sm"></span>
            )}
          </div>
          <label className="text-sm font-medium leading-none">{option.label}</label>
        </button>
      ))}
    </div>
  );
};

export default RadioGroup;
