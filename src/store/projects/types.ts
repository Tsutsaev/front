import {Department} from 'store/department/types';

export type IProjectListState = {
  status: string;
  projects: IProjectState[];
};

export type IProjectState = {
  id: number;
  name: string;
  organization: number;
  client: {
    id: number;
    name: string;
  } | null;
  client_id: number | null;
  date_start: string;
  date_end: string | null;
  budget: number | null;
  color: string;
  tags: string[];
  department_id: number | null;
  department: Department | null;
  created_at: string;
  created_by: number;
};

export type PatchProjectInfoType = {
  name: string;
  client_id: number | null;
  date_start: string;
  date_end: string | null;
  budget: number | null;
  tags: string[];
  department_id: string;
};

export type CreateProjectData = Omit<
  IProjectState,
  'client' | 'id' | 'organization' | 'created_at' | 'created_by' | 'department' | 'color'
>;
