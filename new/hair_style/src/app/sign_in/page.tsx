"use client";

import React, { useState } from 'react'

import { MyButton } from '@/components/Button'
import { InputFields } from '@/components/InputFields'
import Logo from '@/components/Logo'
import { Heading_1 } from '@/components/Text_Style/Heading_1'
import { SmallText } from '@/components/Text_Style/Small_text'
import { FaGoogle } from "react-icons/fa";
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'


const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  React.useEffect(() => {
    console.log("Client Session Status:", status, "Session Data:", session);
  }, [status, session]);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        toast.error("Invalid email or password");
        setError("Invalid email or password");
        setLoading(false);
      } else {
        toast.success("Signed in successfully!");
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
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primaryColor/10 via-white to-blue-50 relative overflow-hidden py-10">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primaryColor/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px]" />

      <div className='z-10 max-w-[440px] w-full bg-white/60 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl flex flex-col gap-4 items-center py-8 px-8 mx-4'>
        <Logo />
        <Heading_1 value="Welcome Back" />
        <InputFields fields={[
          { type: 'email', placeholder: 'Email Address', value: email, onChange: (e) => setEmail(e.target.value) },
          { type: 'password', placeholder: 'Password', value: password, onChange: (e) => setPassword(e.target.value) }
        ]} />

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className='flex items-center justify-end w-full'>
          <SmallText value="Forgot Password?" textColor='text-primaryColor' />
        </div>

        <MyButton value='Sign In' variant='default' className='mt-2' onClick={handleSubmit} loading={loading} />

        <div className="flex items-center w-full gap-2">
          <div className='h-[1px] bg-gray-200 flex-1'></div>
          <SmallText value="  Or continue with  " textColor="text-gray-400" />
          <div className='h-[1px] bg-gray-200 w-auto flex-1'></div>
        </div>

        <div className='flex flex-col justify-center gap-3 w-full'>
          <MyButton variant="outline" onClick={handleGoogleSignIn} loading={googleLoading}>
            <FaGoogle className="mr-2" /> Sign In with Google
          </MyButton>
        </div>

        <div className="flex items-center justify-center gap-1 mt-6">
          <SmallText value="Don't have an account" textColor='text-gray-500' />
          <Link href='/sign_up'>
            <SmallText value='Sign Up' textColor='text-primaryColor' className='cursor-pointer font-bold' />
          </Link>
        </div>

        <SmallText value='Your photos are securely processed and not stored after style generation.' textColor='text-gray-400' className='text-xs text-center mt-8' />
      </div>
    </div>
  )
}


export default SignInPage
