import {IDateTimePicker} from './types';
import React, {useState, useEffect, useRef} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ru from 'date-fns/locale/ru';
import styles from './index.module.scss';
import './customDatePicker.scss';
import {format, isSameDay} from 'date-fns';

const holidays = [new Date('2023-01-01'), new Date('2023-31-08')];

const isHoliday = (date: Date): boolean => {
  return holidays.some(holiday => holiday.getTime() === date.getTime());
};

const formatDate = (date: Date | null) => {
  if (!date) {
    return 'Выбрать дату';
  }
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}.${month}.${year}`;
};

const shortDayNames = ['Вс,', 'Пн,', 'Вт,', 'Ср,', 'Чт,', 'Пт,', 'Сб,'];

const formatDateArbitrary = (date: Date | null) => {
  if (!date) {
    return 'Выбрать дату';
  }
  const weekdayIndex = date.getDay();
  const weekdayShort = shortDayNames[weekdayIndex];
  const dayOfMonth = date.getDate();
  const monthOfYear = date.getMonth() + 1;
  const yearShort = format(date, 'yy');

  return `${weekdayShort} ${dayOfMonth < 10 ? '0' : ''}${dayOfMonth}.${
    monthOfYear < 10 ? '0' : ''
  }${monthOfYear}.${yearShort}`;
};

const DateTimePicker = ({
  selectedDate,
  setSelectedDate,
  isArbitrary,
  isError,
  style,
}: IDateTimePicker) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const handleButtonClick = () => {
    setIsOpen(prevIsOpen => !prevIsOpen);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (containerRef.current && !containerRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.container} ref={containerRef} style={style}>
      <button
        onClick={handleButtonClick}
        className={`${styles.display} ${isError ? styles.error : ''} `}>
        {isArbitrary ? formatDateArbitrary(selectedDate) : formatDate(selectedDate)}
      </button>
      {'' && selectedDate && isSameDay(selectedDate, new Date()) && (
        <div className={styles.today}>Сегодня</div>
      )}

      {isOpen && (
        <div className={styles.custom}>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="dd.MM.yyyy"
            placeholderText="Выберите дату"
            shouldCloseOnSelect={false}
            inline
            locale={ru}
            dayClassName={date => (isHoliday(date) ? 'react-datepicker__day--weekend' : '')}
          />
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;
