const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, message) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            throw new Error("Email configuration is missing");
        }

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: message
        });

        console.log("Email sent successfully:", info.messageId);

        return info;

    } catch (error) {
        console.log("Email sending error:", error.message);
        throw error;
    }
};

module.exports = sendEmail;
