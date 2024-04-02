import React, {useState} from 'react';
import styles from './index.module.scss';
import UseAppDispatch from 'hooks/UseAppDispatch';
import {setSearch} from 'store/filters/slice';

const Search = () => {
  const dispatch = UseAppDispatch();
  const [value, setValue] = useState('');
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    dispatch(setSearch(event.target.value));
  };
  return (
    <input
      value={value}
      onChange={handleChange}
      className={styles.container}
      type="text"
      placeholder="Поиск"
    />
  );
};

export default Search;
