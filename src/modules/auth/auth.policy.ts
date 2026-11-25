import { env } from 'cloudflare:workers'

const ALLOWED_GITHUB_ACCOUNT_ID = env.ALLOWED_GITHUB_ACCOUNT

export function isAllowedGithubAccount(accountId: string): boolean {
  return accountId === ALLOWED_GITHUB_ACCOUNT_ID
}
