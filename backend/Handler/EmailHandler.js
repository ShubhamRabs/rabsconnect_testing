const nodemailer = require("nodemailer");

const mailHandler = (email, lead, callback) => {
  // Create a transporter object
  const transporter = nodemailer.createTransport({
    host: "162.241.125.121",
    port: 587,
    secure: false, // use SSL
    auth: {
      user: "smtp@cicd-frontend.rabs.support",
      pass: "tv5-mpy%^@Eb",
    },
    tls: {
      rejectUnauthorized: false, // Add this line to avoid certain SSL issues
    },
  });

  // Deep link URL for your app
  const deepLinkURL = "rabsconnect://LeadsScreen";

  const mailOptions = {
    from: "sales@cicd-frontend.rabs.support",
    to: email,
    subject: "Reminder: Follow-up with Lead (RABS Connect)",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Company Name</title>
          <style>
              body {
                  background-color: #013562;
                  font-family: Arial, sans-serif;
                  color: #023462;
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
              }

              .container {
                  background-color: #FFFFFF;
                  width: 90%;
                  max-width: 700px;
                  padding: 30px;
                  border-radius: 10px;
                  text-align: center;
                  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
              }

              .clock {
                  display: block;
                  margin: 0 auto 20px;
                  max-width: 100%;
                  height: auto;
              }

              .company-name {
                  font-style: italic;
                  color: #FDC057;
              }

              .text2, .text3, .text4, .text5, .text7, .text8 {
                  font-weight: 700;
                  line-height: 1.6;
                  margin: 10px 0;
              }

              .button {
                  background-color: #36B448;
                  color: #FFFFFF;
                  padding: 15px 60px;
                  border: none;
                  border-radius: 30px;
                  cursor: pointer;
                  font-weight: bold;
              }

              @media (max-width: 768px) {
                  .container {
                      width: 100%;
                      border-radius: 0;
                      padding: 20px;
                  }
              }
          </style>
      </head>
      <body>
          <div class="container">
              <h2 class="text"><span class="company-name">Company</span> Name</h2>
              <img src="clock.png" alt="clock" class="clock">
              <h1 class="text2">MONTHLY REMINDER</h1>
              <h4 class="text3">Please renew your subscription</h4>
              <p class="text4">Click any item in your email to open the settings panel on the right. You can change<br>
                  background color, padding and set positions of the text and images.
              </p>
              <p class="text4">To edit this text, change the text alignment and add links, double click to get into text<br>
                  edit mode. To change fonts, use Default Fonts from the design tab on the right.
              </p>
              <h3 class="text5">Expires: 05 November</h3>
              <div class="text6">
                  <a href="${deepLinkURL}">
                      <button type="submit" class="button">Renew</button>
                  </a>
              </div>
              <h3 class="text7">Need Help?</h3>
              <h5 class="text8">Give us a call on 1-800 SAMPLE</h5>
          </div>
      </body>
      </html>
      <p>I hope this message finds you well.</p>
      <p>This is a gentle reminder to follow up with your lead, <strong>${lead.name}</strong>, regarding Lead ID: <strong>${lead.id}</strong>. Keeping in touch with potential clients is crucial for maintaining strong relationships and driving business success.</p>
      <p>Please take a moment to reach out to them and address any questions or concerns they may have. If you need any assistance or additional information, feel free to reach out to our support team.</p>
      <p>Thank you for your prompt attention to this matter.</p>
      <h3>Click on this link to open the lead in the mobile app:</h3>
      <a href="${deepLinkURL}">Open Lead</a>
      <p>Sincerely,</p>
      <p>RABS Connect</p>
    `,
  };

  transporter.sendMail(mailOptions, callback);
};

module.exports = { mailHandler };
