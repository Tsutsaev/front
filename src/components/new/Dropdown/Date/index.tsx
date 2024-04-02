import React, {useState, MouseEvent, useEffect, useRef, useCallback} from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './index.module.scss';

import {DateTimePickerProps} from './types';
import DatePickerPeriod from 'components/new/DatePickerPeriod';
import DropdownAction from 'components/new/Dropdown/Action';
import {formatDate} from 'utils/DateFormat';
import {ReactComponent as CrossIcon} from 'shared/assets/images/fi-rr-cross.svg';
import {getToday} from 'utils/DatePeriods/GetToday';
import {getYesterday} from 'utils/DatePeriods/GetYesterday';
import {getPreviousWeek} from 'utils/DatePeriods/GetPreviousWeek';
import {getCurrentWeek} from 'utils/DatePeriods/GetCurrentWeek';
import {getPreviousMonth} from 'utils/DatePeriods/getPreviousMonth';
import {getPreviousQuarter} from 'utils/DatePeriods/GetPreviousQuarter';
import {getCurrentQuarter} from 'utils/DatePeriods/GetCurrentQuarter';
import {getCurrentYear} from 'utils/DatePeriods/GetCurrentYear';
import {getCurrentMonth} from 'utils/DatePeriods/GetCurrentMonth';
import {isValid, parse} from 'date-fns';
import {
  DatePeriodDayWithMonthRegex,
  DatePeriodRegexString,
  DatePeriodWithYearRegex,
} from 'utils/TimeRegex';
import {getPreviousYear} from 'utils/DatePeriods/GetPreviousYear';

const DateDropdown = ({
  selectedDate,
  setSelectedDate,
  style,
  type = 'common',
}: DateTimePickerProps) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isDropdownShown, setIsDropdownShown] = useState(false);
  const [isArbitraryShown, setIsArbitraryShown] = useState(false);
  const [initialDate] = useState(selectedDate);

  const setValueInput = useCallback(
    (date: [Date | null, Date | null]) =>
      date[0] && date[1] ? `${formatDate(date[0])} - ${formatDate(date[1])}` : '',
    [],
  );

  const [valueInputDate, setValueInputDate] = useState(setValueInput(selectedDate));
  const [valueDateString, setValueDateString] = useState(valueInputDate);

  const [isSearching, setIsSearching] = useState(false);
  const deleteChoice = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSelectedDate(initialDate);
    setValueInputDate(setValueInput(initialDate));
    setIsSearching(false);
  };

  const handleDateChange = (date: [Date | null, Date | null]) => {
    setValueInputDate(setValueInput(selectedDate));
    setSelectedDate(date);
  };

  useEffect(() => {
    setValueDateString(setValueInput(selectedDate));
  }, [selectedDate, setValueInput]);

  const handleValueChange = (value: string) => {
    setIsArbitraryShown(true);
    setIsDropdownShown(false);
    setIsSearching(true);
    if (DatePeriodRegexString.test(value)) {
      setValueInputDate(value);
      const dateParts = value.split(' - ');

      if (dateParts.length === 2) {
        const [startDate, endDate] = dateParts.map(part => {
          return parse(
            part,
            `${
              DatePeriodWithYearRegex.test(part)
                ? 'dd.MM.yy'
                : DatePeriodDayWithMonthRegex.test(part)
                ? 'dd.MM'
                : 'dd'
            }`,
            new Date(),
          );
        });

        if (isValid(startDate) && isValid(endDate)) {
          setSelectedDate([startDate, endDate]);
          setValueInputDate(value);
        }
      } else if (dateParts.length === 1 && dateParts[0] !== '') {
        const singleDate = parse(
          dateParts[0],
          `${
            DatePeriodWithYearRegex.test(dateParts[0])
              ? 'dd.MM.yy'
              : DatePeriodDayWithMonthRegex.test(dateParts[0])
              ? 'dd.MM'
              : 'dd'
          }`,
          new Date(),
        );

        if (isValid(singleDate)) {
          setSelectedDate([singleDate, singleDate]);
          setValueInputDate(value);
        }
      } else if (value === '') {
        setValueDateString('');
        setIsSearching(false);

        setTimeout(() => {
          setSelectedDate([null, null]);
        }, 1000);
      }
    }
  };

  const toggleDropdown = (event: MouseEvent<HTMLInputElement>) => {
    event.stopPropagation();
    setIsDropdownShown(prev => !prev);
    setIsArbitraryShown(false);
  };

  const buttonsPeriod = {
    today: {
      title: 'Сегодня',
      onClick: () => setSelectedDate(getToday()),
    },
    yesterday: {
      title: 'Вчера',
      onClick: () => setSelectedDate(getYesterday()),
    },
    previousWeek: {
      title: 'Предыд. Неделя',
      onClick: () => setSelectedDate(getPreviousWeek()),
    },
    currentWeek: {
      title: 'Тек. Неделя',
      onClick: () => setSelectedDate(getCurrentWeek()),
    },
    previousMonth: {
      title: 'Пред. Месяц',
      onClick: () => setSelectedDate(getPreviousMonth()),
    },
    currentMonth: {
      title: 'Тек. Месяц',
      onClick: () => setSelectedDate(getCurrentMonth()),
    },
    previousQuarter: {
      title: 'Пред. Квартал',
      onClick: () => setSelectedDate(getPreviousQuarter()),
    },
    currentQuarter: {
      title: 'Тек. Квартал',
      onClick: () => setSelectedDate(getCurrentQuarter()),
    },
    currentYear: {
      title: 'Тек. год',
      onClick: () => setSelectedDate(getCurrentYear()),
    },
    previousYear: {
      title: 'Пред. год',
      onClick: () => setSelectedDate(getPreviousYear()),
    },
    arbitrary: {
      title: 'Произвольно',
      onClick: () => {
        setIsArbitraryShown(true);
      },
    },
  };

  const dropdownButtons = {
    withYear: [
      buttonsPeriod.currentMonth,
      buttonsPeriod.previousMonth,
      buttonsPeriod.currentQuarter,
      buttonsPeriod.previousQuarter,
      buttonsPeriod.currentYear,
    ],
    monitoring: [buttonsPeriod.today, buttonsPeriod.yesterday, buttonsPeriod.previousMonth],
    common: [
      buttonsPeriod.today,
      buttonsPeriod.yesterday,
      buttonsPeriod.previousWeek,
      buttonsPeriod.currentWeek,
      buttonsPeriod.previousMonth,
      buttonsPeriod.currentMonth,
    ],
    report: [
      buttonsPeriod.previousWeek,
      buttonsPeriod.currentWeek,
      buttonsPeriod.previousMonth,
      buttonsPeriod.currentMonth,
    ],
    summary: [
      buttonsPeriod.previousMonth,
      buttonsPeriod.currentMonth,
      buttonsPeriod.previousQuarter,
      buttonsPeriod.currentQuarter,
      buttonsPeriod.previousYear,
      buttonsPeriod.currentYear,
    ],
  };

  return (
    <div
      ref={dropdownRef}
      className={`${styles.container} ${isDropdownShown ? styles.active : ''}`}>
      <input
        onClick={e => toggleDropdown(e)}
        className={`${styles.button} ${
          !selectedDate[0] && !selectedDate[1] ? styles.placeholder : ''
        } `}
        style={style}
        onChange={e => handleValueChange(e.target.value)}
        value={isSearching ? valueInputDate : valueDateString}
        placeholder="Выберите период"
      />
      {!(initialDate[0] === selectedDate[0] && initialDate[1] === selectedDate[1]) && (
        <button className={styles.clear__button} onClick={deleteChoice}>
          <CrossIcon />
        </button>
      )}
      {isDropdownShown && (
        <DropdownAction
          active={'1'}
          setIsOpen={setIsDropdownShown}
          buttons={[...dropdownButtons[type], buttonsPeriod.arbitrary]}
        />
      )}

      {isArbitraryShown && (
        <DatePickerPeriod
          selectedDate={selectedDate}
          setSelectedDate={handleDateChange}
          setShown={setIsArbitraryShown}
        />
      )}
    </div>
  );
};

export default DateDropdown;
