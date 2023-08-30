import { Controller, Get } from '@nestjs/common';
import { TestDosService } from './test_dos.service';

@Controller('test_dos')
export class TestDosController {
constructor(private readonly testDosService : TestDosService) {}
    
    @Get()
    async manageTestUnos(): Promise<any>  {
       return this.testDosService.manageTestUnos(); 
        
    }
}

