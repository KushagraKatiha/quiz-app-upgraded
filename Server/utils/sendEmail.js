import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config({
    path: './.env'
})

const sendMail = async function(email, subject, content){
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    await transporter.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: subject,
        text: content
    })
}


export default sendMail