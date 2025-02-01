"use client";

import React from "react";
import Logo from "@/public/Logo.png";
import Icon from "@/public/icon.png";
import Image from "next/image";
import { Container } from "./common/Container";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Hero() {
  const { data: session } = useSession();
  return (
    <Container className='h-screen flex flex-col justify-center items-center'>
      <div>
        <Image
          src={Logo}
          alt='ALGEQUIZTIC-LOGO'
          className='w-72 md:w-96 mx-auto'
        />
      </div>
      <div className='flex justify-center items-center mt-5 sm:mt-10 gap-2'>
        <Image src={Icon} alt='ALGEQUIZTIC-ICON' className='w-12 md:w-14' />
        <Link
          href={session ? "/quiz" : "/login"}
          className='bg-primary text-black px-4 py-2 rounded-xl md:text-xl w-32 text-center'
        >
          START
        </Link>
      </div>
    </Container>
  );
}
