import IParseMailTemplateProvider from '../../MailTemplateProvider/dtos/IParseMailTemplateProvider'

interface IMailContact {
  name: string
  email: string
}

interface ISendMailDTO {
  to: IMailContact
  from?: IMailContact
  subject: string
  templateData: IParseMailTemplateProvider
}

export default ISendMailDTO
