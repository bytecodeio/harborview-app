import { AnyAaaaRecord } from "dns";
import { Dashboard, ConfigurationData } from "../../types";

export interface EmbedProps {
  configurationData: ConfigurationData
  updateConfigurationData(
    configurationData: ConfigurationData
  ): Promise<boolean>
  selectedDash:any
  handleUpdateFilters:any
  filters:any
}
