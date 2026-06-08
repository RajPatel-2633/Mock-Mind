import React from 'react';
import { cn } from "../../lib/utils";

export default function Button({ children, variant = 'primary', iconNode, className, ...props }) {
  const isPrimary = variant === 'primary';
  
  return (
    <button 
      className={cn(
        "relative flex w-full items-center justify-center gap-2 rounded-[10px] px-4 py-2.5 text-sm font-medium transition-all duration-200",
        isPrimary 
          ? "bg-accentOrange text-white hover:bg-accentOrangeHover hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] border border-transparent"
          : "bg-transparent text-primary border border-borderCard hover:bg-white/5",
        className
      )}
      {...props}
    >
      {iconNode && iconNode}
      {children}
    </button>
  );
}
