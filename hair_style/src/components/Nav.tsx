"use client";

import React from 'react'
import Logo from './Logo'
import { Avatar } from './Avatar'
import { useSession, signOut } from 'next-auth/react'
import { MyButton } from './Button'
import Link from 'next/link'
import { useCreditContext } from '@/context/CreditContext'

const Nav = () => {
  const { data: session } = useSession();
  const { credits } = useCreditContext();

  return (
    <nav className='fixed w-full top-0 z-50 transition-all duration-300 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm supports-[backdrop-filter]:bg-white/60'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo Section */}
          <div className="flex-shrink-0 hover:opacity-80 transition-opacity">
            <Logo height='h-[35px]' width='w-[35px]' size={24} radius='rounded-xl' />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {session ? (
              <Avatar
                image={session.user?.image || undefined}
                name={session.user?.name || "User"}
                email={session.user?.email || ""}
                credits={credits}
                onLogout={() => signOut({ callbackUrl: "/sign_in" })}
              />
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/sign_in">
                  <MyButton
                    value="Sign In"
                    variant="ghost"
                    className="h-9 px-4 text-sm font-medium text-gray-600 hover:text-primaryColor hover:bg-primaryColor/5 rounded-full transition-all"
                  />
                </Link>
                <Link href="/sign_up">
                  <MyButton
                    value="Sign Up"
                    className="h-9 px-5 text-sm font-medium bg-primaryColor hover:bg-primaryColor/90 text-white shadow-lg hover:shadow-primaryColor/25 rounded-full transition-all transform hover:-translate-y-0.5"
                    variant={"default"}
                  />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Nav
