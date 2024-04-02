export type ITag = {
  id: number;
  name: string;
  slug: string;
};

export type IPatchTag = {
  name: string;
};

export type IPostTag = {
  name: string;
};

export type StateProps = {
  currentOrgId: number | null;
  search: string;
};
