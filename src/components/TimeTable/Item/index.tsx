import React, {useState, useMemo, useEffect} from 'react';
import {Props, SheetData} from './types';
import styles from './index.module.scss';
import {createSheets, patchSheets} from 'store/sheet/actions';
import {ReactComponent as IconCheck} from 'shared/assets/images/fi-rr-checkbox.svg';
import {ReactComponent as IconUndo} from 'shared/assets/images/fi-rr-undo-alt.svg';

import TableRow from 'components/new/Table/Row';
import {formatStringDateWithWeek} from 'utils/FormatDateWithWeek';
import {transformDropdownData} from 'utils/TransformDropdownData';
import {RootState} from 'store';
import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import {connect} from 'react-redux';
import {selectProjectMembers} from 'store/projectMembers/selectors';
import {selectCurrentOrgId} from 'store/user/selectors';
import StatusChecker from 'components/StatusChecker';
import {getOptionFromId} from 'utils/GetOptionFromString';
import NotActiveTableRow from 'components/new/Table/Row/NotActive';
import EditableInput from 'components/new/Editable/Input';
import {DropdownSingleType} from 'components/new/Dropdown/Single/types';
import EditableDropdown from 'components/new/Dropdown/Editable/Dropdown';
import Button from 'components/new/Button';
import {addDurationToDateTime} from 'utils/AddDurationToDateTime';
import {TagsList} from 'components/new';

const TimeTableItem = ({
  templateColumns,
  data,
  isNotDateFired,
  setLoading,
  offOther = false,
  currentProject,
  projectMembers,
  currentOrgId,
  createSheets,
  patchSheets,
}: Props) => {
  const {projMembers: projectMembersData, status: projectMembersStatus} = projectMembers;
  const isZeroHours = useMemo(
    () => data.rest_from || data.is_weekend || data.holiday_descr,
    [data.rest_from, data.is_weekend, data.holiday_descr],
  );
  const labels = useMemo(() => transformDropdownData(projectMembersData), [projectMembersData]);

  const [sheetData, setSheetData] = useState<SheetData>({
    duration: data.sheet_duration?.slice(0, -3) || (isZeroHours ? '00:00' : '08:00'),
    description: data.sheet_description || '',
    project: data.sheet_id
      ? getOptionFromId(data.project?.id || null, labels)
      : getOptionFromId(currentProject || null, labels),
  });

  const [editingRow, setEditingRow] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleChange = (
    value: string | number | DropdownSingleType | null,
    field: keyof SheetData,
  ) => {
    setSheetData(prev => ({...prev, [field]: value}));
  };

  useEffect(() => {
    setSheetData({
      duration: data.sheet_duration?.slice(0, -3) || (isZeroHours ? '00:00' : '08:00'),
      description: data.sheet_description || '',
      project: data.sheet_id
        ? getOptionFromId(data.project?.id || null, labels)
        : getOptionFromId(currentProject || null, labels),
    });
  }, [data, currentProject, labels, isZeroHours]);

  const onUndo = () => {
    setSheetData({
      duration: data.sheet_duration?.slice(0, -3) || (isZeroHours ? '00:00' : '08:00'),
      description: data.sheet_description || '',
      project: data.sheet_id
        ? getOptionFromId(data.project?.id || null, labels)
        : getOptionFromId(currentProject || null, labels),
    });

    setEditingRow(false);
    setIsError(false);
  };

  const onSave = () => {
    if (isNotDateFired(data.date)) {
      if (offOther || sheetData.description) {
        setIsError(false);
        setEditingRow(false);
        if (data.sheet_id) {
          patchSheets({
            orgId: currentOrgId,
            id: data.sheet_id,
            data: {
              project_id: sheetData.project ? Number(sheetData.project.value) : null,
              description: sheetData.description || '',
              duration: `${sheetData.duration}:00`,
              off: data.sheet_off,
            },
          });
          setLoading(true);
        } else {
          const finalISODate = `${data.date}T09:00:00+03:00`;
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
            },
          });
          setLoading(true);
        }
      } else {
        setIsError(true);
      }
    }
  };

  if (data.is_future)
    return (
      <NotActiveTableRow
        date={formatStringDateWithWeek(data.date)}
        templateColumns={templateColumns}
        valueDescription={sheetData.description}
        valueTime={sheetData.duration}
      />
    );

  return (
    <StatusChecker statusArray={[projectMembersStatus]}>
      <TableRow
        color={data.rest_from ? 'blue' : data.is_weekend || data.holiday_descr ? 'red' : 'white'}
        templateColumns={templateColumns}>
        <div className={styles.rest_date}>
          <p className={styles.text}> {formatStringDateWithWeek(data.date)}</p>
          {data.rest_from ? (
            <div className={styles.tags}>
              <TagsList tags={data.rest_tags || []} />
            </div>
          ) : data.holiday_descr ? (
            <div className={styles.tags}>
              <TagsList tags={['Праздник']} />
            </div>
          ) : (
            <></>
          )}
        </div>

        <EditableInput
          isTime
          isTable
          style={{minWidth: '70px'}}
          value={sheetData.duration}
          onChange={value => handleChange(value, 'duration')}
          setEditingRow={setEditingRow}
          editingRow={editingRow}
        />

        {offOther ? (
          <div
            onClick={() => setEditingRow(true)}
            className={`${styles.off__other} ${data.sheet_id ? styles.filled : styles.notFilled}`}>
            <p className={styles.text} dangerouslySetInnerHTML={{__html: sheetData.description}} />
          </div>
        ) : (
          <EditableInput
            isMultiline
            handleEnter={onSave}
            handleEsc={onUndo}
            isError={isError}
            setEditingRow={setEditingRow}
            editingRow={editingRow}
            value={sheetData.description}
            onChange={value => handleChange(value, 'description')}
          />
        )}

        <EditableDropdown
          setEditingRow={setEditingRow}
          editingRow={editingRow}
          value={sheetData.project}
          handleChange={value => handleChange(value, 'project')}
          labels={labels}
        />
        {editingRow && (
          <div className={styles.buttons}>
            {isNotDateFired(data.date) && (
              <Button type="check" onClick={onSave}>
                <IconCheck />
              </Button>
            )}
            <Button type="icon" onClick={onUndo}>
              <IconUndo />
            </Button>
          </div>
        )}
      </TableRow>
    </StatusChecker>
  );
};

const mapStateToProps = (state: RootState) => ({
  projectMembers: selectProjectMembers(state),
  currentOrgId: selectCurrentOrgId(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      patchSheets,
      createSheets,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(TimeTableItem);
