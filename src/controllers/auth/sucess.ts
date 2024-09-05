// import { Request, Response } from "express";

// export const success = async (req: Request, res: Response): Promise<void> => {
//   res.send(
//     "Email verified successfully. You can now close this page and return to the app.",
//   );
// };

import { Request, Response } from "express";

export const success = async (req: Request, res: Response): Promise<void> => {
  const loginUrl = process.env.LOGIN_URL;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification Success</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background-color: #f0f0f0;
            }
            .container {
                text-align: center;
                background-color: white;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .button {
                display: inline-block;
                background-color: #4CAF50;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
                transition: background-color 0.3s;
            }
            .button:hover {
                background-color: #45a049;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Email Verified Successfully</h1>
            <p>You can now close this page and return to the app, or click the button below to log in.</p>
            <a href="${loginUrl}" class="button">Go to Login</a>
        </div>
    </body>
    </html>
  `;

  res.send(html);
};
