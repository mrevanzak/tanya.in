import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import * as React from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';

export default function Header() {
  return (
    <header className='sticky top-0 z-50 bg-white'>
      <div className='layout flex h-14 items-center justify-between'>
        <UnstyledLink href='/' className='font-bold hover:text-gray-600'>
          Home
        </UnstyledLink>
        <nav>
          <ul className='flex items-center justify-between space-x-4'>
            <SignedIn>
              {/* Mount the UserButton component */}
              <UserButton afterSignOutUrl='/' showName />
            </SignedIn>
            <SignedOut>
              {/* Signed out users get sign in button */}
              <UnstyledLink href='/sign-in' className='hover:text-gray-600'>
                Sign in
              </UnstyledLink>
            </SignedOut>
          </ul>
        </nav>
      </div>
    </header>
  );
}
