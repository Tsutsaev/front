import React, {forwardRef, useState} from 'react';
import styles from './index.module.css';

type TagsDropdownTextInputProps = {
  onKeyPress: (value: string) => void;
};

const TagsDropdownTextInput = forwardRef<HTMLInputElement, TagsDropdownTextInputProps>(
  ({onKeyPress}, ref) => {
    const [inputValue, setInputValue] = useState('');

    const createTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && inputValue) {
        onKeyPress(inputValue);
        setInputValue('');
      }
    };

    return (
      <input
        maxLength={20}
        className={styles.text__input}
        ref={ref}
        type={'text'}
        value={inputValue}
        onKeyDown={event => createTag(event)}
        onChange={event => setInputValue(event.target.value)}
      />
    );
  },
);

export default TagsDropdownTextInput;
