import ISendMailDTO from '../dtos/ISendMailDTO'
import IMailProvider from '../models/IMailProvider'

class FakeMailProvider implements IMailProvider {
  private sentEmails: ISendMailDTO[] = []

  public async sendEmail(mailData: ISendMailDTO): Promise<void> {
    this.sentEmails.push(mailData)
  }
}

export default FakeMailProvider
