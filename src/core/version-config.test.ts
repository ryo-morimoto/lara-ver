import { describe, expect, it } from 'vitest'
import { getLatestStableVersion, isValidVersion } from './version-config'

describe('version-config', () => {
  describe('getLatestStableVersion', () => {
    it('should return the latest stable version', () => {
      const latest = getLatestStableVersion()
      expect(latest).toBe('11.x')
      expect(latest).not.toBe('master')
    })

    it('should be a valid version', () => {
      const latest = getLatestStableVersion()
      expect(isValidVersion(latest)).toBe(true)
    })
  })
})
