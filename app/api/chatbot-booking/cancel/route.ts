import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

/**
 * Marks a booking as cancelled — called when a client hits the widget's
 * Cancel button, or chooses "Start Over" on the resume-or-restart prompt
 * after reopening the chat mid-booking.
 *
 * Only ever affects a real DB row when one already exists: submitBooking()
 * (app/api/chatbot-booking/route.ts) only inserts once the client accepts
 * the terms, so a client who cancels earlier in the form has no row to
 * cancel yet — this is a no-op for them, not an error.
 *
 * Uses `status: 'Cancelled'` — one of the four values app/admin/bookings
 * actually recognises for its stat counts and filter tabs (see
 * Issues-Found/Two-Stage Booking Payment.md), same reasoning as the
 * 'Confirmed' status used for a paid booking fee.
 */
export async function POST(req: NextRequest) {
  try {
    const { bookingId } = await req.json();
    if (!bookingId) {
      return NextResponse.json({ success: true, note: 'No booking recorded yet — nothing to cancel.' });
    }

    const { error } = await supabaseAdmin
      .from('bookings')
      .update({ status: 'Cancelled' })
      .eq('id', bookingId);

    if (error) {
      console.error('chatbot-booking/cancel: update failed:', error.message);
      return NextResponse.json({ error: 'Could not cancel booking' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('chatbot-booking/cancel error:', error);
    return NextResponse.json({ error: 'Failed to cancel booking' }, { status: 500 });
  }
}
