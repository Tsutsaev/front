import React, {useState, useEffect, memo, useMemo, useCallback} from 'react';
import styles from './index.module.scss';
import TimeArbitratyItem from './Item';
import {createSheets, getAllMySheets} from 'store/sheet/actions';
import {formatISO, isBefore, isSameDay} from 'date-fns';
import {ReactComponent as IconCheck} from 'shared/assets/images/fi-rr-checkbox.svg';
import {ReactComponent as IconClock} from 'shared/assets/images/fi-rr-clock.svg';
import {ReactComponent as IconProject} from 'shared/assets/images/fi-rr-layers.svg';
import {ReactComponent as IconDate} from 'shared/assets/images/fi-rr-calendar.svg';
import {ReactComponent as IconDescription} from 'shared/assets/images/fi-rr-document.svg';

import {ReactComponent as IconRuble} from 'shared/assets/images/ruble-svgrepo-com.svg';
import {ReactComponent as IconRubleRed} from 'shared/assets/images/ruble-svgrepo-com-red-crossed.svg';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import {selectOrgMembers} from 'store/orgMembers/selectors';
import {selectUser} from 'store/user/selectors';
import {selectSheets} from 'store/sheet/selectors';
import {Props} from './types';
import {selectProjectMembers} from 'store/projectMembers/selectors';
import {transformDropdownData} from 'utils/TransformDropdownData';
import {getOptionFromId} from 'utils/GetOptionFromString';
import {DropdownSingleType} from 'components/new/Dropdown/Single/types';
import StatusChecker from 'components/StatusChecker';
import {addDurationToDateTime} from 'utils/AddDurationToDateTime';
import Table from 'components/new/Table';
import TableHeader from 'components/new/Table/Header';
import TableRow from 'components/new/Table/Row';
import CustomDatePicker from 'components/new/DatePicker';
import Input from 'components/new/Input';
import SingleDropdown from 'components/new/Dropdown/Single';
import Button from 'components/new/Button';
import {SheetData} from './Item/types';

const templateColumns = '120px 80px auto 23% 10%';

const TimeArbitrary = ({
  user,
  orgMembers,
  sheets,
  projectMembers,
  getAllMySheets,
  createSheets,
}: Props) => {
  const {currentOrgId, data} = user;
  const {orgMembers: orgMembersData, status: orgMembersStatus} = orgMembers;
  const {projMembers: projectMembersData, status: projectMembersStatus} = projectMembers;
  const {sheets: sheetsData, status: sheetsStatus} = sheets;
  const offOther = useMemo(
    () => orgMembersData.find(({profile_id}) => profile_id === Number(data.id))?.off_other,
    [orgMembersData, data.id],
  );
  const isNotDateFired = useCallback(
    (date: Date) => {
      const dateFired = orgMembersData.find(({profile_id}) => profile_id === Number(data.id))
        ?.date_out;
      return (
        !dateFired || isSameDay(new Date(dateFired), date) || isBefore(date, new Date(dateFired))
      );
    },
    [orgMembersData, data.id],
  );

  const [isError, setIsError] = useState(false);
  const currentProject =
    orgMembersData.find(orgMember => orgMember.profile.id === Number(data.id))?.current_project ||
    null;

  const labels = useMemo(() => transformDropdownData(projectMembersData), [projectMembersData]);

  const [sheetData, setSheetData] = useState<SheetData>({
    duration: '01:00',
    description: '',
    project: getOptionFromId(currentProject || null, labels),
    isPayment: true,
    date: new Date(),
    off: '',
  });

  useEffect(() => {
    setSheetData(prev => ({
      ...prev,
      project: labels.find(label => label.value === currentProject?.toString()) || null,
    }));
  }, [currentProject, labels]);

  useEffect(() => {
    getAllMySheets({orgId: currentOrgId, id: Number(data.id)});
  }, [getAllMySheets, currentOrgId, data.id]);

  const handleChange = (
    value: string | Date | number | DropdownSingleType,
    field: keyof SheetData,
  ) => {
    setSheetData(prev => ({...prev, [field]: value}));
  };

  const onCopy = (
    project: DropdownSingleType,
    duration: string,
    description: string,
    isPayment: boolean,
  ) => {
    setSheetData({
      duration,
      description,
      project,
      isPayment,
      date: new Date(),
      off: '',
    });
  };

  const addRow = () => {
    if (isNotDateFired(sheetData.date)) {
      const adjustedISODate = formatISO(sheetData.date);
      const finalISODate = `${adjustedISODate.slice(0, -6)}+03:00`;
      if (sheetData.description || offOther) {
        setIsError(false);
        createSheets({
          orgId: currentOrgId,
          data: {
            organization: currentOrgId,
            project_id: sheetData.project ? Number(sheetData.project.value) : null,
            start_at: finalISODate,
            end_at: addDurationToDateTime(finalISODate, sheetData.duration),
            description: sheetData.description || '',
            duration: `${sheetData.duration}:00`,
            tags: [],
            is_payble: sheetData.isPayment,
          },
        }),
          setSheetData({
            duration: '01:00',
            description: '',
            project: getOptionFromId(currentProject || null, labels),
            isPayment: true,
            date: new Date(),
            off: '',
          });
      } else {
        setIsError(true);
      }
    }
  };

  return (
    <StatusChecker statusArray={[sheetsStatus, projectMembersStatus, orgMembersStatus]}>
      <Table>
        <TableHeader
          titles={[
            {icon: <IconDate />},
            {icon: <IconClock />},
            {icon: <IconDescription />, title: 'Что сделал'},
            {icon: <IconProject />, title: 'Проект'},
          ]}
          templateColumns={templateColumns}
        />

        <TableRow color={'white'} templateColumns={templateColumns}>
          <CustomDatePicker
            isArbitrary
            selectedDate={sheetData.date}
            setSelectedDate={value => handleChange(value, 'date')}
          />

          <Input
            style={{width: 'minWidth: 70px'}}
            isTime
            value={sheetData.duration}
            onChange={value => handleChange(value, 'duration')}
          />

          {offOther ? (
            <div className={styles.off__other}>Не заполняется</div>
          ) : (
            <Input
              isError={isError}
              handleEnter={addRow}
              isMultiline
              value={sheetData.description}
              onChange={value => handleChange(value, 'description')}
            />
          )}
          <div className={styles.settings}>
            <div className={styles.project}>
              <SingleDropdown
                value={sheetData.project}
                handleChange={value => handleChange(value, 'project')}
                labels={labels}
              />
            </div>
            <div className={styles.money}>
              <button
                onClick={() => setSheetData(prev => ({...prev, isPayment: !prev.isPayment}))}
                className={`${styles.button} `}>
                {sheetData.isPayment ? <IconRuble /> : <IconRubleRed />}
              </button>
            </div>
          </div>
          <div className={styles.button_container}>
            <Button type="check" onClick={addRow}>
              <IconCheck />
            </Button>
          </div>
        </TableRow>

        <Table>
          {sheetsData.map(sheet => {
            return (
              <TimeArbitratyItem
                key={sheet.id}
                onCopy={onCopy}
                sheet={sheet}
                templateColumns={templateColumns}
                offOther={offOther}
                isNotDateFired={isNotDateFired}
              />
            );
          })}
        </Table>
      </Table>
    </StatusChecker>
  );
};

const mapStateToProps = (state: RootState) => ({
  orgMembers: selectOrgMembers(state),
  user: selectUser(state),
  sheets: selectSheets(state),
  projectMembers: selectProjectMembers(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      getAllMySheets,
      createSheets,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(memo(TimeArbitrary));
