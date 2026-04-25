import { useCallback, useState } from 'react'
import { CatalogScreen } from './screens/CatalogScreen'
import { ArScreen } from './screens/ArScreen'
import type { CatalogItem } from './types'
import './App.css'

type Screen = 'catalog' | 'ar'

function App() {
  const [screen, setScreen] = useState<Screen>('catalog')
  const [selected, setSelected] = useState<CatalogItem | null>(null)

  const handleSelect = useCallback((item: CatalogItem) => {
    setSelected(item)
    setScreen('ar')
  }, [])

  const handleExit = useCallback(() => {
    setScreen('catalog')
  }, [])

  if (screen === 'ar' && selected) {
    return <ArScreen item={selected} onExit={handleExit} />
  }

  return <CatalogScreen onSelect={handleSelect} />
}

export default App
