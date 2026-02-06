// "use client"
// import React, { useState } from 'react'
// import { HexColorPicker } from "react-colorful";

// const ColorPicker = () => {
// const [color, setColor] = useState("#aabbcc");
//   return <HexColorPicker color={color} onChange={setColor} />;
// }

// export default ColorPicker



"use client"
import React from 'react'
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  return <HexColorPicker color={color} onChange={onChange} />;
}

export default ColorPicker;
