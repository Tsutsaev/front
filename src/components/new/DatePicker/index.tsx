import {getDayOfWeek} from 'utils/FormatDateWithWeek';
import {DatePickerProps} from './types';
import React, {useRef} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ru from 'date-fns/locale/ru';
import styles from './index.module.scss';
import './customDatePicker.scss';

const holidays = [new Date('2023-01-01'), new Date('2023-31-08')];

const isHoliday = (date: Date): boolean => {
  return holidays.some(holiday => holiday.getTime() === date.getTime());
};

const CustomDatePicker = ({
  selectedDate,
  setSelectedDate,
  isError,
  style,
  isArbitrary,
  autoFocus,
}: DatePickerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div style={style} className={styles.container} ref={containerRef}>
      <div className={`${styles.display} ${isError ? styles.error : ''} `}>
        {isArbitrary ? getDayOfWeek(selectedDate) + ' ' : ''}
        <DatePicker
          autoFocus={autoFocus}
          className={styles.date__input}
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="dd.MM.yy"
          placeholderText="Выберите дату"
          shouldCloseOnSelect={false}
          locale={ru}
          dayClassName={date =>
            isHoliday(date) ? 'react-datepicker__day--weekend' : 'day__container'
          }
        />
      </div>
    </div>
  );
};

export default CustomDatePicker;
