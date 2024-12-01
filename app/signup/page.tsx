'use client'
import { useState } from 'react'
import { useAuth } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await signUp(email, password)
      router.push('/login?message=Please check your email to verify your account')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating account')
    }
  }

  return (
    <div className="container relative h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-black">
          <Image
            src="/LOGO.png"
            alt="DrippingDog  Background"
            fill
            className="object-contain opacity-20"
            priority
          />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Image 
            src="/LOGO.png" 
            alt="DrippingDog Logo" 
            width={50} 
            height={50} 
            className="mr-2"  
          />
          DrippingDog
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Join our community of fashion enthusiasts and discover unique designs that define your style.&rdquo;
            </p>
            <footer className="text-sm">DrippingDog Team</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                required
                className="mt-1 w-full rounded-md border p-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                required
                className="mt-1 w-full rounded-md border p-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full rounded bg-black px-4 py-2 text-white hover:bg-gray-800"
            >
              Sign Up
            </button>
          </form>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
          </p>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
