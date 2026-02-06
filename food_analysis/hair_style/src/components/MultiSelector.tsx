// "use client"
// import React, { useState } from 'react'

// const MultiSelector = () => {
//     const [hairStyle, setHairStyle] = useState<Array<"asian" | "western">>([]);

//     const toggleHairStyle = (type: "asian" | "western") => {
//   setHairStyle(prev =>
//     prev.includes(type)
//       ? prev.filter(item => item !== type) // remove if exists
//       : [...prev, type] // add if not exists
//   );
// };


//   return (
// <div className="flex items-center justify-center gap-3 mt-1 mb-1">
//   <label className="block font-medium text-grayColor">Hair Styles: </label>

//   <div className="flex items-center justify-start gap-1">

//     {/* Asian */}
//     <button
//       className={`py-1 px-3 rounded-lg text-sm ${
//         hairStyle.includes("asian")
//           ? "bg-primaryColor text-white"
//           : "bg-white border border-grayColor text-grayColor"
//       }`}
//       onClick={() => toggleHairStyle("asian")}
//     >
//       Asian
//     </button>

//     {/* Western */}
//     <button
//       className={`py-1 px-3 rounded-lg text-sm ${
//         hairStyle.includes("western")
//           ? "bg-primaryColor text-white"
//           : "bg-white border border-grayColor text-grayColor"
//       }`}
//       onClick={() => toggleHairStyle("western")}
//     >
//       Western
//     </button>
//   </div>
// </div>

//   )
// }

// export default MultiSelector



"use client";
import React from "react";

type MultiSelectProps<T extends string> = {
  label?: string;
  options: T[];
  selected: T[];
  onChange: (updated: T[]) => void;
};

export function MultiSelect<T extends string>({
  label,
  options,
  selected,
  onChange,
}: MultiSelectProps<T>) {

  const toggleValue = (value: T) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className={`flex flex-col items-start justify-center gap-2 w-full`}>
      {label && <label className="font-bold text-sky-500 text-sm w-full text-left">{label}</label>}

      <div className="grid grid-cols-2 gap-2 bg-gray-100/50 p-1.5 rounded-xl w-full">
        {options.map((opt) => (
          <button
            key={opt}
            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${selected.includes(opt)
              ? "bg-primaryColor text-white shadow-md"
              : "text-gray-500 bg-grayColor/15"
              }`}
            onClick={() => toggleValue(opt)}
          >
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}
