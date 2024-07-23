import './LogoStyles.css'
import {
  Box,
  Button,
  Divider,
  FieldCheckbox,
  FieldText,
  Form,
  Heading,
  IconButton,
  MenuItem,
  MenuItemProps,
  MenuList,
  Space,
  theme,
  ValidationMessages,
  Tree,
  TreeItem,
  ButtonTransparent,
  ButtonItem,
  ButtonToggle,
  Accordion,
  AccordionDisclosure,
  AccordionContent,
  DialogManager,
  DialogContent
} from '@looker/components'
import {
  ExtensionContext,
  ExtensionContextData,
} from '@looker/extension-sdk-react'
import { LookerLogo } from '@looker/icons'
import React, { useContext, useEffect, useState } from 'react'
import { render } from 'react-dom'
import styled from 'styled-components'

import { ConfigurationData, Dashboard, Folder } from '../../types'
import { DashboardNavigationProps } from './types'
import { MenuFold, MenuUnfold, OpenArm } from "@styled-icons/remix-fill"
import { folder } from '@looker/sdk/lib/3.1/funcs'
import { Configure } from '../Configure/Configure'
import {Grid} from '@styled-icons/bootstrap'
import { Icon, Backdrop, CircularProgress } from '@material-ui/core'
import {  KeyboardArrowLeft, KeyboardArrowRight, Menu } from '@styled-icons/material-outlined'
import {Add} from '@styled-icons/material-outlined'
import logo from '../../static/logo.png';
import { Logo } from '../Images/Logo'

// import { Icon-outlined } from '@styled-icons/material-outlined'


export const DashboardNavigation: React.FC<DashboardNavigationProps> = ({
  configurationData,
  updateConfigurationData,
  setSelectedDash,
  selectedDash,
  isAdmin
}) => {

  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const { extensionSDK } = extensionContext
  const sdk = extensionContext.core40SDK

  

  
  const [menuOpen, isMenuOpen] = React.useState<boolean>(true)

  const [folderConfiguration, setFolderConfiguration] = useState<Folder[]>(configurationData.folders)
  const [activeFolder, setActiveFolder] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  console.log("menuOpen",menuOpen);

  //const [folders,setFolders] = useState<Folder[]>()

  useEffect(() => {
    const initialize = () => {
      if (folderConfiguration?.length > 0){
        folderConfiguration.map(f => configurationData.navigationToggle?f.open=true:f.open=false);
        folderConfiguration.map(folder => {
            sdk.folder_dashboards(folder.id)
                .then(dashboards => {
                  console.log(folderConfiguration);
                  //console.log(folderConfiguration[i]);
                  folder.dashboards = [];
                    console.log("dashboards",dashboards);
                    for(var d = 0; d < dashboards.value.length; d++){
                      var dash:Dashboard = {
                        id:dashboards.value[d]['id'],
                        title:dashboards.value[d]['title'],
                        next:true
                      }
                      folder.dashboards.push(dash);
                    }
                })
              })   
      } else {
        
      }
      setTimeout(function(){
        setIsLoading(false);
      }, 3000)
    }
    setIsLoading(true);
    initialize();
    
    
  },[])


  function handleToggle(id, open, index): void {
    if (id === -1) {  // if Overview button pressed, close all others
      folderConfiguration.map(f => f.open = false)
    } else {
      if (!configurationData.navigationToggle) {
        folderConfiguration.map(f => f.open = false)
      }
      //setActiveFolder("");
      if (!open) {
        //setActiveFolder(id);
        folderConfiguration[index].open = true
      } else {
        if (configurationData.navigationToggle) {
          folderConfiguration[index].open = false
        }
      }
    }
    setFolderConfiguration([...folderConfiguration])
  }

  function selectDash(id){
    let match = folderConfiguration.filter((folder) => {
      var dashMatch:boolean = false;
      folder.dashboards.map((d) => {
        if (d.id === id){
          dashMatch = true;
        }
      })
      if (dashMatch){
        return true;
      } 
    })
    console.log("match",match);
    if (match.length > 0){
      setActiveFolder(match[0].id);
    }    else {
      setActiveFolder("");
    }
    setSelectedDash(id);
  }

  function handleCollapse() {
    isMenuOpen(!menuOpen)
  }

  const sendToLanding = () => {
    setSelectedDash("0");
  }


  return (
    <>    
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />

    <div className={menuOpen?"embed-dashboard-left collapse":"embed-dashboard-left"}>  
    <Backdrop open={isLoading} className="backdrop">
      <CircularProgress color="inherit" />
    </Backdrop>
          <Space className="collapse-button-container dashboard-nav-item">
            <div className={menuOpen?'logo collapse':'logo'} onClick={sendToLanding}>
            <h4>HITS<sup>TM</sup></h4>
            </div>      
            <Button className="custom-button collapse-button"  onClick={() => handleCollapse()}>
            <Menu />
            </Button>
          </Space>  
        {folderConfiguration != undefined && 
        <div className={menuOpen?"dashboard-nav-items collapse": "dashboard-nav-items"}>
          {configurationData.landingDashboard &&
            configurationData.landingDashboard.id != "" &&
            <div className="dashboard-nav-item">
              <Button className={selectedDash == configurationData.landingDashboard.id?"nav-header landing active":"nav-header landing"} onClick={
                  () => {selectDash(configurationData.landingDashboard.id);
                handleToggle(-1, null, null);}
              }>
                {configurationData.landingDashboard.icon &&
                  <Icon className="custom-nav-icon">{configurationData.landingDashboard.icon}</Icon>
                }                
                <h4 className="nav-header-label">
                  {configurationData.landingDashboard.title}
                </h4>  
              </Button>    
            </div> 
            }       
          {folderConfiguration.map(
          ({id, title, dashboards,open, icon}, index) => {
          return(
            <>
            {dashboards?.length >0 &&
            
            <div id={id} className="dashboard-nav-item" key={id}>                                
              <Accordion indicatorIcons={{open:"ArrowDropUp", close:'ArrowDropDown'}} indicatorPosition="right" isOpen={open} toggleOpen={() => handleToggle( id , open , index)}   key={id}>
                  <AccordionDisclosure className={activeFolder == id?"nav-header active landing active":"nav-header landing"}>
                    <Space>
                      {icon &&
                        <Icon className="custom-nav-icon">{icon}</Icon>
                      }
                      <span>{title}</span>
                    </Space>
                  </AccordionDisclosure>
                  <AccordionContent className="nav-content">
                    {dashboards != undefined &&
                      dashboards.map((i) => {
                          return (
                              <ul className={selectedDash==i.id?"nav-label active":"nav-label"} key={i.id} id={i.id} onClick={() => selectDash(i.id)}> {i.title.replace(title,"").trim()}</ul>
                          )
                      })}
                  </AccordionContent>
              </Accordion>
                    
            </div>
            
            }
            </>
            )            
        })} 
        </div>
        
      }
        <div className="bottom-section">
          {isAdmin ? (
              <div className={menuOpen?"dashboard-nav-items collapse": "dashboard-nav-items"}>
                <DialogManager
                  content={
                    <DialogContent>
                      <Configure
                        configurationData={configurationData}
                        updateConfigurationData={updateConfigurationData}
                      />
                    </DialogContent>
                  }
                >
                  <div className="dashboard-nav-item static-nav-item">
                    <Button className="nav-header  landing">
                      <Icon className="custom-nav-icon">settings</Icon>
                      <h4 className="nav-header-label">
                        Admin
                      </h4>  
                    </Button>    
                  </div>
                </DialogManager>
              </div>
            ) : (
              ''
            )} 
        </div>
      </div>   
    </>
  )
}






