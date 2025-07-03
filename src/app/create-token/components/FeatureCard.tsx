import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  selected: boolean;
  onToggle: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon, 
  selected, 
  onToggle 
}) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={selected}
      data-state={selected ? 'checked' : 'unchecked'}
      className={`space-y-4 rounded-xl border p-6 text-left outline-none transition-colors ${
        selected 
          ? 'border-primary-300' 
          : 'border-background-300'
      }`}
      onClick={onToggle}
    >
      <div className="flex items-center justify-center rounded-full bg-background-200 text-text-500 w-8 h-8">
        {icon}
      </div>
      <div className="space-y-2">
        <strong className="block text-sm/[1.5] font-medium text-text-500">
          {title}
        </strong>
        <p className="block text-text-300 text-sm/[1.5]">
          {description}
        </p>
      </div>
    </button>
  );
};

export default FeatureCard;
