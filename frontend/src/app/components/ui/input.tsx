import * as React from "react";

import { cn } from "../../lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "block w-full rounded-md border border-gray-300 dark:border-gray-600" +
            " bg-white dark:bg-gray-700" +
            " text-gray-900 dark:text-gray-100" +
            " focus:border-blue-500 dark:focus:border-blue-400" +
            " focus:ring-blue-500 dark:focus:ring-blue-400",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
