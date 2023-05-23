import { Injectable } from '@nestjs/common';
import { SaveTemplateRepository, TemplateRepository } from 'src/db/repository';
import { RestoreTemplateReqDto } from './common/query';
import { UserPayload } from 'src/utils';
import { SaveTemplateEntity } from 'src/db/entity/saveTemplate.entity';
import { TemplateEntity } from 'src/db/entity';

@Injectable()
export class TemplateService {
  constructor(private readonly templateRepository: TemplateRepository, private readonly saveTemplateRepository: SaveTemplateRepository) { }

  /**
   * list template all and list template by id
   * @param id string ?optional
   * @returns list template details
   */
  async listTemplate(id?: string): Promise<TemplateEntity[]> {
    try {
      const template = await this.templateRepository.find({
        where: {
          is_active: true,
          id
        }
      });

      if (template.length === 0) {
        throw new Error(`Template does not exist`);
      }

      return template;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  /**
   * restore the template 
   * @param user 
   * @param template_id version
   * @param versiond_id 
   * @returns template details
   */
  async restoreTemplate(user: UserPayload, data: RestoreTemplateReqDto): Promise<SaveTemplateEntity> {
    try {
      const restTemplateVersion = await this.saveTemplateRepository.findOne({
        where: {
          id: data.version_id,
        }
      });

      if (!restTemplateVersion) {
        throw new Error('Template not found');
      }

      if (restTemplateVersion.is_current_version === true) {
        throw new Error('This is already current version');
      }

      await this.changeTempVersion(user, data.template_id);

      restTemplateVersion.is_current_version = true;
      await this.saveTemplateRepository.save(restTemplateVersion);

      return restTemplateVersion;
    } catch (error) {
      throw new Error(`${error.message}`);
    }
  }

  /**
   * change the version of template
   * @param user 
   * @param template_id
   *  
   */
  private async changeTempVersion(user: UserPayload, template_id: string) {
    try {
      const currentVersion = await this.saveTemplateRepository.findOne({
        where: {
          is_current_version: true,
          user: { id: user.id },
          template: { id: template_id },
        },
      });

      if (!currentVersion) {
        throw new Error();
      }

      currentVersion.is_current_version = false;
      await this.saveTemplateRepository.save(currentVersion);

    } catch (err) {
      console.log(`For User: ${user.id} and Template: ${template_id} not found`);
    }
  }
}
