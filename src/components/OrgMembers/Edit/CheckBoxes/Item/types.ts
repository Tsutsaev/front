export type EditOrgMembersCheckBoxesItemProps = {
  title: string;
  access: Access;
  setAccess: (access: Access) => void;
  field: keyof Access;
};

export type Access = {
  sheet_off: boolean | undefined;
  off_other: boolean | undefined;
  fired: boolean | undefined;
  fulltime: boolean | undefined;
};
