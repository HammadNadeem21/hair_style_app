"use client";

import React, { useState } from 'react'

import { MyButton } from '@/components/Button'
import { InputFields } from '@/components/InputFields'
import Logo from '@/components/Logo'
import { Heading_1 } from '@/components/Text_Style/Heading_1'
import { SmallText } from '@/components/Text_Style/Small_text'
import { FaGoogle } from "react-icons/fa";
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'


const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong");
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className='max-w-[440px] max-h-[880px] bg-white flex flex-col gap-4 items-center py-8 mt-10 px-5'>
      <Logo />
      <Heading_1 value="Welcome Back" />
      <InputFields fields={[
        { type: 'email', placeholder: 'Email Address', onChange: (e) => setEmail(e.target.value) },
        { type: 'password', placeholder: 'Password', onChange: (e) => setPassword(e.target.value) }
      ]} />

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className='flex items-center justify-end w-full'>
        <SmallText value="Forgot Password?" textColor='text-primaryColor' />
      </div>

      <MyButton value='Sign In' variant='default' className='mt-2' onClick={handleSubmit} loading={loading} />

      <div className="flex items-center w-full gap-2">
        <div className='h-[1px] bg-grayColor flex-1'></div>
        <SmallText value="  Or continue with  " textColor="text-grayColor" />
        <div className='h-[1px] bg-grayColor w-auto flex-1'></div>

      </div>

      <div className='flex flex-col justify-center gap-3 w-full'>

        <MyButton variant="outline" onClick={handleGoogleSignIn} loading={googleLoading}>
          <FaGoogle className="mr-2" /> Sign In with Google
        </MyButton>

      </div>


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
