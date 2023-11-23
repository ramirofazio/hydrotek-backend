import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { env } from "process";

@Injectable()
export class MailService {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly mailerService: MailerService) {}

  async sendResetPasswordMail(email: string, token: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: "HYDROTEK -Reestablecer contraseña-",
      template: "recover_password", // Nombre de la plantilla
      context: {
        // Reemplazar por link correcto cuando se complete el front.
        link:
          env.env === "production"
            ? `https://www.hydrotek.store/?token=${token}&&email=${email}`
            : env.env === "staging"
            ? `http://85.31.231.196:51732/?token=${token}&&email=${email}`
            : `http://localhost:5173/?token=${token}&&email=${email}`,
      },
    });

    return "Email sent!";
  }

  async sendSignUpValidationMail(email: string, token: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: "HYDROTEK -Termina tu registro-",
      template: "validate_signUp", // Nombre de la plantilla
      context: {
        // Reemplazar por link correcto cuando se complete el front.
        link:
          env.env === "production"
            ? `https://www.hydrotek.store/?newUser=true&&token=${token}&&email=${email}`
            : env.env === "staging"
            ? `http://85.31.231.196:51732/?newUser=true&&token=${token}&&email=${email}`
            : `http://localhost:5173/?newUser=true&&token=${token}&&email=${email}`,
      },
    });

    return "Email sent!";
  }
}
