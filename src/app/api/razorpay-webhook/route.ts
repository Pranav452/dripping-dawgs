import { NextResponse } from 'next/server'
import crypto from 'crypto'
import { supabase } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = req.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      )
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
      .update(body)
      .digest('hex')

    if (signature !== expectedSignature) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    const event = JSON.parse(body)
    console.log('Received webhook event:', event.event)

    // Handle different webhook events
    switch (event.event) {
      case 'payment.captured':
        const { data, error } = await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            status: 'confirmed'
          })
          .eq('razorpay_order_id', event.payload.order.entity.id)
          .select()

        if (error) {
          console.error('Error updating order:', error)
          throw error
        }
        console.log('Order updated successfully:', data)
        break

      case 'payment.failed':
        await supabase
          .from('orders')
          .update({
            payment_status: 'failed',
            status: 'cancelled'
          })
          .eq('razorpay_order_id', event.payload.order.entity.id)
        break
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
} 