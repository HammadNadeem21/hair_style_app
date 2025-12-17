"use client";

import React from 'react'
import { MultiSelect } from '@/components/MultiSelector'
import { SmallText } from '../Text_Style/Small_text';

interface HairFieldsProps {
    hairLength: "long" | "short" | null;
    setHairLength: (val: "long" | "short" | null) => void;
    hairStyle: Array<"asian" | "western">;
    setHairStyle: (val: Array<"asian" | "western">) => void;
}

export default function Hair_fields({
    hairLength,
    setHairLength,
    hairStyle,
    setHairStyle
}: HairFieldsProps) {

    return (
        <div className="">
            <SmallText value='Hair Feilds' textColor='text-primaryColor' className='text-left text-sm font-bold' />
            <div className="flex flex-col items-center gap-4 w-full">

                <div className='flex flex-col items-center gap-2 w-full'>

                    <label className='text-sm font-medium text-primaryColor uppercase tracking-wider shadow-xl py-2 px-4 border border-primaryColor rounded-xl'>Hair Length</label>
                    <div className='flex items-center justify-center gap-2 bg-gray-100/50 p-1.5 rounded-xl w-full max-w-[280px]'>
                        <button
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${hairLength === "long" ? 'bg-primaryColor text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setHairLength("long")}
                        >
                            Long
                        </button>

                        <button
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${hairLength === "short" ? 'bg-primaryColor text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setHairLength("short")}
                        >
                            Short
                        </button>
                    </div>
                </div>

                <MultiSelect
                    label="Hair Styles"
                    options={["asian", "western"]}
                    selected={hairStyle}
                    onChange={setHairStyle}
                />

            </div>
        </div>
    )
}