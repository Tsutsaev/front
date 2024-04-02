import {useParams} from 'react-router-dom';
import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import React, {useEffect, useMemo, useState} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {selectFilters} from 'store/filters/selectors';
import {getFilteredOrgMembers} from 'store/orgMembers/actions';
import {selectOrgMembers} from 'store/orgMembers/selectors';
import {createProjectMember, getProjMemberByProject} from 'store/projectMembers/actions';
import {selectProjectMembers} from 'store/projectMembers/selectors';
import {selectProjects} from 'store/projects/selectors';
import {selectCurrentOrgId} from 'store/user/selectors';

import FiredFilter from 'components/FiredFilter';
import Button from 'components/new/Button';
import SingleDropdown from 'components/new/Dropdown/Single';
import {DropdownSingleType} from 'components/new/Dropdown/Single/types';
import Input from 'components/new/Input';
import Table from 'components/new/Table';
import TableCell from 'components/new/Table/Cell';
import TableHeader from 'components/new/Table/Header';
import TableRow from 'components/new/Table/Row';
import StatusChecker from 'components/StatusChecker';

import {ReactComponent as IconCheck} from 'shared/assets/images/fi-rr-checkbox.svg';

import {statusAlert} from 'utils/StatusAlert';
import {transformOrgMembersData} from 'utils/TransformDropdownData';

import styles from './index.module.scss';
import ProjectMemberItem from './Item';
import {CreateData, Props} from './types';

const titles = [
  {title: 'Фио'},
  {title: 'Дата ухода из проекта'},
  {title: 'Ставка'},
  {title: 'Часы'},
];

const templateColumns = 'auto 250px 220px 150px 40px';

const EditMembersProjects = ({
  currentOrgId,
  projectMembers,
  getProjMemberByProject,
  orgMembers,
  filters,
  getFilteredOrgMembers,
  createProjectMember,
}: Props) => {
  const {id} = useParams();
  const {isFired} = filters;
  const {projMembers: ProjMembersData, status: projMembersStatus} = projectMembers;
  const {orgMembers: orgMembersData} = orgMembers;

  const [addingRow, setAddingRow] = useState(false);
  const [createData, setCreateData] = useState<CreateData>({
    profile_id: null,
    off: '',
  });
  const orgMembersLabels = useMemo(() => transformOrgMembersData(orgMembersData), [orgMembersData]);

  useEffect(() => {
    getProjMemberByProject({orgId: currentOrgId, projectId: id, isFired});
    getFilteredOrgMembers({orgId: currentOrgId, sheet_off: 'true'});
  }, [getProjMemberByProject, getFilteredOrgMembers, currentOrgId, id, isFired]);

  const handleChange = (option: DropdownSingleType | string, field: keyof CreateData) => {
    setCreateData(prev => ({...prev, [field]: option}));
  };

  const onCreate = () => {
    if (id && createData.profile_id) {
      try {
        createProjectMember({
          orgId: currentOrgId,
          data: {
            project_id: id,
            profile_id: +createData.profile_id.value,
            off: createData.off || null,
          },
        });
        setAddingRow(false);
        setCreateData({
          profile_id: null,
          off: '',
        });
      } catch (e) {
        statusAlert({title: 'Opps, мы уже чиним!'});
      }
    } else {
      statusAlert({title: 'Opps, мы уже чиним!'});
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        Участники
        <div className={styles.buttons}>
          <FiredFilter text="Все" />
          <Button onClick={() => setAddingRow(true)} type={addingRow ? 'disabled' : 'submit'}>
            Добавить
          </Button>
        </div>
      </div>
      <StatusChecker statusArray={[projMembersStatus]}>
        <Table>
          <TableHeader titles={titles} templateColumns={templateColumns} />

          {addingRow && (
            <TableRow templateColumns={templateColumns}>
              <SingleDropdown
                handleChange={v => handleChange(v, 'profile_id')}
                value={createData.profile_id}
                labels={orgMembersLabels}
                isClearable={false}
                placeholder="Выберите сотрудника"
              />
              <TableCell style={{paddingLeft: '18px'}}>-</TableCell>
              <div className={styles.off}>
                <Input isFocus value={createData.off} onChange={v => handleChange(v, 'off')} />
                <div className={styles.help}>
                  Оставьте пустым, что бы ставка заполнилась из ставки Сотрудника.
                </div>
              </div>

              <TableCell>-</TableCell>
              <TableCell style={{padding: '5px'}}>
                <Button onClick={onCreate} type="check">
                  <IconCheck />
                </Button>
              </TableCell>
            </TableRow>
          )}

          {ProjMembersData?.map(member => (
            <ProjectMemberItem templateColumns={templateColumns} key={member.id} data={member} />
          ))}
        </Table>
      </StatusChecker>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  currentOrgId: selectCurrentOrgId(state),
  projects: selectProjects(state),
  projectMembers: selectProjectMembers(state),
  filters: selectFilters(state),
  orgMembers: selectOrgMembers(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      getProjMemberByProject,
      getFilteredOrgMembers,
      createProjectMember,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(EditMembersProjects);
