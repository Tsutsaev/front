export interface IVisibilityToggleCheckBoxProps<T> {
  title: string;
  visibility: T;
  setVisibility: (visibility: T) => void;
  field: keyof VisibilityType | keyof VisibilityOrgType;
}

export type VisibilityType = {
  sheet_off: boolean;
  off_other: boolean;
  fired: boolean;
  fulltime: boolean;
};

export type VisibilityOrgType = {
  access_profile: boolean;
  access_client: boolean;
  access_project: boolean;
  access_rest: boolean;
  access_holiday: boolean;
  access_off: boolean;
  can_use_departments: boolean;
};
