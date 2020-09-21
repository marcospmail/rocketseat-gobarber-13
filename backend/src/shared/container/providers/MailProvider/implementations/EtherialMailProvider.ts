import nodemailer, { Transporter } from 'nodemailer'
import { injectable, inject } from 'tsyringe'

import IMailTemplateProvider from '../../MailTemplateProvider/models/IMailTemplateProvider'
import ISendMailDTO from '../dtos/ISendMailDTO'

import IMailProvider from '../models/IMailProvider'

@injectable()
class EtherialMailProvider implements IMailProvider {
  private transporter: Transporter

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider
  ) {
    nodemailer.createTestAccount((err, account) => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass
        }
      })
      this.transporter = transporter
    })
  }

  public async sendEmail({
    from,
    to,
    subject,
    templateData
  }: ISendMailDTO): Promise<void> {
    this.transporter.sendMail(
      {
        from: {
          name: from?.name || 'GoBarber',
          address: from?.email || 'gobarber@email.com'
        },
        to: {
          name: to.name,
          address: to.email
        },
        subject,
        html: await this.mailTemplateProvider.parse(templateData)
      },
      (err, info) => {
        if (err) {
          return process.exit(1)
        }

        console.log('Message sent: %s', info.messageId)
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))

        return null
      }
    )
  }
}

export default EtherialMailProvider
