export type IClientState = {
  status: string;
  clients: IClient[];
};

export type IClient = {
  id: number;
  name: string;
  organization: number;
  inn: string | null;
  kpp: string | null;
  mail_address: string | null;
  jur_address: string | null;
  created_at: string;
  created_by: number;
};

export type PatchClientType = {
  name?: string;
  inn?: string;
  kpp?: string;
  mail_address?: string;
  jur_address?: string;
};

export type PostClientType = {
  name: string;
  inn: string;
  kpp: string;
  mail_address: string;
  jur_address: string;
};
