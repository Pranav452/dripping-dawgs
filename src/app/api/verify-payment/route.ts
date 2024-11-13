import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json()

    // Verify the payment signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex')

    const isValid = generated_signature === razorpay_signature
    console.log('Signature verification:', {
      generated: generated_signature,
      received: razorpay_signature,
      isValid
    })

    if (isValid) {
      return NextResponse.json({ valid: true })
    } else {
      console.error('Signature mismatch:', {
        generated: generated_signature,
        received: razorpay_signature
      })
      return NextResponse.json(
        { valid: false, error: 'Invalid payment signature' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { valid: false, error: 'Payment verification failed' },
      { status: 500 }
    )
  }
} 