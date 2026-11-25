import type { Database } from '../../src/db'
import { seedCustomers } from './customers.seed'

export interface Seeder {
  name: string
  run: (database: Database) => Promise<void>
}

export const seeders: Seeder[] = [
  {
    name: 'customers',
    run: seedCustomers,
  },
]
