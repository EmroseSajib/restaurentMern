import nodemailer from "nodemailer";

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error("SMTP_USER/SMTP_PASS missing in .env");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass }, // Gmail App Password
  });
}

export const ReservationsService = {
  async sendReservationEmail(payload: any) {
    console.log("Reservation request payload:", payload);
    const name = String(payload?.name || "").trim();
    const email = String(payload?.email || "").trim();
    const phone = String(payload?.phone || "").trim();
    const date = String(payload?.date || "").trim();
    const time = String(payload?.time || "").trim();
    const guests = String(payload?.guests || "").trim();
    const tablePreference = String(payload?.tablePreference || "any").trim();
    const notes = String(payload?.notes || "").trim();

    if (!name) throw new Error("Name required");
    if (!phone) throw new Error("Phone required");
    if (!email || !isEmail(email)) throw new Error("Valid email required");
    if (!date) throw new Error("Date required");
    if (!time) throw new Error("Time required");
    if (!guests) throw new Error("Guests required");

    const to = process.env.MAIL_TO;
    if (!to) throw new Error("MAIL_TO missing in .env");

    const from = process.env.MAIL_FROM || process.env.SMTP_USER;

    const transporter = getTransporter();

    const subject = `New Reservation Request — ${name} (${guests} guests)`;

    const text = `
New reservation request:

Name: ${name}
Email: ${email}
Phone: ${phone}

Date: ${date}
Time: ${time}
Guests: ${guests}
Table: ${tablePreference}

Notes:
${notes || "-"}
`.trim();

    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      replyTo: email, // ✅ so you can reply directly to customer
    });

    return { ok: true };
  },
};
