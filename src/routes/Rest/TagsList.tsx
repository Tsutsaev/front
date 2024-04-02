import React from 'react';
import styles from './index.module.scss';
import {RestData} from 'store/rest/types';

type TagsListProps = Pick<RestData, 'tags'>;

const TagsList = ({tags}: TagsListProps) => {
  if (!tags.length)
    return (
      <div className={styles.tags__table__list}>
        <b>-</b>
      </div>
    );

  return (
    <div className={styles.tags__table__list}>
      <div
        className={styles.tags__item}
        style={{background: tags[0] !== 'Отпуск' ? '#FFCEC9' : '#C6D3FE'}}>
        {tags[0]}
      </div>
    </div>
  );
};

export default TagsList;
