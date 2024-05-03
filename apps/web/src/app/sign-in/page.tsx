import Image from "next/image";
import { SigninForm } from "@/components/signin-form";

export default function AuthenticationPage() {
  return (
    <div className="container grid h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 dark:border-r lg:flex">
        <div className="absolute inset-0" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          Tanya.in
        </div>
        <Image
          src="/ITS.png"
          alt="Hero"
          fill
          className="object-cover"
          priority
        />
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
