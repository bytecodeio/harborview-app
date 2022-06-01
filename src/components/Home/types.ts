import { AnyAaaaRecord } from "dns";
import { Dashboard, ConfigurationData, User } from "../../types";

export interface HomeProps {
  configurationData: ConfigurationData
  updateConfigurationData(
    configurationData: ConfigurationData
  ): Promise<boolean>
  isAdmin: boolean
  userData:User
}
