import {useEffect} from 'react';
import {ISheets} from 'store/sheet/types';

const UseFiltersSheet = (
  filtersSheets: ISheets[],
  setFiltersSheets: (sheets: ISheets[]) => void,
  project: string | null,
  client: string | null,
  isFilled: string | null,
) => {
  useEffect(() => {
    const newSheets = filtersSheets.filter(
      sheet =>
        (!project || sheet.project?.id === Number(project)) &&
        (!client || sheet.project?.client_id === Number(client)) &&
        (!isFilled || Boolean(sheet.description) === Boolean(Number(isFilled))),
    );

    setFiltersSheets(newSheets);
  }, [project, client, isFilled, filtersSheets]);
};

export default UseFiltersSheet;
