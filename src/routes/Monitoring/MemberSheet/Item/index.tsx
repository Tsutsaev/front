import {useParams} from 'react-router-dom';

import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import {formatISO} from 'date-fns';
import React, {useEffect, useState, useMemo, memo} from 'react';
import {connect} from 'react-redux';
import {RootState} from 'store';
import {selectProjectMembers} from 'store/projectMembers/selectors';
import {createSheets, deleteSheets, patchSheets} from 'store/sheet/actions';
import {selectUser} from 'store/user/selectors';

import DeleteModal from 'components/DeleteModal';
import {TagsList} from 'components/new';
import Button from 'components/new/Button';
import EditableDropdown from 'components/new/Dropdown/Editable/Dropdown';
import {DropdownSingleType} from 'components/new/Dropdown/Single/types';
import EditableDatePicker from 'components/new/Editable/DatePicker';
import EditableInput from 'components/new/Editable/Input';
import TableRow from 'components/new/Table/Row';
import StatusChecker from 'components/StatusChecker';

import {ReactComponent as IconCheck} from 'shared/assets/images/fi-rr-checkbox.svg';
import {ReactComponent as IconDelete} from 'shared/assets/images/fi-rr-trash.svg';
import {ReactComponent as IconUndo} from 'shared/assets/images/fi-rr-undo-alt.svg';
import {ReactComponent as IconRubleRed} from 'shared/assets/images/ruble-svgrepo-com-red-crossed.svg';
import {ReactComponent as IconRuble} from 'shared/assets/images/ruble-svgrepo-com.svg';

import {addDurationToDateTime} from 'utils/AddDurationToDateTime';
import {getOptionFromId} from 'utils/GetOptionFromString';
import {transformDropdownData} from 'utils/TransformDropdownData';

import styles from './index.module.scss';
import {Props, SheetData} from './types';

const MemberSheetItem = ({
  templateColumns,
  day,
  off_other,
  user,
  orgMemberId,
  projectMembers,
  patchSheets,
  createSheets,
  deleteSheets,
  fill_mode,
}: Props) => {
  const {currentOrgId, role} = user;
  const {projMembers: projectMembersData, status: projectMembersStatus} = projectMembers;
  const {id} = useParams();
  const projectsLabels = useMemo(
    () => transformDropdownData(projectMembersData),
    [projectMembersData],
  );

  const [sheetData, setSheetData] = useState<SheetData>({
    duration: day.sheet_duration?.slice(0, -3) || '00:00',
    description: day.sheet_description || '',
    project: getOptionFromId(day.project_id, projectsLabels) || {
      label: day.project?.name || '',
      value: day.project_id?.toString() || '',
      color: day.project?.color || '',
    },
    off: day.sheet_off?.toString() || '',
    is_payble: Boolean(day.is_payble),
    date: new Date(day.date),
  });

  useEffect(() => {
    setSheetData(prev => ({
      ...prev,
      project: getOptionFromId(day.project_id, projectsLabels) || {
        label: day.project?.name || '',
        value: day.project_id?.toString() || '',
        color: day.project?.color || '',
      },
    }));
  }, [projectsLabels, day.project_id, day.project?.name, day.project?.color]);

  const [showModal, setShowModal] = useState(false);
  const [editingRow, setEditingRow] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleChange = (value: string | Date | DropdownSingleType, field: keyof SheetData) => {
    setSheetData(prev => ({...prev, [field]: value}));
  };

  const onDelete = () => {
    if (day.sheet_id)
      deleteSheets({
        orgId: currentOrgId,
        id: day.sheet_id,
      });

    setShowModal(false);
  };

  const onUndo = () => {
    setSheetData({
      duration: day.sheet_duration?.slice(0, -3) || '00:00',
      description: day.sheet_description || '',
      project: getOptionFromId(day.project_id, projectsLabels),
      off: day.sheet_off?.toString() || '',
      is_payble: true,
      date: new Date(day.date),
    });
    setEditingRow(false);
    setIsError(false);
  };

  const onSave = () => {
    if ((sheetData.description || off_other) && sheetData.date) {
      setIsError(false);
      setEditingRow(false);
      const adjustedISODate = formatISO(sheetData.date);
      const finalISODate = `${adjustedISODate.slice(0, -6)}+03:00`;
      if (day.sheet_id) {
        patchSheets({
          orgId: currentOrgId,
          id: day.sheet_id,
          data: {
            description: sheetData.description,
            start_at: finalISODate,
            end_at: addDurationToDateTime(finalISODate, sheetData.duration),
            duration: `${sheetData.duration}:00`,
            off: Number(sheetData.off),
            is_payble: sheetData.is_payble,
            project_id: sheetData.project ? Number(sheetData.project.value) : null,
          },
        });
      } else {
        setEditingRow(false);
        createSheets({
          orgId: currentOrgId,
          data: {
            organization: currentOrgId,
            project_id: sheetData.project ? Number(sheetData.project.value) : null,
            start_at: finalISODate,
            end_at: addDurationToDateTime(finalISODate, sheetData.duration),
            description: sheetData.description,
            duration: `${sheetData.duration}:00`,
            off: Number(sheetData.off),
            is_payble: true,
            created_by: orgMemberId,
            created_by_manager: Number(id),
            tags: [],
          },
        });
      }
    } else {
      setIsError(true);
    }
  };

  return (
    <StatusChecker statusArray={[projectMembersStatus]}>
      <TableRow
        color={day.rest_from ? 'blue' : day.is_weekend || day.holiday_descr ? 'red' : 'white'}
        templateColumns={templateColumns}>
        <div className={styles.rest_date}>
          <EditableDatePicker
            setEditingRow={setEditingRow}
            editingRow={editingRow}
            selectedDate={sheetData.date}
            setSelectedDate={value => handleChange(value, 'date')}
          />
          {day.rest_from ? (
            <div className={styles.tags}>
              <TagsList tags={day.rest_tags || []} />
            </div>
          ) : day.holiday_descr ? (
            <div className={styles.tags}>
              <TagsList tags={['Праздник']} />
            </div>
          ) : (
            <></>
          )}
        </div>
        <EditableInput
          isTime
          setEditingRow={setEditingRow}
          editingRow={editingRow}
          value={sheetData.duration}
          onChange={value => handleChange(value, 'duration')}
        />

        {off_other ? (
          <div
            onClick={() => setEditingRow(true)}
            className={`${styles.off__other} ${day.sheet_id ? styles.filled : styles.notFilled}`}>
            <p className={styles.text} dangerouslySetInnerHTML={{__html: sheetData.description}} />
          </div>
        ) : (
          <EditableInput
            isMultiline
            isError={isError}
            setEditingRow={setEditingRow}
            editingRow={editingRow}
            value={sheetData.description}
            onChange={value => handleChange(value, 'description')}
          />
        )}

        <div className={styles.settings}>
          <EditableDropdown
            setEditingRow={setEditingRow}
            editingRow={editingRow}
            value={sheetData.project}
            handleChange={option => handleChange(option, 'project')}
            labels={projectsLabels}
          />

          <div className={styles.money}>
            <Button
              type="icon"
              onClick={() => {
                setEditingRow(true);
                setSheetData(prev => ({...prev, is_payble: !prev.is_payble}));
              }}>
              {sheetData.is_payble ? <IconRuble /> : <IconRubleRed />}
            </Button>
            {role === 'manager' && sheetData.is_payble && (
              <EditableInput
                isOff
                style={{
                  minWidth: '100px',
                }}
                setEditingRow={setEditingRow}
                editingRow={editingRow}
                value={sheetData.off}
                onChange={value => handleChange(value, 'off')}
              />
            )}
          </div>
        </div>
        <div className={`${styles.buttons_block} ${editingRow ? '' : styles.padding__top}`}>
          <div className={styles.buttons}>
            {editingRow ? (
              <>
                <Button type="check" onClick={onSave}>
                  <IconCheck />
                </Button>
                <Button type="icon" onClick={onUndo}>
                  <IconUndo />
                </Button>
              </>
            ) : (
              <div className={styles.empty}></div>
            )}
          </div>
          <div className={styles.buttons}>
            {day.sheet_id && fill_mode === 'regular' && (
              <Button
                type="icon"
                onClick={() => {
                  setShowModal(true);
                }}>
                <IconDelete />
              </Button>
            )}
          </div>
        </div>
        {showModal && (
          <DeleteModal
            onDelete={() => onDelete()}
            onClose={() => setShowModal(false)}
            title="запись"
          />
        )}
      </TableRow>
    </StatusChecker>
  );
};

const mapStateToProps = (state: RootState) => ({
  user: selectUser(state),
  projectMembers: selectProjectMembers(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      patchSheets,
      createSheets,
      deleteSheets,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(memo(MemberSheetItem));
