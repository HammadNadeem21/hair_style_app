import React from 'react'

import { MyButton } from '@/components/Button'
import { InputFields } from '@/components/InputFields'
import Logo from '@/components/Logo'
import { Heading_1 } from '@/components/Text_Style/Heading_1'
import { SmallText } from '@/components/Text_Style/Small_text'
import { FaGoogle } from "react-icons/fa";
import Link from 'next/link'


const SignInPage = () => {
  return (
    <div className='max-w-[440px] max-h-[880px] bg-white flex flex-col gap-4 items-center py-8 mt-10 px-5'>
      <Logo />
      <Heading_1 value="Welcome Back" />
      <InputFields fields={[
        { type: 'email', placeholder: 'Email Address' },
        { type: 'password', placeholder: 'Password' }
      ]} />
      <div className='flex items-center justify-end w-full'>
        <SmallText value="Forgot Password?" textColor='text-primaryColor' />
      </div>

      <MyButton value='Sign In' variant='default' className='mt-2' />

      <div className="flex items-center w-full gap-2">
        <div className='h-[1px] bg-grayColor flex-1'></div>
        <SmallText value="  Or continue with  " textColor="text-grayColor" />
        <div className='h-[1px] bg-grayColor w-auto flex-1'></div>

      </div>

      <div className='flex flex-col justify-center gap-3 w-full'>

        <MyButton variant="outline">
          <FaGoogle className="mr-2" /> Sign In with Google
        </MyButton>

      </div>

      {/* <SmallText value="Continue as Guest" textColor='text-primaryColor' className='cursor-pointer mt-4'/> */}
      <div className="flex items-center justify-center gap-1 mt-6">
        <SmallText value="Don't have an account" textColor='text-grayColor' />
        <Link href='/sign_up'>
          <SmallText value='Sign Up' textColor='text-primaryColor' className='cursor-pointer' />

        </Link>

      </div>

      <SmallText value='Your photos are securely processed and not stored after style generation.' textColor='text-grayColor' className='text-xs text-center mt-8' />
    </div>
  )
}

export default SignInPage
