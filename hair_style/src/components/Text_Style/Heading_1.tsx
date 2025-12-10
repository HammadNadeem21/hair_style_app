// export function Heading_1({value, textColor}: {value: string, textColor?: string}) {
//   return (
//     <h3 className={`scroll-m-20 text-2xl font-semibold tracking-tight capitalize ${textColor ? textColor : 'text-black'}`}>
//     {value}
//     </h3>
//   )
// }

import { cn } from "@/lib/utils";

type Heading1Props = {
  value?: string;
  textColor?: string; // Tailwind color class
  className?: string;
  children?: React.ReactNode;
};

export function Heading_1({
  value,
  textColor,
  className,
  children,
}: Heading1Props) {
  return (
    <h1
      className={cn(
        " text-2xl font-semibold tracking-tight capitalize",
        textColor ?? "text-black",
        className
      )}
    >
      {value ?? children}
    </h1>
  );
}
