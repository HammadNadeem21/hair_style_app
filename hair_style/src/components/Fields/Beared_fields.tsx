"use client";

import React from 'react';
import { MultiSelect } from "../MultiSelector";
import { SmallText } from "../Text_Style/Small_text";

type BeardCoverageOption = "full" | "Patchy cheeks" | "Weak moustache";

interface BeardFieldsProps {
    beardCoverage: BeardCoverageOption[];
    setBeardCoverage: (val: BeardCoverageOption[]) => void;
    beardLength: "no moustache" | "light moustache" | "thick & dominant" | null;
    setBeardLength: (val: "no moustache" | "light moustache" | "thick & dominant" | null) => void;
}

export default function Beared_fields({
    beardCoverage,
    setBeardCoverage,
    beardLength,
    setBeardLength
}: BeardFieldsProps) {
    return (
        <div className="w-full">
            {/* <SmallText value='Beard Fields' textColor='text-sky-500' className='text-left text-lg font-bold mt-4' /> */}
            <div className="flex flex-col items-stretch gap-4 w-full">
                <div className='flex flex-col items-stretch gap-2 w-full mt-5'>

                    <SmallText value='Moustache Style' textColor='text-sky-500' className='text-left text-sm font-bold w-full' />
                    <div className='grid grid-cols-2 gap-2 bg-gray-100/50 p-1.5 rounded-xl w-full'>
                        <button
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${beardLength === "no moustache" ? 'bg-primaryColor text-white shadow-md' : 'text-gray-500 bg-grayColor/15'
                                }`}
                            onClick={() => setBeardLength("no moustache")}
                        >
                            No
                        </button>

                        <button
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${beardLength === "light moustache" ? 'bg-primaryColor text-white shadow-md' : 'text-gray-500 bg-grayColor/15'
                                }`}
                            onClick={() => setBeardLength("light moustache")}
                        >
                            Light
                        </button>

                        <button
                            className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-300 ${beardLength === "thick & dominant" ? 'bg-primaryColor text-white shadow-md' : 'text-gray-500 bg-grayColor/15'
                                }`}
                            onClick={() => setBeardLength("thick & dominant")}
                        >
                            Thick
                        </button>
                    </div>
                </div>

                <MultiSelect
                    label="Beard Coverage"
                    options={["full", "Patchy cheeks", "Weak moustache"]}
                    selected={beardCoverage}
                    onChange={setBeardCoverage}
                />

            </div>
        </div>
    )
}