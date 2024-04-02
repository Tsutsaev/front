export type ISheetListState = {
  status: string;
  sheets: ISheets[];
};

export type ISheets = {
  id: number;
  organization: number;
  project: null | ISheetProject;
  start_at: string;
  end_at: string;
  description: string;
  off: null | number;
  tags: string[];
  duration: string;
  source: number;
  created_at: string;
  created_by: number;
  bitrix_id: null | number;
  is_payble: boolean;
};

type ISheetProject = {
  id: number;
  name: string;
  color: string;
  client: {
    id: number;
    name: string;
  };
  client_id: number;
};

export type IPostSheetType = {
  organization: number | null;
  project_id: null | number;
  start_at: string;
  end_at: string;
  description: string | null;
  duration: string;
  off?: number | null;
  tags: string[];
  is_payble?: boolean;
  created_by?: number;
  created_by_manager?: number;
};

export type IPatchSheetType = {
  project_id: null | number;
  description: string | null;
  duration: string;
  off?: number | null;
  start_at?: string;
  end_at?: string;
  is_payble?: boolean;
};

export type IData = {
  [key: string]: string | number | null;
};
