import { Button } from '@/components/ui/button';

interface ConfirmButtonProps {
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const ConfirmButton: React.FC<ConfirmButtonProps> = ({ onClick, type = "submit", disabled = false }) => {
  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="group flex truncate items-center justify-center gap-2 font-medium text-sm/[1.5] outline-none transition-all disabled:pointer-events-none disabled:opacity-60 relative bg-primary-base text-white hover:border-transparent [--spinner-border:theme('colors.white')] h-10 px-[14px] rounded-[10px] bg-[#f17b2c]"
    >
      Confirm and Create Token
      <span className="opacity-0 pointer-events-none group-data-[loading=true]:opacity-100 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity">
        <svg className="animate-spin size-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </span>
    </button>
  );
};

export default ConfirmButton;
