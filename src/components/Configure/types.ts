import React from 'react'
import { ConfigurationData } from '../../types'

export interface ConfigureProps {
  configurationData: ConfigurationData
  updateConfigurationData(
    configurationData: ConfigurationData
  ): Promise<boolean>
}
