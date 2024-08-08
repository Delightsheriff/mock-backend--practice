import { Request, Response } from "express";
import https from "https";
import { ENVIRONMENT } from "../../common/config/environment";
// import { ENVIRONMENT } from "../common/config/environment";

interface PaymentRequest {
  email: string;
  amount: number;
}

interface PaystackResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

const payStack = {
  acceptPayment: async (
    req: Request<{}, {}, PaymentRequest>,
    res: Response,
  ): Promise<void> => {
    try {
      const { email, amount } = req.body;

      const params = JSON.stringify({
        email,
        amount: amount * 100,
      });

      const options: https.RequestOptions = {
        hostname: "api.paystack.co",
        port: 443,
        path: "/transaction/initialize",
        method: "POST",
        headers: {
          Authorization: `Bearer ${ENVIRONMENT.PAYSTACK.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      };

      const clientReq = https.request(options, (apiRes) => {
        let data = "";
        apiRes.on("data", (chunk) => {
          data += chunk;
        });
        apiRes.on("end", () => {
          const parsedData: PaystackResponse = JSON.parse(data);
          console.log(parsedData);
          res.status(200).json(parsedData);
        });
      });

      clientReq.on("error", (error: Error) => {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
      });

      clientReq.write(params);
      clientReq.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    }
  },
};

export const initializePayment = payStack.acceptPayment;
