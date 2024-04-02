export type IFiltersState = {
  memberType: null | string;
  fillingType: null | string;
  orgMember: null | string;
  project: null | string;
  isFilled: null | string;
  client: null | string;
  search: string;
  isFired: boolean | null;
  isSheetOff: string | null;
  department: string | null;

  isActive: boolean;
  isFills: boolean;
};

export type FiltersStateProps = {
  date?: [Date | null, Date | null];
  memberType?: null | string;
  fillingType?: null | string;
  orgMember?: null | string;
  project?: null | string;
  isFilled?: null | string;
  client?: null | string;
  search?: string;
  isFired?: boolean | null;
  isSheetOff?: string | null;
  department?: string | null;
  isActive?: boolean;
  isFills?: boolean;
};
