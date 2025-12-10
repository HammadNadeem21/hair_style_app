// import React from 'react'
// import { Sparkles } from 'lucide-react'

// const Logo = () => {
//   return (
//     <div className='bg-primaryColor rounded-xl h-[60px] w-[60px] text-white flex items-center justify-center'>
//       <Sparkles size={35}/>
    
//     </div>
//   )
// }

// export default Logo


import React from "react";
import { Sparkles } from "lucide-react";

interface LogoProps {
  size?: number;           // icon size
  height?: string;         // container height
  width?: string;          // container width
  bgColor?: string;        // background color (Tailwind class)
  radius?: string;         // border radius
  className?: string;      // additional classes
}

const Logo = ({
  size = 35,
  height = "h-[60px]",
  width = "w-[60px]",
  bgColor = "bg-primaryColor",
  radius = "rounded-xl",
  className = "",
}: LogoProps) => {
  return (
    <div
      className={`${bgColor} ${radius} ${height} ${width} text-white flex items-center justify-center ${className}`}
    >
      <Sparkles size={size} />
    </div>
  );
};

export default Logo;
