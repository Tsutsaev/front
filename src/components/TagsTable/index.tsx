import React, {useState, useEffect, memo} from 'react';
import styles from './index.module.scss';
import {IApiResponse, instance} from 'shared';
import {ITag, StateProps} from './types';
import TagsItem from './Item';
import {RootState} from 'store';
import {connect} from 'react-redux';
import {selectCurrentOrgId} from 'store/user/selectors';
import {selectSearch} from 'store/filters/selectors';
import TableHeader from 'components/new/Table/Header';
import Table from 'components/new/Table';

const templateColumns = 'auto 100px';

const TagsTable = ({currentOrgId, search}: StateProps) => {
  const [tags, setTags] = useState<ITag[]>([]);
  const [filteredTags, setFilteredTags] = useState(tags);
  const [isSorting, setIsSorting] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await instance.get<IApiResponse<ITag>>(
          `/${currentOrgId}/tag/?ordering=${isSorting ? '' : '-'}name`,
        );
        setTags(response.data.results);
      } catch (error) {
        console.error('Ошибка при загрузке данных:', error);
      }
    }

    void fetchData();
  }, [isSorting, currentOrgId]);

  useEffect(() => {
    const lowercaseSearch = search.toLowerCase();

    if (lowercaseSearch.trim() === '') {
      setFilteredTags(tags);
    } else {
      const filteredTags = tags.filter(tag =>
        [tag.name].some(field => field && field.toLowerCase().includes(lowercaseSearch)),
      );
      setFilteredTags(filteredTags);
    }
  }, [search, tags]);

  const removeTag = async (tagId: number) => {
    try {
      await instance.delete(`/${currentOrgId}/tag/${tagId}/`);
      setTags(prev => prev.filter(tag => tag.id !== tagId));
    } catch (error) {
      console.error('Ошибка при удалении данных:', error);
    }
  };

  return (
    <div className={styles.container}>
      <TableHeader
        titles={[{title: 'Название', sort: () => setIsSorting(prev => !prev)}]}
        templateColumns={templateColumns}
      />

      <Table>
        {filteredTags.map((tag, index) => {
          return (
            <TagsItem
              color={index % 2 ? 'gray' : 'white'}
              key={tag.id}
              tag={tag}
              onRemove={removeTag}
              templateColumns={templateColumns}
            />
          );
        })}
      </Table>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentOrgId: selectCurrentOrgId(state),
  search: selectSearch(state),
});

export default connect(mapStateToProps)(memo(TagsTable));
