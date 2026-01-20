import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
});

export async function sendGiftVoucherEmail(opts: {
  to: string;
  recipientName: string;
  buyerName: string;
  amount: number;
  code: string;
  message?: string;
}) {
  const subject = "You received a Gift Voucher 🎁";

  const text = `
Hi ${opts.recipientName || "there"},

You received a gift voucher from ${opts.buyerName || "someone"}.

Amount: €${opts.amount}
Redeem Code: ${opts.code}

Message:
${opts.message || "-"}

Use this code once at checkout.

Thanks,
Restaurant Team
`;

  await mailer.sendMail({
    from: process.env.MAIL_FROM || "no-reply@restaurant.com",
    to: opts.to,
    subject,
    text,
  });
}
