import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
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
import { BaseDeleteSaveTemplateResDto } from './common/dto/res/base-delete-templare.res.dto';
import { BaseGetSaveTemplateByIdResDto } from './common/dto/res/base-getsave-templatebyid.res.dto';
@ApiTags('template')
@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) { };

  @Post('save-template/:id')
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
  async saveTemplate(
   @Body() data: SaveTemplateReqDto,
   @Param('id') templateId: string,
   @User() user: UserPayload): Promise<BaseSaveTemplateResDto> {
    const result = await this.templateService.saveTemplate(data, user.id, templateId);
    return new BaseSaveTemplateResDto(message.templateSave, result);
  }

  @Get('save-template')
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
  async getsaveTemplate(
    @User() user: UserPayload): Promise<BaseGetSaveTemplateResDto> {
    const result = await this.templateService.getsaveTemplate(user);
    return new BaseGetSaveTemplateResDto(message.getSaveTemplate,result);
  }

  @Get('save-template/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'User get save template by id',
    description: 'get save templete by id.',
  })
  @ApiResponse({
    status: 201,
    description: 'User get template',
    type: BaseGetSaveTemplateByIdResDto,
  })
  async getsaveTemplateById(
   @Param('id') versionId: string
  ): Promise<BaseGetSaveTemplateByIdResDto> {
    const result = await this.templateService.getsaveTemplateById(versionId);
    return new BaseGetSaveTemplateByIdResDto(message.getSaveTemplate,result);
  }

  @Delete('delete-template/:id')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'User will delete template',
    description: 'delete save templete.',
  })
  @ApiResponse({
    status: 201,
    description: 'User delete template',
    type: BaseDeleteSaveTemplateResDto,
  })
  async deleteSaveTemplate(
    @Param('id') templateId: string): Promise<BaseDeleteSaveTemplateResDto> {
    await this.templateService.deleteSaveTemplate(templateId);
    return new BaseDeleteSaveTemplateResDto(message.deleteSaveTemplate,{});
  }
  
}
