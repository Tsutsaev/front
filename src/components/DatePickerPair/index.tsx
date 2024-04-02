import React, {useState, MouseEvent, useCallback} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './index.module.scss';
import {endOfMonth, endOfWeek, startOfMonth, startOfWeek, subDays, subMonths} from 'date-fns';
import {ru} from 'date-fns/locale';
import {DateTimePickerProps} from './types';
import DropdownAction from 'components/new/Dropdown/Action';
import Button from 'components/new/Button';

const formatDate = (date: Date | null) => {
  if (!date) return 'Дата не выбрана';
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear().toString().slice(-2);
  return `${day}.${month}.${year}`;
};

const DatePickerPair = ({selectedDate, setSelectedDate}: DateTimePickerProps) => {
  const [isDropdownShown, setIsDropdownShown] = useState(false);
  const [isArbitrary, setIsArbitrary] = useState(false);
  const [firstDate, setFirstDate] = useState<Date | null>(null);
  const [secondDate, setSecondDate] = useState<Date | null>(new Date());
  const toggleDropdown = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsDropdownShown(prev => !prev);
    setIsArbitrary(false);
  };

  const setToday = useCallback(() => {
    const today = new Date();
    setSelectedDate([today, today]);
  }, []);

  const setYesterday = useCallback(() => {
    const yesterday = subDays(new Date(), 1);
    setSelectedDate([yesterday, yesterday]);
  }, []);

  const setCurrentWeek = useCallback(() => {
    const today = new Date();
    const startOfWeekDate = startOfWeek(today, {weekStartsOn: 1});
    const endOfWeekDate = endOfWeek(today, {weekStartsOn: 1});
    setSelectedDate([startOfWeekDate, endOfWeekDate]);
  }, []);

  const setPreviousWeek = useCallback(() => {
    const today = new Date();
    const start = startOfWeek(subDays(today, 7), {weekStartsOn: 1});
    const end = endOfWeek(subDays(today, 7), {weekStartsOn: 1});

    setSelectedDate([start, end]);
  }, []);

  const setCurrentMonth = useCallback(() => {
    const today = new Date();
    const start = startOfMonth(today);
    const end = endOfMonth(today);

    setSelectedDate([start, end]);
  }, []);

  const setPreviousMonth = useCallback(() => {
    const today = new Date();
    const start = startOfMonth(subMonths(today, 1));
    const end = endOfMonth(subMonths(today, 1));
    setSelectedDate([start, end]);
  }, []);

  const handleApply = useCallback(() => {
    setSelectedDate([firstDate, secondDate]);
    setIsArbitrary(false);
  }, [firstDate, secondDate]);

  const handleCancel = useCallback(() => {
    setIsArbitrary(false);
  }, []);

  const buttonsPeriod = [
    {
      title: 'Сегодня',
      onClick: setToday,
    },
    {
      title: 'Вчера',
      onClick: setYesterday,
    },
    {
      title: 'Предыд. Неделя',
      onClick: setPreviousWeek,
    },
    {
      title: 'Тек. Неделя',
      onClick: setCurrentWeek,
    },
    {
      title: 'Пред. Месяц',
      onClick: setPreviousMonth,
    },
    {
      title: 'Тек. Месяц',
      onClick: setCurrentMonth,
    },
    {
      title: 'Произвольно',
      onClick: () => {
        setIsArbitrary(true);
      },
    },
  ];

  return (
    <div className={styles.container}>
      <button
        onClick={e => toggleDropdown(e)}
        className={`${styles.button} ${
          !selectedDate[0] || !selectedDate[1] ? styles.placeholder : ''
        }`}>
        {selectedDate[0] && selectedDate[1]
          ? `${formatDate(selectedDate[0])} - ${formatDate(selectedDate[1])}`
          : 'Выберите период'}
      </button>
      {isDropdownShown && (
        <DropdownAction active={'1'} setIsOpen={setIsDropdownShown} buttons={buttonsPeriod} />
      )}
      <div className={styles.arbitrary}>
        {isArbitrary && (
          <div className={styles.calendar__wrapper}>
            <div className={styles.calendar}>
              <div className={styles.column}>
                <p className={styles.name}>Дата начала</p>
                <DatePicker
                  selected={firstDate}
                  onChange={setFirstDate}
                  dateFormat="dd.MM.yyyy"
                  placeholderText="Выберите дату"
                  shouldCloseOnSelect={false}
                  inline
                  locale={ru}
                />
              </div>
              <div className={styles.column}>
                <p className={styles.name}>Дата окончания</p>

                <DatePicker
                  selected={secondDate}
                  onChange={setSecondDate}
                  dateFormat="dd.MM.yyyy"
                  placeholderText="Выберите дату"
                  shouldCloseOnSelect={false}
                  inline
                  locale={ru}
                />
              </div>
            </div>
            <div className={styles.apply}>
              <Button type="submit" onClick={handleCancel}>
                Отмена
              </Button>
              <Button type="submit" onClick={handleApply}>
                Применить
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatePickerPair;
