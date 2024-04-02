export type ProfileType = {
  id: number;
  email: string | null;
  phone: string | null;
  fio: string;
  avatar: string;
  short_name: string | null;
  current_organization: number;
  is_staff: boolean;
  is_active: boolean;
  is_superuser: boolean;
  date_joined: string | null;
  last_login: string | null;
};

export type PatchProfileType = {
  email?: string;
  phone?: null | string;
  fio?: string;
};

export type PatchMyProfileType = {
  email?: string;
  phone?: null | string;
  fio?: string;
  avatar: string;
};
