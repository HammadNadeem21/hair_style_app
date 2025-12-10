import { Input } from "@/components/ui/input"

interface InputFieldsProps {
    fields: {
        type: string;
        placeholder: string;
        value?: string;
        onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
        icons?: React.ReactNode;
    }[];
}


export function InputFields({fields}: InputFieldsProps) {
  return (
    <>
    {fields.map((field, index) => (
      <Input
        key={index}
        type={field.type}
        placeholder={field.placeholder}
        value={field.value}
        onChange={field.onChange}
        className="text-sm text-[#565d6d] rounded-lg"
      />
    ))}
    </>
  )
}
