"use client"

import { useState } from "react"



export default function NewForm() {


    const [gender, setGender] = useState("")
    console.log(gender);



    return (
        <div className='w-full h-full flex flex-col items-center justify-center gap-3'>


            <div className='flex items-center justify-start gap-5 p-2 rounded-lg w-[90%] bg-primaryColor/20'>
                <input type='radio' name='gender' value="Male" id="Male" className="w-4 h-4"
                    onChange={(e) => setGender(e.target.value)}
                />
                <label htmlFor="Male">Male</label>

            </div>

            <div className='flex items-center justify-start gap-5 p-2 rounded-lg w-[90%] bg-primaryColor/20'>
                <input type='radio' name='gender' value="Female" id="Female" className="w-4 h-4"
                    onChange={(e) => setGender(e.target.value)}
                />
                <label htmlFor="Female">Female</label>
            </div>

            <div className='flex items-center justify-start gap-5 p-2 rounded-lg w-[90%] bg-primaryColor/20'>
                <input type='radio' name='gender' value="Other" id="Other" className="w-4 h-4"
                    onChange={(e) => setGender(e.target.value)}
                />
                <label htmlFor="Other">Other</label>
            </div>

        </div>
    )
}