import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export default async function sendEmail(
  userEmail: string,
  userPassword: string,
  to: string,
  subject: string,
  getEmailBody: () => Promise<string>
): Promise<void> {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: userEmail,
      pass: userPassword
    }
  });

  const emailBody = await getEmailBody();

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

interface Task {
  title: string;
  description: string;
  dueDate: Date;
  status: 'completed' | 'pending';
}

function generateEmailBody(tasks: Task[]): string {
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
          <em>Due: ${task.dueDate.toLocaleDateString()}</em><br />
          <p>${task.description}</p>
          <p>Status: ${task.status}</p>
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