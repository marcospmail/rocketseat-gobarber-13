import IMailTemplateProvider from '../models/IMailTemplateProvider'

class FakeParseMailTemplateProvider implements IMailTemplateProvider {
  public async parse(): Promise<string> {
    return 'Fake Mail Template Provider'
  }
}

export default FakeParseMailTemplateProvider
