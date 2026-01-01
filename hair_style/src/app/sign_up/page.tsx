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
import { toast } from 'sonner'


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
        toast.success("Account created successfully!");
        // Automatically sign in after registration
        const signInRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (signInRes?.error) {
          toast.warning("Account created, but automatic sign-in failed. Please sign in manually.");
          setError("Registration successful, but login failed. Please login manually.");
          router.push("/sign_in");
        } else {
          router.push("/");
        }

      } else {
        const data = await res.json();
        toast.error(data.message || "User registration failed.");
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
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primaryColor/10 via-white to-blue-50 relative overflow-hidden py-10">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primaryColor/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px]" />

      <div className='z-10 max-w-[440px] w-full bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl flex flex-col gap-4 items-center py-8 px-8 mx-4'>
        <Logo />
        <div className="flex flex-col gap-[2px] w-full justify-center items-center">
          <Heading_1 value="Create Account" />
          <Heading_2 value='Join us to get started' textColor='text-gray-500' />
        </div>
        <InputFields fields={[
          { type: 'text', placeholder: 'Name', value: name, onChange: (e) => setName(e.target.value) },
          { type: 'email', placeholder: 'Email', value: email, onChange: (e) => setEmail(e.target.value) },
          { type: 'password', placeholder: 'Password', value: password, onChange: (e) => setPassword(e.target.value) }
        ]} />

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className='flex items-center justify-start w-full gap-2'>
          <input type="checkbox" className='cursor-pointer' />
          <div className="flex gap-1">
            <SmallText value="I agree to the" textColor='text-gray-500' />
            <SmallText value="Terms of Service" textColor='text-primaryColor' className='cursor-pointer font-bold' />
          </div>
        </div>

        <MyButton value='Sign Up' variant='default' className='mt-2' onClick={handleSubmit} loading={loading} />

        <div className="flex items-center w-full gap-2">
          <div className='h-[1px] bg-gray-200 flex-1'></div>
          <SmallText value="  Or continue with  " textColor="text-gray-400" />
          <div className='h-[1px] bg-gray-200 w-auto flex-1'></div>
        </div>

        <div className='flex flex-col justify-center gap-3 w-full'>
          <MyButton variant="outline" onClick={handleGoogleSignIn} loading={googleLoading}>
            <FaGoogle className="mr-2" /> Sign Up with Google
          </MyButton>
        </div>

        <div className="flex items-center justify-center gap-1">
          <SmallText value="Already have an account?" textColor='text-gray-500' />
          <Link href='/sign_in'>
            <SmallText value='Sign In' textColor='text-primaryColor' className='cursor-pointer font-bold' />
          </Link>
        </div>

        <SmallText value='Your data is securely processed and not stored after account creation.' textColor='text-gray-400' className='text-xs text-center' />
      </div>
    </div>
  )
}

export default SignUpPage
