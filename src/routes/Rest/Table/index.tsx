import {tagsLabels} from 'constants/Tags';

import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import React, {useEffect, useMemo, useState} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {selectFilters} from 'store/filters/selectors';
import {getAllOrgMembers} from 'store/orgMembers/actions';
import {selectOrgMembers} from 'store/orgMembers/selectors';
import {createRest, getAllRest, getFilteredRest} from 'store/rest/actions';
import {selectRest} from 'store/rest/selectors';
import {selectUser} from 'store/user/selectors';

import Button from 'components/new/Button';
import CustomDatePicker from 'components/new/DatePicker';
import SingleDropdown from 'components/new/Dropdown/Single';
import {DropdownSingleType} from 'components/new/Dropdown/Single/types';
import Table from 'components/new/Table';
import TableCell from 'components/new/Table/Cell';
import TableHeader from 'components/new/Table/Header';
import TableRow from 'components/new/Table/Row';
import StatusChecker from 'components/StatusChecker';

import {UseDateContext} from 'hooks/UseDateContext';

import {ReactComponent as IconCheck} from 'shared/assets/images/fi-rr-checkbox.svg';

import {formatDatePatch, formatDatePatchPoint} from 'utils/DateFormat';
import {getOptionFromIdWithoutNull} from 'utils/GetOptionFromString';
import {transformOrgMembersData} from 'utils/TransformDropdownData';

import TableRecord from './Record';
import {NewRest, Props} from './types';

const templateColumns = 'auto 95px 120px 150px 120px 60px';
const titles = [
  {title: 'Сотрудник'},
  {title: 'Начало'},
  {title: 'Окончание'},
  {title: 'Тип'},
  {title: 'Согласован'},
];

const RestTable = ({
  rest,
  user,
  orgMembers,
  filters,
  createRest,
  getAllOrgMembers,
  getAllRest,
  getFilteredRest,
  addingLine,
  setAddingLine,
}: Props) => {
  const {orgMembers: orgMembersData, status: orgMembersStatus} = orgMembers;
  const {search} = filters;
  const {date} = UseDateContext();
  const {currentOrgId, role, data} = user;
  const {rest: restData, status: restStatus} = rest;
  const orgMembersLabels = useMemo(() => transformOrgMembersData(orgMembersData), [orgMembersData]);

  const [restDataCreate, setRestDataCreate] = useState<NewRest>({
    date_from: new Date(),
    date_to: new Date(),
    tags: tagsLabels[0],
    profile: getOptionFromIdWithoutNull(Number(data.id), orgMembersLabels),
  });

  useEffect(() => {
    setRestDataCreate(prev => ({
      ...prev,
      profile: getOptionFromIdWithoutNull(Number(data.id), orgMembersLabels),
    }));
  }, [orgMembersLabels, data.id]);

  useEffect(() => {
    getAllOrgMembers(currentOrgId);
    getAllRest(currentOrgId);
  }, [getAllOrgMembers, getAllRest, currentOrgId]);

  useEffect(() => {
    getFilteredRest({
      orgId: currentOrgId,
      date_from: formatDatePatchPoint(date[0]),
      date_to: formatDatePatchPoint(date[1]),
      id: null,
    });
  }, [getFilteredRest, date, currentOrgId]);

  const handleChangeRestDataCreate = (value: DropdownSingleType | Date, field: keyof NewRest) => {
    setRestDataCreate(prev => ({...prev, [field]: value}));
  };

  const [filteredRestData, setFilteredRestData] = useState(restData);

  useEffect(() => {
    setFilteredRestData(
      restData.filter(item => {
        if (item.profile.fio.toLowerCase().includes(search.toLowerCase())) {
          return item;
        }
      }),
    );
  }, [search, restData]);

  const onCreate = () => {
    createRest({
      orgId: currentOrgId,
      data: {
        profile_id:
          role === 'manager' ? Number(restDataCreate.profile?.value) : Number(user.data.id),
        date_to: formatDatePatch(restDataCreate.date_to),
        date_from: formatDatePatch(restDataCreate.date_from),
        agreed: false,
        tags: restDataCreate.tags?.value ? [restDataCreate.tags.value] : [],
      },
    });
    setAddingLine(false);
    setRestDataCreate({
      date_from: new Date(),
      date_to: new Date(),
      tags: tagsLabels[0],
      profile: getOptionFromIdWithoutNull(Number(data.id), orgMembersLabels),
    });
  };

  return (
    <Table>
      <TableHeader titles={titles} templateColumns={templateColumns} />
      <StatusChecker statusArray={[orgMembersStatus, restStatus]}>
        {addingLine && (
          <TableRow templateColumns={templateColumns}>
            {role === 'manager' ? (
              <TableCell style={{padding: '12px 0'}}>
                <SingleDropdown
                  placeholder="Выберите содрудника"
                  handleChange={value => handleChangeRestDataCreate(value, 'profile')}
                  value={restDataCreate.profile}
                  labels={orgMembersLabels}
                  isClearable={false}
                />
              </TableCell>
            ) : (
              <TableCell>{user.data.fio}</TableCell>
            )}

            <TableCell style={{padding: '12px 0'}}>
              <CustomDatePicker
                setSelectedDate={value => handleChangeRestDataCreate(value, 'date_from')}
                selectedDate={restDataCreate.date_from}
                style={{width: '100%'}}
              />
            </TableCell>
            <TableCell style={{padding: '12px 0'}}>
              <CustomDatePicker
                setSelectedDate={value => handleChangeRestDataCreate(value, 'date_to')}
                selectedDate={restDataCreate.date_to}
                style={{width: '100%'}}
              />
            </TableCell>

            <TableCell style={{padding: '12px 2px'}}>
              <SingleDropdown
                labels={tagsLabels}
                handleChange={value => handleChangeRestDataCreate(value, 'tags')}
                value={restDataCreate.tags}
                isClearable={false}
              />
            </TableCell>

            <TableCell style={{justifySelf: 'center'}}></TableCell>
            <TableCell>
              <Button type={'check'} onClick={onCreate}>
                <IconCheck />
              </Button>
            </TableCell>
          </TableRow>
        )}

        {filteredRestData?.map((item, index) => (
          <TableRecord color={index % 2 ? 'gray' : 'white'} key={item.id} rest={item} />
        ))}
      </StatusChecker>
    </Table>
  );
};

const mapStateToProps = (state: RootState) => ({
  rest: selectRest(state),
  orgMembers: selectOrgMembers(state),
  user: selectUser(state),
  filters: selectFilters(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      createRest,
      getAllOrgMembers,
      getAllRest,
      getFilteredRest,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(RestTable);
