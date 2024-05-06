import type { Metadata } from "next";
import { SigninForm } from "@/components/signin-form";

import ITS from "~/ITS.svg";
import Logo from "~/logo.svg";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Sign in for your account",
};

export default function AuthenticationPage() {
  return (
    <div className="container grid h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-secondary-its p-10 dark:border-r dark:bg-primary-its lg:flex">
        <div className="absolute inset-0" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Logo className="h-9 text-white" />
        </div>
        <ITS className="m-auto size-96 text-white" />
        {/* <div className='relative z-20 mt-auto'>
            <blockquote className='space-y-2'>
              <p className='text-lg'>
                &ldquo;This library has saved me countless hours of work and
                helped me deliver stunning designs to my clients faster than
                ever before.&rdquo;
              </p>
              <footer className='text-sm'>Sofia Davis</footer>
            </blockquote>
          </div> */}
      </div>
      <div className="lg:p-8">
        <SigninForm />
      </div>
    </div>
  );
}
