import * as aws from "@aws-sdk/client-ses";
import nodemailer from "nodemailer";
import { envVariables } from "./env.variables";

// configure AWS SDK
const ses = new aws.SES({
  apiVersion: "2012-10-17",
  region: envVariables.AWS_REGION,
  credentials: {
    secretAccessKey: envVariables.AWS_SES_SECRET_ACCESS_KEY,
    accessKeyId: envVariables.AWS_SES_ACCESS_KEY_ID,
  },
});

// create Nodemailer SES transporter
const transporter = nodemailer.createTransport({
  SES: { ses, aws },
  sendingRate: 1, // max 1 messages/second,
  maxConnections: 1,
});

export const sendEmail = (
  toAddresses: string,
  subject: string,
  emailBody: string
) => {
  return new Promise(async (resolve, reject) => {
    transporter.sendMail(
      {
        from: envVariables.FROM_EMIAL, // it should be verified email from AWS SES
        to: toAddresses,
        subject,
        html: emailBody,
      },
      (err, info) => {
        transporter.close();
        resolve(true);
        if (err) {
          console.error(err);
        } else {
          console.log(new Date().toLocaleString(), info?.envelope);
          console.log(info?.messageId);
        }
      }
    );
    resolve(true);
  });
};
