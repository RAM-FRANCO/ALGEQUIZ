/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo-1.png";
import { Container } from "@/app/components/common/Container";
import { useRouter } from "next/navigation";
import backArowIcon from "@/public/arrow-icon.png";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      studentNumber: formData.get("studentNumber"),
      password: formData.get("password"),
    };

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      router.push("/login?success=Account created successfully");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className='h-screen flex justify-center items-center'>
      <div>
        <Link href='/'>
          <Image
            src={backArowIcon}
            alt='back arrow'
            className='w-10 sm:w-16 '
          />
        </Link>
        <div className='grid lg:grid-cols-2 xl:w-4/6 mx-auto items-center'>
          <div>
            <Image
              src={Logo}
              alt='Algequiztic-Logo'
              className='w-72 md:w-96 mx-auto'
            />
          </div>

          <div className='w-full max-w-md mx-auto px-5 sm:p-8'>
            <h2 className='text-2xl font-semibold text-center mb-6 text-white'>
              Sign up
            </h2>

            {error && (
              <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4'>
                {error}
              </div>
            )}

            <form className='space-y-4' onSubmit={handleSubmit}>
              <div>
                <input
                  name='name'
                  type='text'
                  placeholder='Name'
                  required
                  className='w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400'
                />
              </div>

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
                  name='studentNumber'
                  type='text'
                  placeholder='Student No.'
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
                {loading ? "SIGNING UP..." : "SIGN UP"}
              </button>
            </form>

            <p className='text-center mt-4 text-sm text-gray-600'>
              Already have an account?{" "}
              <Link href='/login' className='text-blue-500 hover:underline'>
                Login.
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
