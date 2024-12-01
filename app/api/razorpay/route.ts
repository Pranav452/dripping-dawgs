import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export async function POST(req: Request) {
  try {
    const { amount } = await req.json()

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    // Convert amount to INR and ensure it's a valid integer in paise
    const amountInINR = amount * 83 // Convert to INR
    const amountInPaise = Math.round(amountInINR * 100) // Convert to paise and round to nearest integer

    // Create order
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      payment_capture: true
    })

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency
    })
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error creating order' },
      { status: 500 }
    )
  }
} 