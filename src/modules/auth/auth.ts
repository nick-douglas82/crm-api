import { betterAuth } from 'better-auth'
import { drizzleAdapter } from '@better-auth/drizzle-adapter'
import { drizzle } from 'drizzle-orm/d1'
import * as schema from '../../db/auth.schema'
import { isAllowedGithubAccount } from './auth.policy'

export function createAuth(environment: CloudflareBindings) {
  const database = drizzle(environment.DB, { schema })

  return betterAuth({
    database: drizzleAdapter(database, {
      provider: 'sqlite',
      schema,
    }),
    secret: environment.BETTER_AUTH_SECRET,
    baseURL: environment.BETTER_AUTH_URL,
    trustedOrigins: [environment.FRONTEND_URL],
    emailAndPassword: {
      enabled: false,
    },
    socialProviders: {
      github: {
        clientId: environment.GITHUB_CLIENT_ID,
        clientSecret: environment.GITHUB_CLIENT_SECRET,
      },
    },
    advanced: {
      ipAddress: {
        ipAddressHeaders: ['cf-connecting-ip'],
      },
    },
    user: {
      validateUserInfo: ({ source }) => {
        console.log('GitHub identity:', {
          provider: source.oauth?.providerId,
          accountId: source.oauth?.profile?.id,
        })

        const githubAccountId = source.oauth?.profile?.id

        if (
          source.oauth?.providerId !== 'github' ||
          !isAllowedGithubAccount(String(githubAccountId ?? ''))
        ) {
          return {
            error: 'access_denied',
            errorDescription: 'Account not authorised',
          }
        }
      },
    },
  })
}
