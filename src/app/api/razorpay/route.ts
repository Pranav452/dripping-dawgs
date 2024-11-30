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

    // Create order
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise and ensure it's a whole number
      currency: 'INR',
      payment_capture: true
    })

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency
    })
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error)
    return NextResponse.json(
      { error: error.message || 'Error creating order' },
      { status: 500 }
    )
  }
} 