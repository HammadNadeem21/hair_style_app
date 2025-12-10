import { cn } from "@/lib/utils";

type Heading1Props = {
  value?: string;
  textColor?: string; // Tailwind color class
  className?: string;
  children?: React.ReactNode;
};
export function Heading_2({
  value,
  textColor,
  className,
  children,
}: Heading1Props) {
  return (
    <h2 className={cn(
            " text-lg font-normal tracking-tight capitalize",
            textColor ?? "text-black",
            className
          )}>
      {value ?? children}
    </h2>
  )
}
