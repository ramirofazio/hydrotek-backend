import { Controller, Get, HttpStatus } from "@nestjs/common";

@Controller()
export class AppController {
  @Get("/favicon.ico")
  ignoreFavicon() {
    return HttpStatus.NO_CONTENT;
  }
}
