// import prisma from "../../config/prisma";

import multer from "multer";
import path from "path";
import fs from "fs";
import nodemailer from 'nodemailer';


// 
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRadians = (degrees: number): number => degrees * (Math.PI / 180);
  
    const R = 6371; // Radius of Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }


export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const distance = haversineDistance(lat1, lon1, lat2, lon2);
    return distance;
}

export const uploadImage = async(image: string, email: string) => {
  const server = "http://localhost:9000"
  const matches = image.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
      throw new Error('Invalid base64 image data');
  }

  const imageType = matches[1];
  const imageData = matches[2];
  const extension = imageType.split('/')[1]; // e.g., 'png', 'jpeg'
  const buffer = Buffer.from(imageData, 'base64');

  // Create uploads directory if it doesn't exist
  const uploadDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Generate filename
  const filename = `user-${email}-${Date.now()}.${extension}`;
  const filePath = path.join(uploadDir, filename);

  // Save the file
  await fs.promises.writeFile(filePath, buffer);

  return `${server}/uploads/${filename}`; // Retu
}


import hbs from 'nodemailer-express-handlebars';

export async function sendMail(payload: any) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    // ✅ Correctly set up the directory paths
    const viewsPath = path.resolve(__dirname, '../views/email');

    transporter.use('compile', hbs({
        viewEngine: {
            extname: '.hbs', //
            partialsDir: viewsPath,
            layoutsDir: viewsPath,
            defaultLayout: false,
        },
        viewPath: viewsPath,
        extName: '.hbs' 
    }));

    const mailOptions = {
        from: 'bibashkadel024@gmail.com',
        to: "dineshkadel11@gmail.com",
        subject: '🛠️ New Post Alert',
        template: 'email', 
        context: {
            message: payload.message
        }
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
