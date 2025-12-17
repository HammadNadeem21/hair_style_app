"use client";

import React, { useState } from 'react'

import { MyButton } from '@/components/Button'
import { InputFields } from '@/components/InputFields'
import Logo from '@/components/Logo'
import { Heading_1 } from '@/components/Text_Style/Heading_1'
import { SmallText } from '@/components/Text_Style/Small_text'
import { FaGoogle } from "react-icons/fa";
import { Heading_2 } from '@/components/Text_Style/Heading_2'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'


const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        // Automatically sign in after registration
        const signInRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (signInRes?.error) {
          setError("Registration successful, but login failed. Please login manually.");
          router.push("/sign_in");
        } else {
          router.push("/");
        }

      } else {
        const data = await res.json();
        setError(data.message || "User registration failed.");
        setLoading(false);
      }
    } catch (error) {
      console.log("Error during registration: ", error);
      setError("An unexpected error occurred.");
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
      <div className="flex flex-col gap-[2px] w-full justify-center items-center">
        <Heading_1 value="Create Account" />
        <Heading_2 value='Join us to get started' textColor='text-grayColor' />
      </div>
      <InputFields fields={[
        { type: 'name', placeholder: 'Name', onChange: (e) => setName(e.target.value) },
        { type: 'email', placeholder: 'Email', onChange: (e) => setEmail(e.target.value) },
        { type: 'password', placeholder: 'Password', onChange: (e) => setPassword(e.target.value) }
      ]} />

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div className='flex items-center justify-start w-full gap-2'>

        <input type="checkbox" className='cursor-pointer' />
        <div className="flex gap-1">
          <SmallText value="I agree to the" textColor='text-grayColor' />
          <SmallText value="Terms of Service" textColor='text-primaryColor' className='cursor-pointer' />
        </div>
      </div>

      <MyButton value='Sign Up' variant='default' className='mt-2' onClick={handleSubmit} loading={loading} />

      <div className="flex items-center w-full gap-2">
        <div className='h-[1px] bg-grayColor flex-1'></div>
        <SmallText value="  Or continue with  " textColor="text-grayColor" />
        <div className='h-[1px] bg-grayColor w-auto flex-1'></div>

      </div>

      <div className='flex flex-col justify-center gap-3 w-full'>

        <MyButton variant="outline" onClick={handleGoogleSignIn} loading={googleLoading}>
          <FaGoogle className="mr-2" /> Sign Up with Google
        </MyButton>

      </div>

      {/* <SmallText value="Continue as Guest" textColor='text-primaryColor' className='cursor-pointer mt-4'/> */}
      <div className="flex items-center justify-center gap-1">
        <SmallText value="Already have an account?" textColor='text-grayColor' />
        <Link href='/sign_in'>
          <SmallText value='Sign In' textColor='text-primaryColor' className='cursor-pointer' />

        </Link>

      </div>

      <SmallText value='Your data is securely processed and not stored after account creation.' textColor='text-grayColor' className='text-xs text-center' />
    </div>
  )
}

export default SignUpPage
