import type { UserProfile } from '../stores/auth'
import { v4 as uuid } from 'uuid'
import { faker } from '@faker-js/faker'

const useUserSeeder = () => {

  const createUser = () => {
    const email = faker.internet.email()
    const user = {
      id: uuid(),
      email,
      username: faker.internet.username(),
      name: faker.person.fullName(),
      phone: faker.phone.number(),
      avatar_url: faker.image.avatar(),
      created_at: new Date().toISOString(),
    }

    return user
  }

  const main = (length: number = 100): UserProfile[] => {
    return Array.from({ length }).map(createUser)
  }

  return {
    main,
  }
}

useUserSeeder().main()
