/* eslint-disable */
import { Injectable } from "@nestjs/common";
import { MailtrapClient } from "mailtrap";
import { env } from "process";

const client = new MailtrapClient({
  endpoint: "https://send.api.mailtrap.io/",
  token: env.MAILTRAP_TOKEN,
});

const sender = { name: "HYDROTEK", email: "validate@hydrotek.store" };
@Injectable()
export class MailService {
  async sendResetPasswordMail(email: string, token: string) {
    client
      .send({
        from: sender,
        to: [{ email: email }],
        template_uuid: "7f773408-33d9-4edb-b6c9-ca91dccd44d4", //? reser password template
        template_variables: {
          email: email,
          url:
            env.env === "production"
              ? `https://www.hydrotek.store/?token=${token}&&email=${email}`
              : env.env === "staging"
                ? `http://85.31.231.196:51732/?token=${token}&&email=${email}`
                : `http://localhost:5173/?token=${token}&&email=${email}`,
        },
      })
      .then((res) => {
        console.log("Email sent!", res);
      })
      .catch(console.error);
  }

  async sendSignUpValidationMail(email: string, name: string, token: string) {
    client
      .send({
        from: sender,
        to: [{ email: email }],
        template_uuid: "fd83463d-1a7c-4453-b7c6-2c35ba3db0e4", //? Verify template
        template_variables: {
          userName: name,
          url:
            env.env === "production"
              ? `https://www.hydrotek.store/?newUser=true&&token=${token}&&email=${email}`
              : env.env === "staging"
                ? `http://85.31.231.196:51732/?newUser=true&&token=${token}&&email=${email}`
                : `http://localhost:5173/?newUser=true&&token=${token}&&email=${email}`,
        },
      })
      .then((res) => {
        console.log("Email sent!", res);
        return "Email sent!";
      })
      .catch(console.error);
  }
}
