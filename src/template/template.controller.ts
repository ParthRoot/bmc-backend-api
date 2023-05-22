import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TemplateService } from './template.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiOkResponse,
} from '@nestjs/swagger';
import { BaseGetSaveTemplateResDto, BaseSaveTemplateResDto } from './common/dto/res';
import { SaveTemplateReqDto } from './common/dto/req';
import { message } from 'src/utils/message';
import { AuthGuard, UserPayload } from 'src/utils';
import { User } from 'src/utils/decorators';
@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) { };

  @Post('savetemplate/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'User save template',
    description: 'save templete.',
  })
  @ApiResponse({
    status: 201,
    description: 'User sved template',
    type: BaseSaveTemplateResDto,
  })
  async saveTemplate(@Body() data: SaveTemplateReqDto,
   @Param('id') templateid: string,
   @User() user: UserPayload): Promise<BaseSaveTemplateResDto> {
    const result = await this.templateService.saveTemplate(data, user.id, templateid);
    return new BaseSaveTemplateResDto(message.templateSave, result);
  }

  @Get('getsavetemplate')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'User get save template',
    description: 'get save templete.',
  })
  @ApiResponse({
    status: 201,
    description: 'User get template',
    type: BaseGetSaveTemplateResDto,
  })
  async getsaveTemplate(): Promise<BaseSaveTemplateResDto> {
    const result = await this.templateService.getsaveTemplate();
    return new BaseSaveTemplateResDto(message.getSavetemplate,result);
  }
  
}
