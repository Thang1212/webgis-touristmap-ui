import React from "react";
import type { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  onClick: () => void;
  disabled?: boolean;
  icon: LucideIcon;
  label: string;
  isWindowMode?: boolean;
  variant?: "default" | "favorite" | "call" | "web";
  iconProps?: React.ComponentProps<LucideIcon>;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  disabled = false,
  icon: Icon,
  label,
  isWindowMode = false,
  variant = "default",
  iconProps = {},
}) => {
  const baseClasses = `
    group flex flex-col items-center justify-center 
    font-semibold border-2 rounded-lg sm:rounded-xl 
    transition-all duration-200
    ${isWindowMode 
      ? "gap-0.5 px-1.5 py-2 text-[9px]" 
      : "gap-1 sm:gap-2 px-2 sm:px-3 py-2 sm:py-3 text-[10px] sm:text-sm"
    }
  `;

  const variantClasses = {
    default: disabled
      ? "opacity-40 cursor-not-allowed border-gray-200 text-gray-400"
      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md active:scale-95",
    
    favorite: disabled
      ? "opacity-50 cursor-not-allowed bg-gradient-to-br from-red-50 to-pink-50 border-red-400 text-red-600"
      : "bg-gradient-to-br from-red-50 to-pink-50 border-red-400 text-red-600 hover:from-red-100 hover:to-pink-100 shadow-sm hover:shadow-md active:scale-95",
    
    call: disabled
      ? "opacity-40 cursor-not-allowed border-gray-200 text-gray-400"
      : "bg-white border-gray-300 text-gray-700 hover:bg-green-50 hover:border-green-400 hover:text-green-700 hover:shadow-md active:scale-95",
    
    web: disabled
      ? "opacity-40 cursor-not-allowed border-gray-200 text-gray-400"
      : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 hover:shadow-md active:scale-95",
  };

  const iconSize = isWindowMode ? "w-4 h-4" : "w-4 h-4 sm:w-5 sm:h-5";
  
  const iconAnimation = variant === "favorite" 
    ? "transition-all scale-110" 
    : "transition-transform group-hover:scale-110";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]}`}
      aria-label={label}
    >
      <Icon
        className={`${iconSize} ${iconAnimation} ${iconProps.className || ""}`}
        {...iconProps}
      />
      <span className="font-bold leading-tight">{label}</span>
    </button>
  );
};

export default ActionButton;