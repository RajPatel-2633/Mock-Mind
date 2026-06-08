import * as React from "react";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/utils";
import { useMotionTemplate, useMotionValue, motion } from "framer-motion";

const Input = React.forwardRef(({ className, type, icon: Icon, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const currentType = isPassword ? (showPassword ? "text" : "password") : type;

  const radius = 100;
  const [visible, setVisible] = React.useState(false);
  
  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      style={{
        background: useMotionTemplate`
      radial-gradient(
        ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
        var(--accent-orange, #f97316),
        transparent 80%
      )
    `,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="p-[2px] rounded-xl transition duration-300 group/input relative mb-1"
    >
      <div className="relative flex items-center w-full">
        {Icon && (
          <div className="absolute left-3 text-secondary z-10 pointer-events-none">
            <Icon size={18} />
          </div>
        )}
        <input
          type={currentType}
          className={cn(
            `flex h-10 w-full border border-white/10 bg-black/40 text-primary rounded-[10px] px-3 py-2 text-sm transition duration-400
            placeholder:text-secondary focus-visible:outline-none focus-visible:ring-[1px] focus-visible:ring-accentOrange
            group-hover/input:shadow-none`,
            Icon ? "pl-9" : "pl-3",
            className
          )}
          ref={ref}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 z-10 text-secondary hover:text-primary transition-colors flex items-center justify-center p-1"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </motion.div>
  );
});
Input.displayName = "Input";

export default Input;
