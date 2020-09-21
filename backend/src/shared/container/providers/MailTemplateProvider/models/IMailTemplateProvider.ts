import IParseMailTemplateProvider from '../dtos/IParseMailTemplateProvider'

interface IMailTemplateProvider {
  parse(data: IParseMailTemplateProvider): Promise<string>
}

export default IMailTemplateProvider
