import React, { useState } from 'react'
import { Framework } from './Framework'
import { ExtensionProvider } from '@looker/extension-sdk-react'
import { hot } from 'react-hot-loader/root'
import './App.css'

export const App: React.FC<{}> = hot(() => {
  const [route, setRoute] = useState('')
  const [routeState, setRouteState] = useState()

  const onRouteChange = (route: string, routeState?: any) => {
    setRoute(route)
    setRouteState(routeState)
  }

  return (
    <ExtensionProvider onRouteChange={onRouteChange}>
      <Framework route={route} routeState={routeState} />
    </ExtensionProvider>
  )
})
