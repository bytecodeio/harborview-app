import React, { useEffect, useState, useContext } from 'react'
import { Route, Redirect, Link, useParams } from 'react-router-dom'
import styled from 'styled-components'
import * as semver from 'semver'
import { Box, ComponentsProvider, DialogContent, DialogManager, IconButton, MessageBar } from '@looker/components'
import {
  ExtensionContext,
  ExtensionContextData,
} from '@looker/extension-sdk-react'
import { TabbedDashProps, ConfigurationData, User } from './types'
import { allowedNodeEnvironmentFlags } from 'process'
import { Configure } from './components/Configure/Configure'
import { Home } from './components/Home/Home'
import queryString from 'query-string'

export enum ROUTES {
  APP_HOME = '/',
  APP_HOME_PARAMS = '/:params',
  CONFIG_ROUTE = '/config',
}

export const Framework: React.FC<TabbedDashProps> = ({
  route,
  routeState,
}) => {
  const extensionContext = useContext<ExtensionContextData>(ExtensionContext)
  const { extensionSDK, initializeError } = extensionContext
  const sdk = extensionContext.core40SDK
  
  const [canPersistContextData, setCanPersistContextData] = useState<boolean>(
    false
  )
  const [configurationData, setConfigurationData] = useState<
    ConfigurationData
  >()
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false)
  const [userRoles, setUserRoles] = React.useState<string[]>()
  const [userData, setUserData] = React.useState<User>({
    first_name:'',
    last_name:'',
    email:'',
    embed_group_space_id:null
  });
  const [queryParams, setQueryParams] = React.useState<string>()

  useEffect(() => {
    const initialize = async () => {
      // Context requires Looker version 7.14.0. If not supported provide
      // default configuration object and disable saving of context data.
      let context
      if (
        semver.intersects(
          '>=7.14.0',
          extensionSDK.lookerHostData?.lookerVersion || '7.0.0',
          true
        )
      ) {
        try {
          context = await extensionSDK.getContextData()
          setCanPersistContextData(true)
        } catch (error) {
          console.error(error)
        }
      }
      setConfigurationData(
        context || {
          theme: 'Looker',
          dashboards: [ 
          ],
          configRoles: [ ''
          ],
          folders:[]
        }
      )
    }



    /**
     * Check user roles against Admin or Config Role membership
     */
    const checkAdmin = async () => {
      try {
        //const { configRoles = [] } = await extensionSDK.refreshContextData()

        /*  const allRoles = await sdk
          .ok(
            await sdk.all_roles({ fields: 'id, name' })
            .then((value) => {
              console.log("checkAdmin#3g", value);
              return value
            })
          )
*/
        const allRoles = await sdk
          .ok(sdk.all_roles({ fields: 'id, name' }))
          .then((value) => {
            return value
          })
        const { role_ids: userRoles } = await sdk.ok(sdk.me()).then((value) => {
          return value
        })

        console.log(userRoles);

        // Check if user has role Admin
        const { id: adminRoleId } =
          allRoles.find((role) => role.name === 'Admin') || {}
        // prefixed underscore to troubleshoot bug with isAdmin
        // const isAdmin = userRoles.includes(adminRoleId);
        const _isAdmin = userRoles.includes(adminRoleId);

        console.log(_isAdmin)

        // console.log("userRoles.includes(adminRoleId)", userRoles.includes(adminRoleId));
        // console.log("userRoles##: ", userRoles);

        // Check if user has any role in config roles.
        // Config roles are stored by name in context data and
        // needs Looker role id reference for follow-on comparison.
        // const config_roles_by_id = allRoles.filter((role) =>
        //   configRoles.includes(role.name)
        // )
        // const isConfigRole = userRoles.some((user_role: number) =>
        //   config_roles_by_id.find((config_role) => config_role.id === user_role)
        // )
        await setIsAdmin(_isAdmin);
      } catch (error) {
        //setIsAdmin(true)
        console.error(error)
      }
    }

    const getUser = () => {
      const fields = ['id'];
      sdk.me(fields)
      //sdk.me()
      .then(response => {
        if (response.ok){
          console.log(response.value);
          return response.value;
        } else {
          console.log("Cannot get user data");
        }
      })
      .then(value => {
        //const fields = ['first_name','last_name','email','embed_group_space_id'];
        //sdk.user(value['id'], fields)
        sdk.user(value['id'])
        .then(response => {
          console.log(response);
          var user:User = response.value
          setUserData(user);
        })
      })
    }

    initialize()
    checkAdmin()
    getUser()    
  }, [])

  const updateConfigurationData = async (
    configurationData: ConfigurationData
  ): Promise<boolean> => {
    setConfigurationData(configurationData)
    {
      try {
        await extensionSDK.saveContextData(configurationData)
        return true
      } catch (error) {
        console.log(error)
      }
    }
    return false
  }

  const configIconLocation = {
    position: 'absolute' as 'absolute',
    right: '1em',
    top: '0em',
    zIndex: 999,
  }

  return (
    <>
      {configurationData && (
        <ComponentsProvider>
          {initializeError ? (
            <MessageBar intent="critical">{initializeError}</MessageBar>
          ) : (
            <>
              <Route exact path={ROUTES.APP_HOME_PARAMS}>
                <Home
                  configurationData={configurationData}
                  updateConfigurationData={updateConfigurationData}
                  isAdmin={isAdmin}
                  userData={userData}
                  />
              </Route>
              <Route exact path={ROUTES.APP_HOME}>
                <Home
                configurationData={configurationData}
                updateConfigurationData={updateConfigurationData}
                isAdmin={isAdmin}
                userData={userData}
                />
              </Route>
            </>
          )}
        </ComponentsProvider>
      )}

    </>
  )
}

export const Layout = styled(Box as any)`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 200px auto;
  width: 100vw;
`
