import React, {useState, useCallback, useRef, useEffect} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import styles from './index.module.scss';

import {ru} from 'date-fns/locale';
import {DatePickerPeriodProps} from './types';
import UseClickOutside from 'hooks/UseClickOutide';
import Button from '../Button';

const DatePickerPeriod = ({selectedDate, setSelectedDate, setShown}: DatePickerPeriodProps) => {
  const containerRef = useRef(null);

  UseClickOutside(containerRef, () => setShown(false));
  const [firstDate, setFirstDate] = useState<Date | null>(selectedDate[0]);
  const [secondDate, setSecondDate] = useState<Date | null>(selectedDate[1]);

  const handleApply = useCallback(() => {
    setSelectedDate([firstDate, secondDate ? secondDate : new Date()]);
    setShown(false);
  }, [firstDate, secondDate, setSelectedDate, setShown]);

  useEffect(() => {
    setFirstDate(selectedDate[0]);
    setSecondDate(selectedDate[1]);
  }, [selectedDate]);

  const handleCancel = useCallback(() => {
    setShown(false);
  }, [setShown]);
  return (
    <div ref={containerRef} className={styles.arbitrary}>
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
              dayClassName={() => styles.day__container}
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
              dayClassName={() => styles.day__container}
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
    </div>
  );
};

export default DatePickerPeriod;
