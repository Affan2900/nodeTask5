import nodemailer from 'nodemailer';
import { IToDo } from '../models/toDoModel';
import dotenv from 'dotenv';

dotenv.config();

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export default async function sendEmail(
  to: string,
  subject: string,
  tasks: IToDo[]
): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    }
  });

  const emailBody = generateEmailBody(tasks);

  const mailOptions: EmailOptions = {
    to,
    subject,
    html: emailBody
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}



function generateEmailBody(tasks: IToDo[]): string {
  // Start the HTML email body
  let emailBody = `
    <html>
      <body>
        <h1>Daily Task Summary</h1>
        <p>Here are your tasks for today:</p>
        <ul>
  `;

  // Check if there are tasks
  if (tasks.length === 0) {
    emailBody += `<li>No tasks for today!</li>`;
  } else {
    // Loop through each task and add it to the email body
    tasks.forEach(task => {
      emailBody += `
        <li>
          <strong>${task.title}</strong><br />
          <em>Due: ${task.createdDate.toLocaleDateString()}</em><br />
        </li>
      `;
    });
  }

  // Close the HTML tags
  emailBody += `
        </ul>
        <p>Have a productive day!</p>
      </body>
    </html>
  `;

  return emailBody;
}
