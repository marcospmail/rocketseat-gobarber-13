interface ITemplateVariables {
  [key: string]: string | number
}

interface IParseMailTemplateProvider {
  file: string
  variables: ITemplateVariables
}

export default IParseMailTemplateProvider
