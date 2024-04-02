import React from 'react';
import styles from './index.module.css';

interface ITagsListProps {
  tags: string[];
}

const TagsList = ({tags}: ITagsListProps) => {
  if (Array.isArray(tags))
    return (
      <div className={styles.tags__list}>
        {tags.map(tag => (
          <div key={tag} className={styles.record__tag}>
            {tag}
          </div>
        ))}
      </div>
    );

  return <>-</>;
};

export default TagsList;
