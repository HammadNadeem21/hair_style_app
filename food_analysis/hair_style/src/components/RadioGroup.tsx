// "use client";

// import React, { useState } from 'react';
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { cn } from "@/lib/utils";

// export function RadioGroupDemo() {
//     const [gender, setGender] = useState("");

//     const options = [
//         { value: "Male", label: "Male", id: "male" },
//         { value: "Female", label: "Female", id: "female" },
//         { value: "Other", label: "Other", id: "other" },
//     ];

//     return (
//         <RadioGroup
//             value={gender}
//             onValueChange={setGender}
//             className="flex flex-col gap-3 w-full max-w-sm mx-auto p-2"
//         >
//             {options.map((option) => (
//                 <div
//                     key={option.id}
//                     onClick={() => setGender(option.value)}
//                     className={cn(
//                         "flex items-center justify-between gap-4 px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300",
//                         "border backdrop-blur-md",
//                         gender === option.value
//                             ? "bg-primaryColor/15 border-primaryColor/40 shadow-[0_0_20px_rgba(var(--primary-color-rgb),0.1)]"
//                             : " "
//                     )}
//                 >
//                     <div className="flex items-center gap-4">
//                         <span className={cn(
//                             "text-base font-medium transition-colors duration-300",
//                             gender === option.value ? "text-primaryColor" : "text-black"
//                         )}>
//                             {option.label}
//                         </span>
//                     </div>

//                     <RadioGroupItem
//                         value={option.value}
//                         id={option.id}
//                         className={cn(
//                             "border-2 transition-all duration-300",
//                             gender === option.value
//                                 ? "border-primaryColor bg-primaryColor/10"
//                                 : "border-primaryColor/30 "
//                         )}
//                     />
//                 </div>
//             ))}
//         </RadioGroup>
//     );
// }







"use client";

import * as React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

export type RadioOption = {
    value: string;
    label: string;
    id: string;
};

type RadioCardGroupProps = {
    value: string;
    onChange: (value: string) => void;
    options: RadioOption[];
    className?: string;
};

export function RadioCardGroup({
    value,
    onChange,
    options,
    className,
}: RadioCardGroupProps) {
    return (
        <RadioGroup
            value={value}
            onValueChange={onChange}
            className={cn("flex flex-col gap-3 w-full", className)}
        >
            {options.map((option) => {
                const selected = value === option.value;

                return (
                    <div
                        key={option.id}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "flex items-center justify-between px-4 py-3 rounded-2xl cursor-pointer transition-all duration-300",
                            "border backdrop-blur-md",
                            selected
                                ? "bg-primaryColor/15 border-primaryColor/40 shadow-[0_0_20px_rgba(var(--primary-color-rgb),0.1)]"
                                : "border-primaryColor/20"
                        )}
                    >
                        <span
                            className={cn(
                                "text-base font-medium transition-colors",
                                selected ? "text-primaryColor" : "text-black"
                            )}
                        >
                            {option.label}
                        </span>

                        <RadioGroupItem
                            value={option.value}
                            id={option.id}
                            className={cn(
                                "border-2 transition-all",
                                selected
                                    ? "border-primaryColor bg-primaryColor/10"
                                    : "border-primaryColor/30"
                            )}
                        />
                    </div>
                );
            })}
        </RadioGroup>
    );
}
