import ISendMailDTO from '../dtos/ISendMailDTO'

interface IMailProvider {
  sendEmail(mailData: ISendMailDTO): Promise<void>
}

export default IMailProvider
