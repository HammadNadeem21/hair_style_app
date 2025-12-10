// "use client"
// import React, { useState } from 'react'


// const Form = () => {

//     const [ hairLength, setHairLength] = useState<"long" | "short" | null>(null)



//   return (
//     <div className='py-2 px-2 flex flex-col gap-4'>
      
//       <div className='flex items-center justify-center gap-3'>
//         <label className='block font-medium'>Hair Length: </label>

//         <div className='flex items-center justify-center gap-1'>

//       <button
//             className={`py-1 px-3 rounded-lg ${
//               hairLength === "long" ? 'bg-blue-500 text-white' : 'bg-[#bfdbfe] text-black'
//             }`}
//             onClick={() => setHairLength("long")}
//             disabled={hairLength === "short"} // disabled if short is selected
//           >
//             Long
//           </button>

//           <button
//             className={`py-1 px-3 rounded-lg ${
//               hairLength === "short" ? 'bg-blue-500 text-white' : 'bg-[#bfdbfe] text-black'
//             }`}
//             onClick={() => setHairLength("short")}
//             disabled={hairLength === "long"} // disabled if long is selected
//           >
//             Short
//           </button>
// </div>

//       </div>

//     </div>
//   )
// }

// export default Form





"use client"
import React, { useState } from 'react'

const Form = () => {
  const [hairLength, setHairLength] = useState<"long" | "short" | null>(null);
    const [hairStyle, setHairStyle] = useState<"asian" | "western" | null>(null)


const handleSubmit = () => {
    if (!hairLength && !hairStyle){
        alert("Please select an option")
    }
}

  return (
    <div className='py-2 px-2 flex flex-col justify-start items-start gap-4'>
      <div className='flex items-center justify-center gap-3 mt-1 mb-1'>
        <label className='block font-medium'>Hair Length: </label>

        <div className='flex items-center justify-start gap-1'>
          <button
            className={`py-1 px-3 rounded-lg ${
              hairLength === "long" ? 'bg-blue-500 text-white' : 'bg-[#bfdbfe] text-black'
            }`}
            onClick={() => setHairLength("long")}
          >
            Long
          </button>

          <button
            className={`py-1 px-3 rounded-lg ${
              hairLength === "short" ? 'bg-blue-500 text-white' : 'bg-[#bfdbfe] text-black'
            }`}
            onClick={() => setHairLength("short")}
          >
            Short
          </button>
        </div>
      </div>

<div className='flex items-center justify-center gap-3 mt-1 mb-1'>
        <label className='block font-medium'>Hair Styles: </label>

        <div className='flex items-center justify-start gap-1'>
          <button
            className={`py-1 px-3 rounded-lg ${
              hairStyle === "asian" ? 'bg-blue-500 text-white' : 'bg-[#bfdbfe] text-black'
            }`}
            onClick={() => setHairStyle("asian")}
          >
            Asian
          </button>

          <button
            className={`py-1 px-3 rounded-lg ${
              hairStyle === "western" ? 'bg-blue-500 text-white' : 'bg-[#bfdbfe] text-black'
            }`}
            onClick={() => setHairStyle("western")}
          >
            Western
          </button>
        </div>
      </div>

     
    </div>
  )
}

export default Form
