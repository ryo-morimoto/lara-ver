import type { RedirectConfig, SupportedSite } from '../../schemas/config.schema'
import { useEffect, useState } from 'react'
import { storageService } from '../../services/storage-service'
import { AVAILABLE_VERSIONS } from '../../shared/constants'
import './App.css'

function App() {
  const [config, setConfig] = useState<RedirectConfig | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const currentConfig = await storageService.getConfig()
        setConfig(currentConfig)
      }
      catch (err) {
        console.error('Failed to load config:', err)
        setError('Failed to load settings')
      }
    }
    void loadConfig()
  }, [])

  const handleVersionChange = async (version: string) => {
    try {
      await storageService.updateConfig({ version: version as RedirectConfig['version'] })
      setConfig(prev => prev ? { ...prev, version: version as RedirectConfig['version'] } : null)
      setError(null)
    }
    catch (err) {
      console.error('Failed to update version:', err)
      setError('Failed to save version')
    }
  }

  const handleEnabledChange = async (enabled: boolean) => {
    try {
      await storageService.updateConfig({ enabled })
      setConfig(prev => prev ? { ...prev, enabled } : null)
      setError(null)
    }
    catch (err) {
      console.error('Failed to update enabled state:', err)
      setError('Failed to save settings')
    }
  }

  const handleSiteChange = async (site: SupportedSite, enabled: boolean) => {
    if (!config)
      return

    try {
      const newSites = { ...config.sites, [site]: enabled }
      await storageService.updateConfig({ sites: newSites })
      setConfig(prev => prev
        ? {
            ...prev,
            sites: { ...prev.sites, [site]: enabled },
          }
        : null)
      setError(null)
    }
    catch (err) {
      console.error(`Failed to update ${site} setting:`, err)
      setError(`Failed to save ${site} setting`)
    }
  }

  if (!config) {
    return (
      <div style={{ width: 300, padding: 16 }}>
        {error !== null ? <div style={{ color: 'red' }}>{error}</div> : <div>Loading...</div>}
      </div>
    )
  }

  return (
    <div style={{ width: 300, padding: 16 }}>
      <h1>Lara Ver</h1>

      {error !== null && (
        <div style={{ color: 'red', marginBottom: 16 }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <label>
          <input
            type="checkbox"
            checked={config.enabled}
            onChange={e => void handleEnabledChange(e.target.checked)}
          />
          Enable extension
        </label>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label>
          Version:
          <select
            value={config.version}
            onChange={e => void handleVersionChange(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            {AVAILABLE_VERSIONS.map(version => (
              <option key={version} value={version}>
                {version}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div>
        <h3>Sites</h3>
        <label style={{ display: 'block', marginBottom: 8 }}>
          <input
            type="checkbox"
            checked={config.sites.laravel}
            onChange={e => void handleSiteChange('laravel' as SupportedSite, e.target.checked)}
          />
          laravel.com
        </label>
        <label style={{ display: 'block' }}>
          <input
            type="checkbox"
            checked={config.sites.readouble}
            onChange={e => void handleSiteChange('readouble' as SupportedSite, e.target.checked)}
          />
          readouble.com
        </label>
      </div>
    </div>
  )
}

export default App
