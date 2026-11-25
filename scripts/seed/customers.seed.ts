import { faker } from '@faker-js/faker'
import { customers } from '../../src/db/schema'
import type { Database } from '../../src/db'

const batchSize = 10

export async function seedCustomers(database: Database): Promise<void> {
  const existingCustomers = await database.select({ id: customers.id }).from(customers).limit(1)

  if (existingCustomers.length > 0) {
    console.log('Customers already exist. Skipping.')
    return
  }

  faker.seed(12345)

  const timestamp = Math.floor(Date.now() / 1000)

  const customerData = Array.from({ length: 50 }, () => ({
    name: faker.company.name(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    createdAt: timestamp,
    updatedAt: timestamp,
  }))

  for (let index = 0; index < customerData.length; index += batchSize) {
    const batch = customerData.slice(index, index + batchSize)

    await database.insert(customers).values(batch)
  }

  console.log('Seeded 50 customers.')
}
