import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider'
import ListProvidersService from './ListProvidersService'

describe('ListProviders', () => {
  let usersRepository: IUsersRepository
  let showProfileService: ListProvidersService
  let fakeCacheProvider: FakeCacheProvider

  beforeEach(() => {
    usersRepository = new FakeUsersRepository()
    fakeCacheProvider = new FakeCacheProvider()
    showProfileService = new ListProvidersService(
      usersRepository,
      fakeCacheProvider
    )
  })

  it('should be able to list all providers ', async () => {
    const user1 = await usersRepository.create({
      name: 'User 1',
      email: 'user1@email.com',
      password: '123456'
    })

    const user2 = await usersRepository.create({
      name: 'User 2',
      email: 'user2@email.com',
      password: '123456'
    })

    const loggedUser = await usersRepository.create({
      name: 'Logged user',
      email: 'logged_user@email.com',
      password: '123456'
    })

    const providers = await showProfileService.execute({
      user_id: loggedUser.id
    })

    expect(providers).toEqual([user1, user2])
  })
})
