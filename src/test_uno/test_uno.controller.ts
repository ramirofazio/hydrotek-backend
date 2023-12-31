/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  // ParseEnumPipe,
  ParseUUIDPipe,
} from "@nestjs/common";

import { EditTestUnoDTO } from "./test_uno.dto";
import { TestUnoService } from "./test_uno.service";

@Controller("test_uno")
export class TestUnoController {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly TestUnoService: TestUnoService) {}

  @Post()
  async postTest() {
    return this.TestUnoService.postTest();
  }

  @Post("cat")
  async postCategory() {
    return this.TestUnoService.postCategory();
  }

  @Get()
  async getAllTests() {
    return this.TestUnoService.getAllTests();
  }

  @Get(":cat")
  async getTestsByCategory(@Param("cat") cat: number) {
    return this.TestUnoService.getTestsByCategory(cat);
  }

  @Get()
  async getTestUnos(): Promise<undefined | object> {
    return this.TestUnoService.getTestUnos();
  }

  //dejo comentado este endpoint, sirve como ejemplo de uso
  //de ParseEnumPipe

  // @Get("/:type")
  // async getTestUnoById(@Param("type", new ParseEnumPipe(CategoryType)) type: string): Promise<any> {
  //   return {type};
  // }

  @Get("/:id")
  async getTestUnoById(@Param("id", ParseUUIDPipe) id: string): Promise<undefined | object> {
    return this.TestUnoService.getTestUnoById(id);
  }

  // @Post()
  // async createTestUno(@Body() body: CreateTestUnoDTO): Promise<any> {
  //   return this.TestUnoService.createTestUno(body);
  // }

  @Put("/:id")
  async updateTestUno(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() body: EditTestUnoDTO,
  ) {
    return this.TestUnoService.updateTestUno(id, body);
  }

  @Delete("/:id")
  async deleteTestUno(@Param("id", ParseUUIDPipe) id: string) {
    return this.TestUnoService.deleteTestUno(id);
  }
}
