type RestProfile = {
  id: string;
  email: string;
  fio: string;
  short_name: string;
  new_entry: string;
};

export type RestData = {
  id: number;
  organization: string;
  profile: RestProfile;
  date_from: string;
  date_to: string;
  agreed: boolean;
  created_at: string;
  created_by: string;
  tags: string[];
  profile_id: number;
};

export interface IRestListState {
  status: string;
  rest: RestData[];
}

export type PostRestData = {
  date_from: string;
  date_to: string;
  agreed: boolean;
  tags: string[];
  profile_id: number;
};
