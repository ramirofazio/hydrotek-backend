import { Controller, Get } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";

@Controller("mail")
export class MailController {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly mailerService: MailerService) {}

  @Get()
  async sendEmail() {
    await this.mailerService.sendMail({
      to: "recipient@example.com",
      subject: "Hello",
      template: "test", // Nombre de la plantilla
      context: {
        // Datos que se usarán en la plantilla
        username: "John Doe",
      },
    });

    return "Email sent!";
  }
}
