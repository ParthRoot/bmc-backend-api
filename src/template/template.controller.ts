import { Controller, Get } from '@nestjs/common';
import { TemplateService } from './template.service';

@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) { };

  @Get('getTemp')
  async getTemp() {
    const result = await this.templateService.tempTemplate();
    return {
      data: {
        code: result,
      },
      message: 'works',
    };
  }
}
