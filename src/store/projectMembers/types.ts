export type IProjMembersListState = {
  status: string;
  projMembers: ProjectMembers[];
};

export type ProjectMembers = {
  id: number;
  project: {
    id: number;
    name: string;
    color: string;
    client: {
      id: number;
      name: string;
    } | null;
    client_id: number | null;
  };
  profile: {
    id: number;
    email: string;
    fio: string;
    short_name: null | string;
    phone: string | null;
  };
  off: number | null;
  dur_all_time: number | null;
  date_out: string | null;
};

export type NewProjMemberData = {
  project_id: string;
  profile_id: number;
  off: string | null;
};
