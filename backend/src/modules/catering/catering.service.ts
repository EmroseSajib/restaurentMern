import nodemailer from "nodemailer";

function isEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const CateringService = {
  async sendEmailToAdmin(payload: any) {
    console.log("Catering request payload:", payload);
    const name = String(payload?.name || "").trim();
    const email = String(payload?.email || "").trim();
    const phone = String(payload?.phone || "").trim();
    const date = String(payload?.date || "").trim();
    const time = String(payload?.time || "").trim();
    const guests = Number(payload?.guests || 0);
    const location = String(payload?.location || "").trim();
    const message = String(payload?.message || "").trim();

    if (!name) throw new Error("Name required");
    if (!phone) throw new Error("Phone required");
    if (!email || !isEmail(email)) throw new Error("Valid email required");
    if (!date) throw new Error("Date required");
    if (!time) throw new Error("Time required");
    if (!Number.isFinite(guests) || guests <= 0)
      throw new Error("Guests required");

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
      },
    });

    const to = process.env.MAIL_TO!;
    if (!to) throw new Error("MAIL_TO missing in .env");

    const subject = `New Catering Booking: ${name} (${guests} guests)`;

    const text = `
New catering request received:

Name: ${name}
Email: ${email}
Phone: ${phone}

Date: ${date}
Time: ${time}
Guests: ${guests}
Location: ${location || "-"}

Message:
${message || "-"}
    `.trim();

    await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER!,
      to,
      subject,
      text,
      replyTo: email, // ✅ so you can reply directly to the customer
    });
  },
};
