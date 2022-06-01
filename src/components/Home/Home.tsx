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

import { HomeProps } from './types'
import { Configure } from '../Configure/Configure'
import { ConfigurationData } from '../../types'
import _ from 'lodash'
import { LookerDashboardOptions } from '@looker/embed-sdk/lib/types'
import { IDashboardElement, IRequestSearchDashboardElements } from '@looker/sdk/lib/3.1/models'
import { IWriteDashboardElement } from '@looker/sdk/lib/3.1/models'
import { DashboardNavigation } from '../DashboardNavigation/DashboardNavigation'
import { Embed } from '../Embed/Embed'
import { useParams } from 'react-router'
import symbol from '../../static/ma-symbol.png'
import { BackgroundImage } from '../Images/BackgroundImage'

export const Home: React.FC<HomeProps> = ({
  configurationData,
  updateConfigurationData,
  isAdmin,
  userData
}) => {
  const [dashboardNext, setDashboardNext] = React.useState(true)
  const [running, setRunning] = React.useState(true)
  const [dashboard, setDashboard] = React.useState<LookerEmbedDashboard>()
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const [selectedDash, setSelectedDash] = React.useState("0")
  const [filters, setFilters] = React.useState({})
  const [properties, setProperties] = React.useState<any>({})
  const [tilesToHide, setTilesToHide] = React.useState<Array<number>>([])
  const { extensionSDK } = extensionContext
  const sdk = extensionContext.core40SDK
  let params = useParams();



  useEffect(() => {
    // if (configurationData.landingDashboard){
    //   setSelectedDash(parseInt(configurationData.landingDashboard.id.toString()));
    // } 
  },[])


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

  const handleSelectedDash = (index: string) => {
    setSelectedDash(index)
  }

  const isDashSelected = (index: string) => {
    return selectedDash == index ? true : false
  }

  const handleUpdateFilters = (filters: React.SetStateAction<{}>) => {
    setFilters(filters);
  };

  const handleUpdateDashboardProperties = (properties: React.SetStateAction<{}>) => {
    setProperties(properties);
  };

  return (
    <>
    <Box>
      <Space>
        <DashboardNavigation
          configurationData={configurationData}
          updateConfigurationData={updateConfigurationData}
          setSelectedDash={handleSelectedDash}
          selectedDash={selectedDash}
          isAdmin={isAdmin}
          handleUpdateFilters={handleUpdateFilters}
        />
        <div className="embed-dashboard-right">
          <Space className="app-bar">
            <h4>FRAMEWORK APP</h4>
          </Space>
          {selectedDash !== "0" ? 
            (            
              <Embed
              configurationData={configurationData}
              updateConfigurationData={updateConfigurationData}
              selectedDash={selectedDash}
              handleUpdateFilters={handleUpdateFilters}
              filters={filters}
              />
            )                 
            :          
            (
              <div className='main-content-container'>
                  <BackgroundImage />
              </div>
            )
          }
        </div>
      </Space>
      </Box>    
    </>
  )
}
