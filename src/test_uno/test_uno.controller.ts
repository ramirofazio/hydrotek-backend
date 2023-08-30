import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    ParseEnumPipe,
    ParseUUIDPipe
  } from "@nestjs/common";
  
  import { CreateTestUnoDTO, EditTestUnoDTO } from "./test_uno.dto";
import { TestUnoService } from "./test_uno.service";
  
  @Controller("test_uno")
  export class TestUnoController {
    constructor(private readonly TestUnoService: TestUnoService) {}
  
    @Get()
    async getTestUnos(): Promise<any> {
      return this.TestUnoService.getTestUnos();
    }
  
    //dejo comentado este endpoint, sirve como ejemplo de uso
    //de ParseEnumPipe
  
    // @Get("/:type")
    // async getTestUnoById(@Param("type", new ParseEnumPipe(CategoryType)) type: string): Promise<any> {
    //   return {type};
    // }
  
    @Get("/:id")
    async getTestUnoById(@Param("id", ParseUUIDPipe) id: string): Promise<any> {
      
      return this.TestUnoService.getTestUnoById(id);
    }
  
    @Post()
    async createTestUno(@Body() body: CreateTestUnoDTO): Promise<any> {
      return this.TestUnoService.createTestUno(body);
    }
  
    @Put("/:id")
    async updateTestUno(@Param("id", ParseUUIDPipe) id: string, @Body() body: EditTestUnoDTO) {
      return this.TestUnoService.updateTestUno(id, body);
    }
  
    @Delete("/:id")
    async deleteTestUno(@Param("id", ParseUUIDPipe) id: string) {
      return this.TestUnoService.deleteTestUno(id);
    }
  }
  