import React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface InteractiveHoverButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
}

export const InteractiveHoverButton = React.forwardRef<
  HTMLButtonElement,
  InteractiveHoverButtonProps
>(({ text = "Button", className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "group relative w-auto min-w-[160px] cursor-pointer overflow-hidden rounded-full border border-white/10 bg-white/5 p-3 px-6 text-center font-semibold text-white backdrop-blur-md transition-all hover:bg-white hover:border-white hover:scale-105",
        className,
      )}
      {...props}
    >
      {/* Initial Text */}
      <span className="inline-block translate-x-0 transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0">
        {text}
      </span>
      
      {/* Hover Text (Black) */}
      <div className="absolute top-0 left-0 z-10 flex h-full w-full -translate-x-12 items-center justify-center gap-2 text-black opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        <span>{text}</span>
        <ArrowRight size={16} />
      </div>
      
      {/* The Expanding Dot (White Fill) */}
      <div className="absolute left-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-white opacity-0 transition-all duration-500 group-hover:scale-[50] group-hover:opacity-100"></div>
    </button>
  );
});

InteractiveHoverButton.displayName = "InteractiveHoverButton";
