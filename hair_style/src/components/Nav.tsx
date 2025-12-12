"use client";

import React from 'react'
import Logo from './Logo'
import { Avatar } from './Avatar'
import { useSession, signOut } from 'next-auth/react'
import { MyButton } from './Button'
import Link from 'next/link'

const Nav = () => {
  const { data: session } = useSession();

  return (
    <div className='bg-white shadow-xl py-2 px-3 fixed w-full top-0 flex items-center justify-between z-50'>
      <Logo height='h-[30px]' width='w-[30px]' size={20} radius='rounded-lg' />

      {session ? (
        <Avatar
          image={session.user?.image || undefined}
          name={session.user?.name || "User"}
          onLogout={() => signOut({ callbackUrl: "/sign_in" })}
        />
      ) : (
        <div className="flex gap-2">
          <Link href="/sign_in">
            <MyButton value="Sign In" variant="ghost" className="h-8 px-3 text-sm text-primaryColor" />
          </Link>
          <Link href="/sign_up">
            <MyButton value="Sign Up" className="h-8 px-3 text-sm" variant={"default"} />
          </Link>
        </div>
      )}
    </div>
  )
}

export default Nav
