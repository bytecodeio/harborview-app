import {
  Box,
  Button,
  Divider,
  FieldCheckbox,
  FieldText,
  Form,
  Heading,
  IconButton,
  Label,
  RadioGroup,
  Space,
  theme,
  ToggleSwitch,
  ValidationMessages,
} from '@looker/components'
import {
  ExtensionContext,
  ExtensionContextData,
} from '@looker/extension-sdk-react'
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'

import { ConfigurationData, Dashboard, Folder } from '../../types'
import { ConfigureProps } from './types'

import { isInteger } from 'lodash'
import { resolve6 } from 'dns'

import { ArrowRight } from '@styled-icons/evaicons-solid'

const SaveDashboardButton = styled(Button as any)`
border-color: ${(props) => props.theme.colors.positive};
background-color: ${(props) => props.theme.colors.positive};
`


export const Configure: React.FC<ConfigureProps> = ({
  configurationData,
  updateConfigurationData,
}) => {
  const [localConfigurationData, setLocalConfigurationData] = useState<
    ConfigurationData
  >({
    theme: '',
    folders:[
      {
        id:'', title:'', icon:''
      }
    ],
    landingDashboard:{
      id:'', title:'',icon:''
    },
    navigationToggle:false
  } as ConfigurationData)
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const { extensionSDK } = extensionContext
  const sdk = extensionContext.core40SDK

  const [dragId, setDragId] = useState<number>(null);

  const handleSortClick = (index,ev) => {
    console.log(index);
      if (dragId != null){
        if (dragId===index){
          setDragId(null)
        } else {
          const dragFolder = localConfigurationData.folders[dragId];
          const dropFolder = localConfigurationData.folders[index];
      
          console.log(dragFolder);
          console.log(dropFolder);
         
          localConfigurationData.folders[index] = dragFolder;  
          localConfigurationData.folders[dragId] = dropFolder;
          setLocalConfigurationData({...localConfigurationData})
          setDragId(null);
        }
      } else {
        setDragId(index);
      }
  }


  useEffect(() => {
    const initialize = async () => {
      {
        try {
          const contextData = await extensionSDK.refreshContextData()
          if (contextData) {
            setLocalConfigurationData({
              ...localConfigurationData,
              ...(contextData as ConfigurationData),
            })
          }
        } catch (error) {
          console.error('failed to get latest context data', error)
        }
      }
    }
    setLocalConfigurationData({
      ...localConfigurationData,
      ...configurationData,
    })
    initialize()
  }, [])

  const validateValue = (value: string): number | string => {
    if (value.match(/\d+/g)) {
      return parseInt(value, 10)
    } else {
      return value
    }
  }

  const addFolder = () => {
    setLocalConfigurationData({
      theme: localConfigurationData.theme,
      folders: [
        ...localConfigurationData.folders,
        { id: '', title: '' } as Folder,
      ],
      landingDashboard:localConfigurationData.landingDashboard,
      navigationToggle:localConfigurationData.navigationToggle
    })
  }


  const deleteFolder = (index: number) => {
    const newConfiguration = { ...localConfigurationData }
    newConfiguration.folders.splice(index, 1)
    setLocalConfigurationData({ ...newConfiguration })
  }


  const changeFolderId = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    localConfigurationData.folders[index]['id'] = event.currentTarget.value
    setLocalConfigurationData({ ...localConfigurationData })
  }

  const changeFolderTitle = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    localConfigurationData.folders[index]['title'] =
      event.currentTarget.value
    setLocalConfigurationData({ ...localConfigurationData })
  }

  const changeFolderIcon = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    localConfigurationData.folders[index]['icon'] =
      event.currentTarget.value
    setLocalConfigurationData({ ...localConfigurationData })
  }



  const onConfigChangeSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    updateConfigurationData({ ...localConfigurationData })
  }

  const onConfigResetClick = () => {
    setLocalConfigurationData({ ...configurationData })
  }

  const changeTheme = (event: React.ChangeEvent<HTMLInputElement>) => {
    localConfigurationData.theme = event.currentTarget.value
    setLocalConfigurationData({ ...localConfigurationData })
  }

  const changeLandingPageId = (event: React.ChangeEvent<HTMLInputElement>) => {
    localConfigurationData.landingDashboard.id = event.currentTarget.value
    setLocalConfigurationData({ ...localConfigurationData })
  }

  const changeLandingPageTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    localConfigurationData.landingDashboard.title = event.currentTarget.value
    setLocalConfigurationData({ ...localConfigurationData })
  }

  const changeLandingIcon = (event: React.ChangeEvent<HTMLInputElement>) => {
    localConfigurationData.landingDashboard.icon = event.currentTarget.value
    setLocalConfigurationData({ ...localConfigurationData })
  }

  const toggleDefaultNavigation = (event: React.ChangeEvent<HTMLInputElement>) => {
    localConfigurationData.navigationToggle = !localConfigurationData.navigationToggle
    setLocalConfigurationData({ ...localConfigurationData })
  }


  return (
    <div>
      <Heading mt="xlarge">Dashboards Configuration</Heading>

      <Box m="large">
        <Form
          onSubmit={onConfigChangeSubmit}
        >
          <Divider mt="medium" appearance="onDark" />
          <Space>
            <Label htmlFor="switch">
              <Heading as="h3">Open Navigation by default</Heading>
              <ToggleSwitch
                on={localConfigurationData.navigationToggle}
                onChange={toggleDefaultNavigation}
              />
            </Label>
          </Space>

          <Divider mt="medium" appearance="onDark" />
          <Heading as="h3">Dashboard Theme</Heading>

          <FieldText
            value={localConfigurationData.theme}
            onChange={changeTheme}
          />

          <Divider mt="medium" appearance="onDark" />
          {/* <Heading as="h3">Dashboard Landing Page</Heading>

          <Space>
            <FieldText
              label="Dashboard ID"
              value={localConfigurationData.landingDashboard.id}
              onChange={changeLandingPageId}
            />
            <FieldText
              label="Dashboard Title"
              value={localConfigurationData.landingDashboard.title}
              onChange={changeLandingPageTitle}
            />
            <FieldText
              label="Icon Text"
              value={localConfigurationData.landingDashboard.icon}
              onChange={changeLandingIcon}
            />
            </Space>

          <Divider mt="medium" appearance="onDark" /> */}

          <Heading as="h3">Configure Folder Navigation</Heading>

           {localConfigurationData.folders.map(
            ({ id, title, icon}, index) => {
              return (
                <div key={`id + title + ${index+1}`} >
                  <Space className={dragId===index?"sortable-folder selected":"sortable-folder"}
                  onClick={(ev) => handleSortClick(index,ev)}>
                    <ArrowRight className='custom-icons' />
                    <FieldText
                      label="Folder ID"
                      value={id}
                      onChange={(e) =>
                        changeFolderId(
                          e as React.ChangeEvent<HTMLInputElement>,
                          index
                        )
                      }
                    />
                    <FieldText
                      label="Folder Title"
                      value={title}
                      onChange={(e) =>
                        changeFolderTitle(
                          e as React.ChangeEvent<HTMLInputElement>,
                          index
                        )
                      }
                    />
                    <IconButton
                      icon="Trash"
                      label="Delete Folder"
                      size="small"
                      color="critical"
                      onClick={() => deleteFolder(index)}
                    />
                  </Space>
                </div>
              )
            }
          )}

          <Space>
            <Button iconBefore="CircleAdd" onClick={() => addFolder()}>
              Add Folder
            </Button>
          </Space> 

          <Divider mt="medium" appearance="onDark" />

          <Space>
            <SaveDashboardButton>Save changes</SaveDashboardButton>
          </Space>
        </Form>
      </Box>
    </div>
  )
}
