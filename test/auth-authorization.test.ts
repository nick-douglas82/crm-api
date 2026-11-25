import { env } from 'cloudflare:workers'
import { describe, expect, it } from 'vitest'
import { isAllowedGithubAccount } from '../src/modules/auth/auth.policy'

describe('GitHub account authorisation', () => {
  it('allows the approved GitHub account', () => {
    expect(isAllowedGithubAccount(env.ALLOWED_GITHUB_ACCOUNT)).toBe(true)
  })

  it('rejects another GitHub account', () => {
    expect(isAllowedGithubAccount('99999999')).toBe(false)
  })
})
