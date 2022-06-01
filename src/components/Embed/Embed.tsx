import {
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  DialogManager,
  DialogContent,
  Button,
  Flex,
  FlexItem,
  IconButton, Heading, SpaceVertical, MessageBar, Paragraph, Space
} from '@looker/components'
import { LookerEmbedDashboard } from '@looker/embed-sdk'
import {
  ExtensionContext,
  ExtensionContextData,
} from '@looker/extension-sdk-react'
import React, { useCallback, useContext, useEffect } from 'react'
import styled, { css } from 'styled-components'

import { Dashboard } from './Dashboard'
import { EmbedProps } from './types'
import { Configure } from '../Configure/Configure'
import { ConfigurationData } from '../../types'
import _ from 'lodash'
import { LookerDashboardOptions } from '@looker/embed-sdk/lib/types'
import { IDashboardElement, IRequestSearchDashboardElements } from '@looker/sdk/lib/3.1/models'
import { IWriteDashboardElement } from '@looker/sdk/lib/3.1/models'
import { Search } from '@styled-icons/boxicons-regular'
import queryString from 'query-string'

export const Embed: React.FC<EmbedProps> = ({
  configurationData,
  updateConfigurationData,
  selectedDash,
  handleUpdateFilters,
  filters
}) => {
  const [dashboardNext, setDashboardNext] = React.useState(true)
  const [running, setRunning] = React.useState(true)
  const [dashboard, setDashboard] = React.useState<LookerEmbedDashboard>()
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  
  //const [filters, setFilters] = React.useState({})
  const [properties, setProperties] = React.useState<any>({})
  const [tilesToHide, setTilesToHide] = React.useState<Array<number>>([])
  const { extensionSDK } = extensionContext
  const sdk = extensionContext.core40SDK

  useEffect(() => {
    console.log(properties);
  },[properties])


 

  const StyledTab = styled(Tab as any)`
    border-bottom-color: transparent;
    margin-top: 2em;
    margin-bottom: 0;
    padding-bottom: 1em;
    padding-left: 2em;
    padding-right: 2em;
    ${(props) =>
      props.hover &&
      props.selected &&
      css`
        border-bottom-color: transparent;
        background-color: white;
      `}
    ${(props) =>
      props.selected &&
      css`
        background-color: white;
        border-bottom-color: transparent;
        border-top: 5px solid;
        border-top-color: #6c43e0;
        border-right: 1px solid;
        border-right-color: #e1e1e1;
        border-left: 1px solid;
        border-left-color: #e1e1e1;
      `}
    ${(props) =>
      props.hover &&
      css`
        border-bottom-color: transparent;
      `}
  `

  const toggleDashboard = () => {
    setDashboardNext(!dashboardNext)
  }

  const canceller = (event: any) => {
    return { cancel: !event.modal }
  }

  const updateRunButton = (running: boolean) => {
    setRunning(running)
  }

  const setupDashboard = (dashboard: LookerEmbedDashboard) => {
    setDashboard(dashboard)
  }

  const isTabSelected = (index: number) => {
    return selectedDash == index ? true : false
  }


  const handleUpdateDashboardProperties = (properties: React.SetStateAction<{}>) => {
    setProperties(properties);
  };

  return (
    <>
      <Dashboard
        id={selectedDash}
        running={running}
        theme={configurationData.theme}
        next={true}
        extensionContext={extensionContext}
        setDashboard={setupDashboard}
        filters={filters}
        handleUpdateFilters={handleUpdateFilters}
        handleUpdateDashboardProperties={handleUpdateDashboardProperties}
      />
    </>
  )
}
