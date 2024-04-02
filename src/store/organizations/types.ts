export type IOrganizationListState = {
  status: string;
  organizations: IOrganization[];
};

export type IOrganization = {
  id: number;
  name: string;
  fill_mode: string;
  access_profile: boolean;
  access_client: boolean;
  access_project: boolean;
  access_rest: boolean;
  access_holiday: boolean;
  access_off: boolean;
  can_use_departments: boolean;
  inn: null | string;
  kpp: null | string;
  mail_address: null | string;
  jur_address: null | string;
  created_at: string;
  created_by: {
    id: number;
    email: string;
    fio: string;
    short_name: null | string;
    phone: string | null;
  };
  created_by_id: number;
  updated_at: string;
  is_template: boolean;
  tarif: number;
  is_trial: boolean;
  is_blocked: boolean;
  is_tarif_requested: boolean;
};

export type PatchOrganization = {
  is_template?: boolean;
  tarif?: number;
  name?: string;
  fill_mode?: string;
  inn?: null | string;
  kpp?: null | string;
  mail_address?: null | string;
  jur_address?: null | string;
  access_profile?: boolean;
  access_client?: boolean;
  access_project?: boolean;
  access_rest?: boolean;
  access_holiday?: boolean;
  access_off?: boolean;
  created_by_id?: number;
};

export type PatchOrgInfoType = {
  name?: string;
  fill_mode?: string;
  inn?: null | string;
  kpp?: null | string;
  mail_address?: null | string;
  jur_address?: null | string;
};

export type PatchOrgAccessType = {
  access_profile?: boolean;
  access_client?: boolean;
  access_project?: boolean;
  access_rest?: boolean;
  access_holiday?: boolean;
  access_off?: boolean;
};

export type PostOrganizations = {
  name: string;
  fill_mode: string;
  access_profile: boolean;
  access_client: boolean;
  access_project: boolean;
  access_rest: boolean;
  access_holiday: boolean;
  access_off: boolean;
  inn: null | string;
  kpp: null | string;
  mail_address: null | string;
  jur_address: null | string;
  tarif: number;
};
