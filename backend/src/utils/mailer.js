const nodemailer = require('nodemailer');

const sendResetPasswordEmail = async (email, name, token) => {
  const smtpHost = process.env.SMTP_HOST || 'smtp.ethereal.email';
  const smtpPort = process.env.SMTP_PORT || 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || '"WILDAN CASN" <noreply@wildan-casn.com>';

  let transporter;
  if (smtpUser && smtpPass) {
    transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: smtpPort == 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });
  } else {
    // Fallback: Create a test account on ethereal.email
    console.log('SMTP credentials not configured in .env. Creating temporary Ethereal SMTP transporter...');
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch (e) {
      console.error('Failed to create Ethereal SMTP transporter:', e);
      throw new Error('Gagal menginisialisasi sistem pengiriman email.');
    }
  }

  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

  const mailOptions = {
    from: smtpFrom,
    to: email,
    subject: 'Atur Ulang Kata Sandi - WILDAN CASN',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <h2 style="color: #0B1C30; text-align: center; margin-bottom: 20px;">Atur Ulang Kata Sandi</h2>
        <p>Halo, <strong>${name}</strong>,</p>
        <p>Kami menerima permintaan untuk mengatur ulang kata sandi akun Anda di WILDAN CASN. Klik tombol di bawah ini untuk mengatur ulang kata sandi Anda:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Atur Ulang Kata Sandi</a>
        </div>
        <p>Tautan ini hanya berlaku selama <strong>15 menit</strong>. Jika Anda tidak melakukan permintaan ini, silakan abaikan email ini.</p>
        <p style="margin-top: 25px; font-size: 13px; color: #64748b;">
          Jika tombol di atas tidak berfungsi, Anda juga dapat menyalin tautan berikut ke browser Anda:<br/>
          <a href="${resetUrl}" style="color: #2563eb; word-break: break-all;">${resetUrl}</a>
        </p>
        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 25px 0;" />
        <p style="font-size: 11px; color: #94a3b8; text-align: center; margin: 0;">WILDAN CASN &copy; 2026. All rights reserved.</p>
      </div>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  console.log('Password reset email sent successfully. MessageID: %s', info.messageId);
  if (!smtpUser) {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log('========================================================');
    console.log('EMAIL SENT TO ETHEREAL (TEST INBOX)');
    console.log(`To: ${email}`);
    console.log(`Reset Token: ${token}`);
    console.log(`Preview Email here: ${previewUrl}`);
    console.log('========================================================');
    return { ...info, previewUrl };
  }
  return info;
};

module.exports = {
  sendResetPasswordEmail
};
