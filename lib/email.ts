import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

interface BookingEmailData {
  customerName: string;
  customerEmail?: string;
  serviceName: string;
  date: string;
  startTime: string;
  venue?: string;
  bookingId: string;
}

export async function sendBookingConfirmationToCustomer(
  data: BookingEmailData
) {
  if (!data.customerEmail) return;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: Georgia, serif; background: #FAF7F2; margin: 0; padding: 0; }
          .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(107,39,55,0.12); }
          .header { background: linear-gradient(135deg, #6B2737 0%, #a02440 100%); padding: 40px 32px; text-align: center; }
          .header h1 { color: #C9A84C; font-size: 26px; margin: 0 0 8px; }
          .header p { color: #fbe8eb; margin: 0; font-size: 14px; }
          .body { padding: 32px; }
          .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f5ede0; }
          .detail-label { color: #6B2737; font-weight: bold; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
          .detail-value { color: #333; font-size: 15px; }
          .status-badge { display: inline-block; background: #fbe8eb; color: #6B2737; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: bold; margin: 16px 0; }
          .footer { background: #FAF7F2; padding: 24px 32px; text-align: center; color: #888; font-size: 12px; }
          .whatsapp-btn { display: inline-block; background: #25D366; color: #fff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 16px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌿 Taslima Mehendi Artist</h1>
            <p>Booking Confirmation</p>
          </div>
          <div class="body">
            <p>Dear <strong>${data.customerName}</strong>,</p>
            <p>Thank you for booking with Taslima Mehendi Artist! Your booking has been received and is <strong>pending confirmation</strong>. We'll reach out shortly to confirm your appointment.</p>
            
            <div class="detail-row">
              <span class="detail-label">Booking ID</span>
              <span class="detail-value">#${data.bookingId.slice(-8).toUpperCase()}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Service</span>
              <span class="detail-value">${data.serviceName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date</span>
              <span class="detail-value">${data.date}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time</span>
              <span class="detail-value">${data.startTime}</span>
            </div>
            ${data.venue ? `<div class="detail-row"><span class="detail-label">Venue</span><span class="detail-value">${data.venue}</span></div>` : ""}
            
            <div style="text-align: center; margin-top: 24px;">
              <span class="status-badge">⏳ Pending Confirmation</span>
            </div>
            
            <p style="text-align: center; color: #888; font-size: 13px;">Questions? WhatsApp us directly:</p>
            <div style="text-align: center;">
              <a href="https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}" class="whatsapp-btn">💬 WhatsApp Us</a>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Taslima Mehendi Artist. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: data.customerEmail,
    subject: `Booking Received — ${data.serviceName} on ${data.date}`,
    html,
  });
}

export async function sendNewBookingAlertToAdmin(data: BookingEmailData) {
  const html = `
    <h2>📅 New Booking Received</h2>
    <p><strong>Customer:</strong> ${data.customerName}</p>
    <p><strong>Service:</strong> ${data.serviceName}</p>
    <p><strong>Date:</strong> ${data.date} at ${data.startTime}</p>
    ${data.venue ? `<p><strong>Venue:</strong> ${data.venue}</p>` : ""}
    <p><strong>Booking ID:</strong> ${data.bookingId}</p>
    <p><a href="${process.env.NEXTAUTH_URL}/admin/bookings">View in Admin Panel →</a></p>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: process.env.ADMIN_EMAIL,
    subject: `New Booking: ${data.serviceName} — ${data.date}`,
    html,
  });
}

export async function sendBookingStatusUpdate(
  customerEmail: string,
  customerName: string,
  status: string,
  serviceName: string,
  date: string
) {
  if (!customerEmail) return;

  const statusMessages: Record<string, { emoji: string; message: string }> = {
    confirmed: {
      emoji: "✅",
      message:
        "Your booking has been <strong>confirmed</strong>! We look forward to seeing you.",
    },
    cancelled: {
      emoji: "❌",
      message:
        "Unfortunately your booking has been <strong>cancelled</strong>. Please contact us to reschedule.",
    },
    completed: {
      emoji: "🌿",
      message:
        "Thank you for visiting! We hope you loved your mehndi. Please leave us a review!",
    },
  };

  const { emoji, message } = statusMessages[status] || {
    emoji: "ℹ️",
    message: "Your booking status has been updated.",
  };

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: customerEmail,
    subject: `Booking Update — ${serviceName} on ${date}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 500px; margin: 0 auto; background: #FAF7F2; padding: 32px; border-radius: 16px;">
        <h1 style="color: #6B2737; text-align: center;">${emoji} Booking Update</h1>
        <p>Dear <strong>${customerName}</strong>,</p>
        <p>${message}</p>
        <p>Service: <strong>${serviceName}</strong> on <strong>${date}</strong></p>
        <p style="color: #888; font-size: 12px;">— Taslima Mehendi Artist</p>
      </div>
    `,
  });
}
