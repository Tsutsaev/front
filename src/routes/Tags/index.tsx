import React from 'react';
import TagsTable from 'components/TagsTable';
import SortingPanel from 'components/SortingPanel';
import PageWrapper from 'components/new/Page/Wrapper';
import PageMenu from 'components/new/Page/Menu';

const TagsPage = () => {
  return (
    <PageWrapper>
      <PageMenu title="Тэги" />

      <SortingPanel isSearching />
      <TagsTable />
    </PageWrapper>
  );
};

export default TagsPage;
