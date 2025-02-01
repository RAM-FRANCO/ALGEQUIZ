/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Logo from "@/public/logo-1.png";
import Image from "next/image";
import backArowIcon from "@/public/arrow-icon.png";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const successMessage = searchParams.get("success");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        return;
      }

      router.push("/quiz");
      router.refresh();
    } catch (error) {
      setError("An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full max-w-md mx-auto px-5 sm:p-8'>
      <Link href='/'>
        <Image src={backArowIcon} alt='back arrow' className='w-10 sm:w-16 ' />
      </Link>
      <Image
        src={Logo}
        alt='ALGEQUIZTIC-LOGO'
        className='w-72 md:w-96 mx-auto'
      />
      <h2 className='text-2xl font-semibold text-center mb-6 text-white'>
        Login
      </h2>

      {successMessage && (
        <div className='bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4'>
          {successMessage}
        </div>
      )}

      {error && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4'>
          {error}
        </div>
      )}

      <form className='space-y-4' onSubmit={handleSubmit}>
        <div>
          <input
            name='email'
            type='email'
            placeholder='Email'
            required
            className='w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400'
          />
        </div>

        <div>
          <input
            name='password'
            type='password'
            placeholder='Password'
            required
            className='w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400'
          />
        </div>

        <button
          type='submit'
          disabled={loading}
          className='w-full py-3 bg-emerald-400 text-white rounded-md hover:bg-emerald-500 transition-colors disabled:bg-emerald-300'
        >
          {loading ? "LOGGING IN..." : "LOGIN"}
        </button>
      </form>

      <p className='text-center mt-4 text-sm text-gray-600'>
        Don&apos;t have an account?{" "}
        <Link href='/signup' className='text-blue-500 hover:underline'>
          Sign up.
        </Link>
      </p>
    </div>
  );
}
