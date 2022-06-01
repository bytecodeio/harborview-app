import { AnyAaaaRecord } from "dns";
import { Dashboard, ConfigurationData, User } from "../../types";

export interface DashboardNavigationProps {
  configurationData: ConfigurationData
  updateConfigurationData(
    configurationData: ConfigurationData
  ): Promise<boolean>
  setSelectedDash:any
  selectedDash:string
  isAdmin:boolean
}
