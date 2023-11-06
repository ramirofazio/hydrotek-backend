import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly mailerService: MailerService) {}
  async sendResetPasswordMail(email:string, token:string) {
    await this.mailerService.sendMail({
      to: email,
      subject: "Hydrotek -Reestablecer contraseña-",
      template: "recover_password", // Nombre de la plantilla
      context: {
        // Reemplazar por link correcto cuando se complete el front.
        link : `http://localhost:3000/auth/reset-password?token=${token}&mail=${email}`,
      },
    });

    return "Email sent!";


  }
}
