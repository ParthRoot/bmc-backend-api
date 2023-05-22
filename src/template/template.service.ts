import { Injectable } from '@nestjs/common';
import { SaveTemplateRepository } from 'src/db/repository';
import { SaveTemplateReqDto } from './common/dto/req';
import { SaveTemplateEntity } from 'src/db/entity/saveTemplate.entity';
@Injectable()
export class TemplateService {
    constructor(
        private readonly saveTemplateRepository: SaveTemplateRepository
        ) {}

        /**
         * it will save template
         * @param payload save template value
         * @returns template value
         */
        
        private async createTemplate(payload, user, templateId) {
          const template = await this.saveTemplateRepository.create({
            value: payload.value,
            user,
            template: templateId
          });
        
          const savedTemplate = await this.saveTemplateRepository.save(template);
          return savedTemplate;
        }
        

        /**
        * save Template
        * @param saveTemplate Value
        * @param user user id take from payload
        * @param template_id take template id 
        */
        async saveTemplate(saveTemplate, user, template_id) {
          try {
            const saveTemp = await this.saveTemplateRepository.findOne({
              where: {
                is_current_version: true,
                user: { id: user.id },
                template: { id: template_id }
              }
            });
        
            if (saveTemp) {
              saveTemp.is_current_version = false;
              await this.saveTemplateRepository.save(saveTemp);
            }
        
            await this.createTemplate(saveTemplate, user, template_id);
          } catch (err) {
            throw err;
          }
        }

        /**
         * it will return save templates 
         * @param id user id
         * @returns get all save template
         */
        async getsaveTemplate(id?: string){
          try{
            const template = await this.saveTemplateRepository.find({
              where: {
                is_deleted: false,
                id
              }
            });
            if (template.length === 0) {
              throw new Error(`Template does not exist`);
            }
            return template;
          }catch(err){
            throw err;
          }
        }

        
        
}