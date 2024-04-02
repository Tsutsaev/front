import React, {useState} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {selectRole} from 'store/user/selectors';

import HolidaysTable from 'components/HolidaysTable';
import Button from 'components/new/Button';
import PageMenu from 'components/new/Page/Menu';
import PageWrapper from 'components/new/Page/Wrapper';
import SortingPanel from 'components/SortingPanel';

import {StateProps} from './types';

const HolidaysPage = ({userRole}: StateProps) => {
  const [addingLine, setAddingLine] = useState(false);

  return (
    <PageWrapper>
      <PageMenu title="Праздники">
        {userRole === 'manager' && (
          <Button type={addingLine ? 'disabled' : 'submit'} onClick={() => setAddingLine(true)}>
            Добавить
          </Button>
        )}
      </PageMenu>

      <SortingPanel isSearching />

      <HolidaysTable addingLine={addingLine} setAddingLine={setAddingLine} />
    </PageWrapper>
  );
};

const mapStateToProps = (state: RootState) => ({
  userRole: selectRole(state),
});

export default connect(mapStateToProps)(HolidaysPage);
