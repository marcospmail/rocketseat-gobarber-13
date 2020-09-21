import { container } from 'tsyringe'

import DiskStorageProvider from '@shared/container/providers/StorageProvider/implementations/DiskStorageProvider'
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider'

import EtherialMailProvider from '@shared/container/providers/MailProvider/implementations/EtherialMailProvider'
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider'
import HandlebarsMailTemplateProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider'
import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider'

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider
)

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTemplateProvider
)

container.registerInstance<IMailProvider>(
  'MailProvider',
  container.resolve(EtherialMailProvider)
)
