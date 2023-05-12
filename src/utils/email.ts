import path from 'path';
import fs from 'fs';
import ejs from 'ejs';
import { htmlToText } from 'html-to-text';
import juice from 'juice';
import sendgridTransport from '@sendgrid/mail';
import { getEnv } from './env.util';
sendgridTransport.setApiKey(getEnv('SENDGRID_API_KEY'));

export interface Address {
  name: string;
  address: string;
}

export default class CustomMail {
  protected from = getEnv('MAIL_FROM');
  // protected from = 'hello@mydigitalme.com';

  public constructor(_props?: any) {
    this.html = this.html.bind(this);
  }

  public html = async (
    templateName: string,
    templateVars: any,
    subject: string,
    email: string | Address | Array<string | Address> | undefined,
    _transport?: any,
  ): Promise<any> => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const root = path.resolve(path.dirname(require.main.filename), '..');

      const templatePath = `views/email/${templateName}.ejs`;

      const viewPath = path.resolve(root, templatePath);

      const options: any = {
        to: email,
        subject,
        from: this.from,
      };

      const ejsTemplate = 'views/email/templates/';
      const templatePathEjs = path.resolve(root, ejsTemplate);
      if (templateName && fs.existsSync(viewPath)) {
        const template = fs.readFileSync(viewPath, 'utf-8');
        templateVars = {
          ...templateVars,
          subject,
          url: templateVars?.url,
          from: this.from,
          link: 'http://localhost:3000',
        };
        const html = ejs.render(template, templateVars, {
          views: [templatePathEjs],
        });
        const text = htmlToText(html);
        options.html = juice(html);
        options.text = text;
      } else {
        throw new Error('file does not exists');
      }

      const sendResponse = await sendgridTransport.sendMultiple({
        ...options,
      });
      console.log('sendResponse: ', sendResponse);
      // console.log(options);
      // console.log('templatePathEjs: ', templatePathEjs);
      return true;
    } catch (error) {
      console.log('error==========', error);
      return false;
    }
  };
}
