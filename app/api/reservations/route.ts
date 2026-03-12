import { type NextRequest, NextResponse } from "next/server"

// ===========================================
// RESERVATION API ROUTE
// Handles table reservations and email notifications
// ===========================================

interface ReservationData {
  name: string
  email: string
  phone: string
  date: string
  time: string
  guests: string
  tablePreference: string
  notes: string
}

export async function POST(request: NextRequest) {
  try {
    const data: ReservationData = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.date || !data.time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // ===========================================
    // TODO: EMAIL NOTIFICATION
    // ===========================================
    // Send email to restaurant and customer:
    //
    // SENDGRID EXAMPLE:
    // import sgMail from '@sendgrid/mail'
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY!)
    //
    // // Email to restaurant
    // await sgMail.send({
    //   to: 'reservations@dekleineman.nl',
    //   from: 'noreply@dekleineman.nl',
    //   subject: `New Reservation - ${data.name} - ${data.date} ${data.time}`,
    //   html: `
    //     <h2>New Reservation</h2>
    //     <p><strong>Name:</strong> ${data.name}</p>
    //     <p><strong>Email:</strong> ${data.email}</p>
    //     <p><strong>Phone:</strong> ${data.phone}</p>
    //     <p><strong>Date:</strong> ${data.date}</p>
    //     <p><strong>Time:</strong> ${data.time}</p>
    //     <p><strong>Guests:</strong> ${data.guests}</p>
    //     <p><strong>Table Preference:</strong> ${data.tablePreference}</p>
    //     <p><strong>Notes:</strong> ${data.notes || 'None'}</p>
    //   `,
    // })
    //
    // // Confirmation email to customer
    // await sgMail.send({
    //   to: data.email,
    //   from: 'reservations@dekleineman.nl',
    //   subject: 'Reservation Confirmed - dekleineman',
    //   html: generateConfirmationEmail(data),
    // })
    //
    // NODEMAILER EXAMPLE (with SMTP):
    // import nodemailer from 'nodemailer'
    // const transporter = nodemailer.createTransport({
    //   host: process.env.SMTP_HOST,
    //   port: Number(process.env.SMTP_PORT),
    //   auth: {
    //     user: process.env.SMTP_USER,
    //     pass: process.env.SMTP_PASSWORD,
    //   },
    // })
    // await transporter.sendMail({
    //   from: '"dekleineman" <reservations@dekleineman.nl>',
    //   to: data.email,
    //   subject: 'Reservation Confirmed',
    //   html: generateConfirmationEmail(data),
    // })

    // ===========================================
    // TODO: DATABASE STORAGE
    // ===========================================
    // Store reservation in database:
    //
    // PRISMA EXAMPLE:
    // await prisma.reservation.create({
    //   data: {
    //     name: data.name,
    //     email: data.email,
    //     phone: data.phone,
    //     date: new Date(data.date),
    //     time: data.time,
    //     guests: parseInt(data.guests),
    //     tablePreference: data.tablePreference,
    //     notes: data.notes,
    //     status: 'pending',
    //   },
    // })

    // Log the reservation
    console.log("New reservation:", {
      name: data.name,
      date: data.date,
      time: data.time,
      guests: data.guests,
    })

    return NextResponse.json({
      success: true,
      message: "Reservation submitted successfully",
    })
  } catch (error) {
    console.error("Reservation error:", error)
    return NextResponse.json({ error: "Failed to submit reservation" }, { status: 500 })
  }
}
