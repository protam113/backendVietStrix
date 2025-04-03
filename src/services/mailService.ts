import * as dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const mail = process.env.NEXT_PRIVATE_EMAIL_USER || 'vietstrix@gmail.com';
console.log('mai', mail);
const pass = process.env.NEXT_PRIVATE_EMAIL_PASS || 'qplg rowm fpun jfxo';

// Định nghĩa kiểu dữ liệu cho hàm gửi email
interface EmailOptions {
  recipientEmail: string;
  name?: string;
}

// Hàm tạo transporter với debugging
const createTransporter = () => {
  // Log environment variables for debugging
  console.log('Debug - EMAIL_USER:', mail);
  console.log('Debug - EMAIL_PASS provided:', !!pass);

  // Kiểm tra thông tin đăng nhập
  if (!mail || !pass) {
    throw new Error('Email credentials are missing');
  }

  return nodemailer.createTransport({
    service: 'gmail', // Use service instead of manual SMTP config
    auth: {
      user: mail,
      pass: pass,
    },
    // Bỏ qua xác thực SSL (chỉ dùng trong môi trường phát triển)
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Hàm gửi email cảm ơn
 * @param {EmailOptions} options - Email người nhận và tên (tùy chọn)
 * @returns {Promise<void>}
 */
const sendThankYouEmail = async ({
  recipientEmail,
  name = 'bạn',
}: EmailOptions): Promise<void> => {
  try {
    // Tạo transporter
    const transporter = createTransporter();

    // Cấu hình email
    const mailOptions = {
      from: `"VietStrix Team" <vietstrix@gmail.com>`,
      to: recipientEmail,
      subject: 'Thanks for contacting us !',
      html: `
         <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; background: #f4f4f4; padding: 20px; border-radius: 10px;">
  <div style="background: #013162; padding: 20px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px;">
    <h2 style="color: white; margin: 0;">VietStrix </h2>
  </div>

  <div style="background: white; padding: 20px; border-radius: 0 0 10px 10px;">
    <p>Dear <span style="color: #013162; font-weight: bold;">${name}</span>,</p>

    <p>Thank you for contacting us! We have received your inquiry and will get back to you as soon as possible.</p>

    <p>If you have any additional questions in the meantime, feel free to reach out.</p>

    <p>Best regards,</p>

    <p><span style="color: #013162; font-weight: bold;">VietStrix Team</span></p>

    <p>We appreciate your business and look forward to serving you in the future.</p>

    <p>Best regards,</p>
    
    <table style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; background: #013162; color: white; padding: 15px; border-radius: 5px;">
  <tr>
    <td style="padding: 15px; text-align: left; vertical-align: middle;">
      <img src="https://lh3.googleusercontent.com/a-/ALV-UjWHPYbMFT4opU9pYn0ItPXhgruFrO7OB2MgNkhOs0lGBf48Zg0=s80-p-k-rw-no" alt="VietStrix Logo" style="height: 60px; border-radius: 5px;">
    </td>
    <td style="padding: 15px; text-align: right; vertical-align: middle;">
      <strong style="font-size: 18px;">VietStrix</strong><br/>
      <span style="font-size: 14px;">Web Developer | DevOps Engineer</span><br/>
      📧 <a href="mailto:vietstrix@gmail.com" style="color: #4da6ff; text-decoration: none;">vietstrix@gmail.com</a><br/>
      🌐 <a href="https://vietstrix.com" style="color: #4da6ff; text-decoration: none;">vietstrix.com</a><br/>
      📞 +84 123 456 789
    </td>
  </tr>
</table>
  </div>
</div>

        `,
    };

    // Kiểm tra kết nối trước khi gửi
    await new Promise<void>((resolve, reject) => {
      transporter.verify((error) => {
        if (error) {
          console.error('Lỗi kết nối SMTP:', error);
          reject(error);
        } else {
          console.log('✅ Kết nối SMTP thành công');
          resolve();
        }
      });
    });

    // Gửi email
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email đã gửi đến ${recipientEmail}`);
    console.log('Chi tiết gửi email:', info);
  } catch (error) {
    // Logging chi tiết lỗi
    console.error('❌ Lỗi gửi email chi tiết:');

    if (error instanceof Error) {
      console.error('Tên lỗi:', error.name);
      console.error('Thông điệp lỗi:', error.message);
      console.error('Chi tiết lỗi:', error.stack);
    } else {
      console.error('Lỗi không xác định:', error);
    }

    throw new Error('Gửi email thất bại.');
  }
};

// Export multiple functions
export { sendThankYouEmail };
export default sendThankYouEmail;
