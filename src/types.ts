export interface TabbedDashProps {
  route: string
  routeState?: any
}

export interface ConfigurationData {
  theme: string
  folders:Folder[]
  landingDashboard:LandingDashboard
  navigationToggle:boolean
}

export interface Dashboard {
  id: string
  title: string
  next: boolean
}

export interface Folder {
  icon:string
  id: string
  title:string
  dashboards: Dashboard[] 
  open:boolean
}

export interface User {
  first_name:string
  last_name:string
  email:string
  embed_group_space_id:string
}

export interface LandingDashboard {
  icon:string
  id:string
  title:string
}
