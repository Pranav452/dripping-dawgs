import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = await req.json()

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(sign)
      .digest('hex')

    if (razorpay_signature === expectedSign) {
      return NextResponse.json({ verified: true })
    } else {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error validating payment:', error)
    return NextResponse.json(
      { error: 'Error validating payment' },
      { status: 500 }
    )
  }
} 