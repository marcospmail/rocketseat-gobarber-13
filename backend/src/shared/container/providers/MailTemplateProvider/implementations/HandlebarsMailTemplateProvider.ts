import fs from 'fs'
import handlebars from 'handlebars'
import IParseMailTemplateProvider from '../dtos/IParseMailTemplateProvider'

import IMailTemplateProvider from '../models/IMailTemplateProvider'

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  public async parse(
    templateData: IParseMailTemplateProvider
  ): Promise<string> {
    const templateFile = await fs.promises.readFile(templateData.file, {
      encoding: 'utf-8'
    })
    const parseTemplate = handlebars.compile(templateFile)

    return parseTemplate(templateData.variables)
  }
}

export default HandlebarsMailTemplateProvider
