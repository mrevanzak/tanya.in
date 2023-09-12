import * as React from 'react';

import UnstyledLink from '@/components/links/UnstyledLink';

export default function Header() {
  return (
    <header className='sticky top-0 z-50 bg-white'>
      <div className='layout flex h-14 items-center justify-between'>
        <UnstyledLink href='/' className='font-bold hover:text-gray-600'>
          Tanya.in
        </UnstyledLink>
        <nav>
          {/* <ul className='flex items-center justify-between space-x-4'> */}
          {/*   <SignedIn> */}
          {/*     <UserButton afterSignOutUrl='/' showName /> */}
          {/*   </SignedIn> */}
          {/*   <SignedOut> */}
          {/*     <UnstyledLink href='/sign-in' className='hover:text-gray-600'> */}
          {/*       Sign in */}
          {/*     </UnstyledLink> */}
          {/*   </SignedOut> */}
          {/* </ul> */}
        </nav>
      </div>
    </header>
  );
}
