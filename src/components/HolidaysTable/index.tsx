import {formatISO} from 'date-fns';
import React, {useState, useEffect, memo, useCallback} from 'react';
import {connect} from 'react-redux';
import {IApiResponse, instance} from 'shared';
import {RootState} from 'store';
import {selectSearch} from 'store/filters/selectors';
import {selectCurrentOrgId, selectRole} from 'store/user/selectors';

import CustomDatePicker from 'components/new/DatePicker';
import Input from 'components/new/Input';
import Table from 'components/new/Table';
import TableHeader from 'components/new/Table/Header';
import TableRow from 'components/new/Table/Row';

import {ReactComponent as IconDate} from 'shared/assets/images/fi-rr-calendar.svg';
import {ReactComponent as IconCheck} from 'shared/assets/images/fi-rr-checkbox.svg';

import styles from './index.module.scss';
import HolidaysItem from './Item';
import {IHoliday, Props} from './types';

const templateColumns = '125px minmax(125px, 1fr) 100px';

const HolidaysTable = ({userRole, currentOrgId, search, addingLine, setAddingLine}: Props) => {
  const [valueTextArea, setTextArea] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [holidays, setHolidays] = useState<IHoliday[]>([]);
  const [filteredHolidays, setFilteredHolidays] = useState(holidays);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await instance.get<IApiResponse<IHoliday>>(`/${currentOrgId}/holiday/`);
        setHolidays(response.data.results);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    }

    void fetchData();
  }, []);

  useEffect(() => {
    const lowercaseSearch = search.toLowerCase();

    if (lowercaseSearch.trim() === '') {
      setFilteredHolidays(holidays);
    } else {
      const filteredHolidays = holidays.filter(holiday =>
        [holiday.description].some(field => field && field.toLowerCase().includes(lowercaseSearch)),
      );
      setFilteredHolidays(filteredHolidays);
    }
  }, [search, holidays]);

  const addRow = useCallback(async () => {
    if (selectedDate) {
      const data = {
        date_at: formatISO(selectedDate).split('T')[0],
        description: valueTextArea,
      };

      try {
        const response = await instance.post<IHoliday>(`/${currentOrgId}/holiday/`, data);
        setHolidays([...holidays, response.data]);
        setAddingLine(false);
        setTextArea('');
        setSelectedDate(new Date());
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    }
  }, [selectedDate, valueTextArea, currentOrgId, holidays, setHolidays, setAddingLine]);

  const removeHoliday = useCallback(
    async (holidayId: number) => {
      try {
        await instance.delete(`/${currentOrgId}/holiday/${holidayId}/`);
        setHolidays(prevHolidays => prevHolidays.filter(holiday => holiday.id !== holidayId));
      } catch (error) {
        console.error('Ошибка при удалении данных:', error);
      }
    },
    [currentOrgId],
  );

  if (!currentOrgId) return null;
  return (
    <Table>
      <TableHeader
        titles={[{icon: <IconDate />}, {title: 'Название'}]}
        templateColumns={templateColumns}
      />
      {userRole === 'manager' && addingLine && (
        <TableRow color={'white'} templateColumns={templateColumns}>
          <CustomDatePicker
            isArbitrary
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          <Input
            placeholder="Введите название праздника"
            value={valueTextArea}
            onChange={setTextArea}
          />

          <div className={styles.button_container}>
            <button onClick={addRow} className={styles.edit}>
              {<IconCheck />}
            </button>
          </div>
        </TableRow>
      )}

      {filteredHolidays.map((holiday, index) => {
        return (
          <HolidaysItem
            key={holiday.id}
            holiday={holiday}
            onRemove={removeHoliday}
            templateColumns={templateColumns}
            color={index % 2 === 0 ? 'gray' : 'white'}
          />
        );
      })}
    </Table>
  );
};

const mapStateToProps = (state: RootState) => ({
  userRole: selectRole(state),
  currentOrgId: selectCurrentOrgId(state),
  search: selectSearch(state),
});

export default connect(mapStateToProps)(memo(HolidaysTable));
