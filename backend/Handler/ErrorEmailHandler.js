const nodemailer = require("nodemailer");

const ErrorEmailHandler = (msg, callback) => {
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

  const mailOptions = {
    from: "sales@cicd-frontend.rabs.support",
    to: email,
    subject: "Error in RABS Connect CRM",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>RABS Connect</title>
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
             ${msg}
          </div>
      </body>
      </html>
    `,
  };

  transporter.sendMail(mailOptions, callback);
};

module.exports = { ErrorEmailHandler };
