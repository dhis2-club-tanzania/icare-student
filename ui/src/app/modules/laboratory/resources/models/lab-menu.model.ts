export interface LabMenu {
  name: string;
  route: string;
  icon?: string;
  id: string;
  subMenus?: LabMenu[];
}
