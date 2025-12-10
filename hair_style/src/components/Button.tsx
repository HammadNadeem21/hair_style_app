// import React from 'react'

// const Button = ({value}:{value: string}) => {
//   return (
//     <button className='w-full flex items-center justify-center bg-primaryColor text-white rounded-lg py-2'>
//       {value}
//     </button>

//   )
// }

// export default Button;


// import { Button } from "@/components/ui/button"

// export function Button({value, variant}: {value: string, variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'}) {
//   return <Button variant={variant}
//   className={`w-full flex items-center justify-center 
//     ${variant === 'default' ? 'bg-primaryColor' : ''}
//     ${variant === 'default' ? 'text-white' : ''}
//     ${variant === 'default' ? 'hover:bg-primaryColor' : ''}
//     ${variant === 'default' ? 'hover:shadow-xl' : ''}  
    
//     `}
//   >{value}</Button>
// }



"use client";

import { Button as ShadButton } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // optional but recommended
import { ComponentProps } from "react";

// Combine all ShadButton props + value
type MyButtonProps = ComponentProps<typeof ShadButton> & {
  value?: string;
};

export function MyButton({ value, children, className, ...props }: MyButtonProps) {
  return (
    <ShadButton
      {...props}
      className={cn(
        "w-full flex items-center justify-center",
        props.variant === "default" && "bg-primaryColor text-white hover:bg-primaryColor hover:shadow-xl",
        className
      )}
    >
      {value ?? children}
    </ShadButton>
  );
}
