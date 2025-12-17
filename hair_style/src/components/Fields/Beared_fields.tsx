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
        <div className="">
            <SmallText value='Beard Fields' textColor='text-primaryColor' className='text-left text-sm font-bold' />
            <div className="flex flex-col items-center gap-4 w-full">

                <div className='flex flex-col items-center gap-2 w-full mt-5'>

                    <label className='text-sm font-medium text-primaryColor uppercase tracking-wider shadow-xl py-2 px-4 border border-primaryColor rounded-xl'>Moustache Preference</label>
                    <div className='flex items-center justify-center flex-wrap gap-2 bg-gray-100/50 p-1.5 rounded-xl w-full max-w-[280px]'>
                        <button
                            className={`py-2 px-6 rounded-lg text-sm font-medium transition-all duration-300 ${beardLength === "no moustache" ? 'bg-primaryColor text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setBeardLength("no moustache")}
                        >
                            No moustache
                        </button>

                        <button
                            className={`py-2 px-6 rounded-lg text-sm font-medium transition-all duration-300 ${beardLength === "light moustache" ? 'bg-primaryColor text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setBeardLength("light moustache")}
                        >
                            Light moustache
                        </button>

                        <button
                            className={`py-2 px-6 rounded-lg text-sm font-medium transition-all duration-300 ${beardLength === "thick & dominant" ? 'bg-primaryColor text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                                }`}
                            onClick={() => setBeardLength("thick & dominant")}
                        >
                            Thick & dominant
                        </button>


                    </div>
                </div>

                <MultiSelect
                    label="Beard Coverage"
                    options={["full", "Patchy cheeks", "Weak moustache"]}
                    selected={beardCoverage}
                    onChange={setBeardCoverage}
                    display="flex-col"
                />

            </div>
        </div>
    )
}