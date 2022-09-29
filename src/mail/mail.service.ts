import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    sequre: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  } as SMTPTransport.Options);

  async sendActivationMail(email: string, link: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: `Активация аккаунта на "${process.env.URL_API}"`,
        text: '',
        html: `
          <div>
            <h2>Для активации аккаунта перейдите по ссылке:</h2>
            <a href="${link}">
              <h3>Ссылка для активации аккаунта</h2>
            </a>
          </div>
        `,
      });
    } catch {
      throw new HttpException(
        'Во время отправки письма произошла ошибка',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async sendResetPasswordMail(email: string, link: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: `Смена пароля на "${process.env.URL_API}"`,
        text: '',
        html: `
          <div>
            <h2>Для смены пароля перейдите по ссылке:</h2>
            <a href="${link}">
              <h3>Ссылка для смены пароля</h2>
            </a>
            <div>
              <h3>Если вы не запрашивали смену пароля, проигнорируйте письмо</h2>
            </div>
          </div>
        `,
      });
    } catch {
      throw new HttpException(
        'Во время отправки письма произошла ошибка',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
