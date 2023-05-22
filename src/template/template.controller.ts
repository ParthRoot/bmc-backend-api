import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { TemplateService } from './template.service';
import { BaseListTemplateResDto, BaseRestoreTemplateResDto } from './common/dto/res';
import { message } from 'src/utils/message';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard, UserPayload } from 'src/utils';
import { User } from 'src/utils/decorators';
import { RestoreTemplateReqDto } from './common/query';

@ApiTags('template')
@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) { };

  @Get('listTemplate')
  @ApiOperation({
    summary: 'List Template',
    description: 'List Template',
  })
  @ApiResponse({
    status: 200,
    description: 'List of template Details',
    type: BaseListTemplateResDto,
  })
  async listTemplate(): Promise<BaseListTemplateResDto> {
    const result = await this.templateService.listTemplate();
    return new BaseListTemplateResDto(message.listTemplate, result);
  }


  @Get('getTemplateById/:id')
  @ApiOperation({
    summary: 'Get Template by ID',
    description: 'Retrieve template details by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Template details',
    type: BaseListTemplateResDto,
  })
  async getTemplateById(@Param('id') id: string): Promise<BaseListTemplateResDto> {
    const result = await this.templateService.listTemplate(id);
    return new BaseListTemplateResDto(message.listTemplate, result);
  }

  @Patch('restoreTemplate')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Restore Template by ID',
    description: 'Restore template by ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Restored template details',
    type: BaseRestoreTemplateResDto,
  })
  async restoreTemplate(@Query() data: RestoreTemplateReqDto, @User() user: UserPayload,): Promise<BaseRestoreTemplateResDto> {
    console.log(data);
    const result = await this.templateService.restoreTemplate(user, data);
    return new BaseRestoreTemplateResDto(message.listTemplate, result);
  }


}
