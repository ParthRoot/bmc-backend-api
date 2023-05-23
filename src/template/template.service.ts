import { Injectable } from '@nestjs/common';
import { SaveTemplateEntity } from 'src/db/entity/saveTemplate.entity';
import { SaveTemplateRepository } from 'src/db/repository';
import { UserPayload } from 'src/utils';
import { Not } from 'typeorm';
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
        
        private async createTemplate(payload, user, templateId){
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
        async saveTemplate(saveTemplate, user, template_id): Promise<SaveTemplateEntity> {
          try {
            const saveTemp = await this.saveTemplateRepository.findOne({
              where: {
                is_current_version: true,
                user: { id: user.id },
                template: { id: template_id }
              }
            });

            if (!saveTemp) {
              throw new Error('template not saved')
            }
              saveTemp.is_current_version = false;
              await this.saveTemplateRepository.save(saveTemp);
        
            return await this.createTemplate(saveTemplate, user, template_id);
          } catch (err) {
            throw err;
          }
        }

        /**
         * it will return save templates 
         * @param id user id
         * @returns get all save template
         */
        async getsaveTemplate(user:UserPayload){
          try{
            const template = await this.saveTemplateRepository.find({
              relations:{
                user: true
              },
              where: {
                is_deleted: false,
                user:{
                  id: user.id
                }
              },

            });
            if (template.length === 0) {
              throw new Error(`Template does not exist`);
            }
            return template;
          }catch(err){
            throw err;
          }
        }
        
        /**
         * it will return template value
         * @param id version id 
         * @returns template value
         */
        async getsaveTemplateById(id: string){
          try{
            const template = await this.saveTemplateRepository.findOne({
              where: {
                is_deleted: false,
                id
              }
            });
            if (!template) {
              throw new Error(`Template does not exist`);
            }
            return template;
          }catch(err){
            throw err;
          }
        }


        /**
         * it will delete saveTemplate by id
         * @param id savetemplate id
         */
        async deleteSaveTemplate(id :string){
          try {
            const template = await this.saveTemplateRepository.findOne({
              where: {
                is_deleted: false,
                id
              },
            });
          
            if (!template) {
              throw new Error('Template not found');
            }
          
            if (template.is_current_version) {
              const previousTemplate = await this.saveTemplateRepository.findOne({
                where: {
                  is_deleted: false,
                  id: Not(id),
                },
                order: {
                  created_at: 'DESC',
                },
              });
          
              if (previousTemplate) {
                previousTemplate.is_current_version = true;
                await this.saveTemplateRepository.save(previousTemplate);
              }
            }
          
            template.is_deleted = true;
            template.is_current_version = false;
            await this.saveTemplateRepository.save(template);
          
          }catch(err){
            throw err;
          }
        }
}