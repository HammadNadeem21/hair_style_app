import { cn } from "@/lib/utils"; // optional, recommended

type SmallTextProps = {
  value?: string;
  textColor?: string; // tailwind class (e.g. "text-red-500")
  className?: string;
  children?: React.ReactNode;
};

export function SmallText({
  value,
  textColor,
  className,
  children,
}: SmallTextProps) {
  return (
    <small
      className={cn(
        "text-sm leading-none font-medium",
        textColor ?? "text-black",
        className
      )}
    >
      {value ?? children}
    </small>
  );
}
