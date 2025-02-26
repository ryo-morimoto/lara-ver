import { useState, useEffect } from 'react';
import './App.css';

// Laravel versions
const LARAVEL_VERSIONS = [
  { value: '12.x', label: '12.x' },
  { value: '11.x', label: '11.x' },
  { value: '10.x', label: '10.x' },
  { value: '9.x', label: '9.x' },
  { value: '8.x', label: '8.x' },
  { value: '7.x', label: '7.x' },
  { value: '6.x', label: '6.x' },
  { value: '5.8', label: '5.8' },
  { value: '5.7', label: '5.7' },
  { value: '5.6', label: '5.6' },
  { value: '5.5', label: '5.5' },
  { value: '5.4', label: '5.4' },
  { value: '5.3', label: '5.3' },
  { value: '5.2', label: '5.2' },
  { value: '5.1', label: '5.1' },
  { value: '5.0', label: '5.0' },
  { value: '4.2', label: '4.2' },
];

function App() {
  const [currentVersion, setCurrentVersion] = useState<string>('10.x');
  const [savedMessage, setSavedMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Load saved version on component mount
  useEffect(() => {
    const loadSavedVersion = async () => {
      try {
        const { preferredVersion } = await browser.storage.sync.get('preferredVersion');
        if (preferredVersion) {
          setCurrentVersion(preferredVersion);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading saved version:', error);
        setLoading(false);
      }
    };

    loadSavedVersion();
  }, []);

  const handleVersionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentVersion(e.target.value);
  };

  const saveVersion = async () => {
    try {
      await browser.runtime.sendMessage({
        action: 'setPreferredVersion',
        version: currentVersion
      });
      
      setSavedMessage('設定を保存しました');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (error) {
      console.error('Error saving version:', error);
      setSavedMessage('エラーが発生しました');
      setTimeout(() => setSavedMessage(''), 3000);
    }
  };

  if (loading) {
    return <div className="loading">読み込み中...</div>;
  }

  return (
    <div className="lara-ver-container">
      <h1>Lara Ver</h1>
      <div className="description">
        Laravel ドキュメントのバージョンを固定します
      </div>

      <div className="version-selector">
        <label htmlFor="version-select">デフォルトバージョン:</label>
        <select 
          id="version-select"
          value={currentVersion}
          onChange={handleVersionChange}
        >
          {LARAVEL_VERSIONS.map(version => (
            <option key={version.value} value={version.value}>
              {version.label}
            </option>
          ))}
        </select>
      </div>

      <div className="actions">
        <button onClick={saveVersion}>保存</button>
      </div>

      {savedMessage && (
        <div className="message">{savedMessage}</div>
      )}

      <div className="footer">
        <p>Laravel ドキュメントを開くと自動的に選択したバージョンに切り替わります</p>
      </div>
    </div>
  );
}

export default App;