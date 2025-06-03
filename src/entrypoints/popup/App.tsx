import type { RedirectConfig } from '../../schemas/config.schema'
import { useEffect, useState } from 'react'
import { storageService } from '../../services/storage-service'
import { AVAILABLE_VERSIONS } from '../../shared/constants'
import './App.css'

function App() {
  const [config, setConfig] = useState<RedirectConfig | null>(null)

  useEffect(() => {
    const loadConfig = async () => {
      const currentConfig = await storageService.getConfig()
      setConfig(currentConfig)
    }
    void loadConfig()
  }, [])

  const handleVersionChange = async (version: string) => {
    await storageService.updateConfig({ version: version as RedirectConfig['version'] })
    setConfig(prev => prev ? { ...prev, version: version as RedirectConfig['version'] } : null)
  }

  const handleEnabledChange = async (enabled: boolean) => {
    await storageService.updateConfig({ enabled })
    setConfig(prev => prev ? { ...prev, enabled } : null)
  }

  const handleSiteChange = async (site: 'laravel' | 'readouble', enabled: boolean) => {
    if (!config)
      return
    const newSites = { ...config.sites, [site]: enabled }
    await storageService.updateConfig({ sites: newSites })
    setConfig(prev => prev
      ? {
          ...prev,
          sites: { ...prev.sites, [site]: enabled },
        }
      : null)
  }

  if (!config) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ width: 300, padding: 16 }}>
      <h1>Lara Ver</h1>

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
            onChange={e => void handleSiteChange('laravel', e.target.checked)}
          />
          laravel.com
        </label>
        <label style={{ display: 'block' }}>
          <input
            type="checkbox"
            checked={config.sites.readouble}
            onChange={e => void handleSiteChange('readouble', e.target.checked)}
          />
          readouble.com
        </label>
      </div>
    </div>
  )
}

export default App
