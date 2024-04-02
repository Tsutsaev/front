import React, {useRef, useEffect, ChangeEvent, useMemo, useCallback} from 'react';
import styles from './index.module.scss';
import {InputProps} from './types';
import {ArbitraryTimeRegex, IntegerRegex, TableTimeRegex} from 'utils/TimeRegex';

const Input = ({
  value,
  onChange,
  size,
  isFocus,
  isError,
  isMultiline,
  placeholder,
  isTable,
  isTime,
  style,
  handleEsc,
  handleEnter,
}: InputProps) => {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  ) => {
    onChange(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleEnter && handleEnter();
    } else if (event.key === 'Escape' && handleEsc) {
      handleEsc();
    } else if (
      event.key === 'Enter' &&
      isMultiline &&
      inputRef.current instanceof HTMLTextAreaElement
    ) {
      event.preventDefault();
      const {selectionStart, selectionEnd} = inputRef.current;
      const newValue = `${value.substring(0, selectionStart)}\n${value.substring(selectionEnd)}`;
      onChange(newValue);
      inputRef.current.setSelectionRange(selectionStart + 1, selectionStart + 1);
    }
  };

  const onBlur = () => {
    const timeRegex = isTable ? TableTimeRegex : ArbitraryTimeRegex;

    if (!timeRegex.test(value)) {
      if (IntegerRegex.test(value)) {
        onChange(`${value}:00`);
      } else if (isTable) {
        onChange('8:00');
      } else {
        onChange('01:00');
      }
    }
  };

  const focusInput = useCallback(() => {
    if (isFocus && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(value.length, value.length);
    }
  }, [isFocus, value]);

  useEffect(() => {
    focusInput();
  }, []);

  const containerClassName = useMemo(() => {
    return `${styles.container} ${isTime ? styles.time : ''} ${size ? styles[size] : ''} ${
      isError ? styles.error : ''
    }`;
  }, [size, isTime, isError]);

  if (isMultiline)
    return (
      <textarea
        ref={inputRef as React.RefObject<HTMLTextAreaElement>}
        value={value}
        onKeyDown={handleKeyDown}
        onChange={handleInputChange}
        className={`${containerClassName} ${styles.textarea}`}
        placeholder={placeholder || 'Заполните описание'}
      />
    );

  return (
    <input
      style={style}
      ref={inputRef as React.RefObject<HTMLInputElement>}
      value={value}
      onKeyDown={handleKeyDown}
      onChange={handleInputChange}
      className={`${containerClassName} ${styles.input}`}
      type="text"
      onBlur={isTime ? onBlur : () => {}}
      placeholder={placeholder || ''}
    />
  );
};

export default Input;
