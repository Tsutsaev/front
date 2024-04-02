import React from 'react';
import styles from './index.module.css';

type TagsDropdownListItemProps = {
  tag: string;
  onClick: () => void;
};

const TagsDropdownListItem = ({tag, onClick}: TagsDropdownListItemProps) => {
  return (
    <div className={styles.list__item__container} onClick={onClick}>
      {tag}
    </div>
  );
};

export default TagsDropdownListItem;
