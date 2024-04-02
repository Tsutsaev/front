export type SummaryReportType = {
  employees: {
    people_join: number;
    people_fired: number;
    people_active: number;
    people_sheets: number;
  };
  sheet: {
    hours_sheeted: number;
    hours_free_sheeted: number;
    hours_not_sheeted: number;
    days_in_rest: number;
  };
  clients: {
    active_clients: number;
    new_clients: number;
    all_clients: number;
  };
  projects: {
    active_projects: number;
    all_projects: number;
    new_projects: number;
    closed_projects: number;
    average_hours: number;
  };
  money: {
    sheeted_money: number;
    average_off: number;
    average_project_cost: number;
  };
};

type StateProps = {
  currentOrgId: number | null;
};

export type Props = StateProps;
