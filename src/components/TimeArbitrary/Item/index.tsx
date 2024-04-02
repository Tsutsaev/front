import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import DeleteModal from 'components/DeleteModal';
import StatusChecker from 'components/StatusChecker';
import Button from 'components/new/Button';
import EditableDropdown from 'components/new/Dropdown/Editable/Dropdown';
import {DropdownSingleType} from 'components/new/Dropdown/Single/types';
import EditableDatePicker from 'components/new/Editable/DatePicker';
import EditableInput from 'components/new/Editable/Input';
import TableRow from 'components/new/Table/Row';
import {serverTimezone} from 'constants/TimeZone';
import {formatISO} from 'date-fns';
import {utcToZonedTime} from 'date-fns-tz';
import React, {useEffect, useMemo, useState} from 'react';
import {connect} from 'react-redux';
import {ReactComponent as IconCheck} from 'shared/assets/images/fi-rr-checkbox.svg';
import {ReactComponent as IconCopy} from 'shared/assets/images/fi-rr-copy.svg';
import {ReactComponent as IconDelete} from 'shared/assets/images/fi-rr-trash.svg';
import {ReactComponent as IconUndo} from 'shared/assets/images/fi-rr-undo-alt.svg';
import {ReactComponent as IconRubleRed} from 'shared/assets/images/ruble-svgrepo-com-red-crossed.svg';
import {ReactComponent as IconRuble} from 'shared/assets/images/ruble-svgrepo-com.svg';
import {RootState} from 'store';
import {selectProjectMembers} from 'store/projectMembers/selectors';
import {createSheets, deleteSheets, patchSheets} from 'store/sheet/actions';
import {selectUser} from 'store/user/selectors';
import {addDurationToDateTime} from 'utils/AddDurationToDateTime';
import {getDayColor} from 'utils/GetDayColor';
import {getOptionFromId} from 'utils/GetOptionFromString';
import {transformDropdownData} from 'utils/TransformDropdownData';
import styles from './index.module.scss';
import {Props, SheetData} from './types';

const TimeArbitratyItem = ({
  templateColumns,
  isNotDateFired,
  sheet,
  onCopy,
  offOther = false,
  projectMembers,
  user,
  patchSheets,
  deleteSheets,
}: Props) => {
  const {currentOrgId, role} = user;

  const {projMembers: projectMembersData, status: projectMembersStatus} = projectMembers;

  const labels = useMemo(() => transformDropdownData(projectMembersData), [projectMembersData]);

  const [sheetData, setSheetData] = useState<SheetData>({
    duration: sheet.duration.slice(0, -3) || '1:00',
    description: sheet.description || '',
    project: getOptionFromId(sheet.project?.id || null, labels),
    isPayment: sheet.is_payble,
    date: utcToZonedTime(sheet?.start_at, serverTimezone),
    off: sheet.off?.toString() || '0',
  });

  useEffect(() => {
    setSheetData({
      duration: sheet.duration.slice(0, -3) || '1:00',
      description: sheet.description || '',
      project: getOptionFromId(sheet.project?.id || null, labels),
      isPayment: sheet.is_payble,
      date: utcToZonedTime(sheet?.start_at, serverTimezone),
      off: sheet.off?.toString() || '0',
    });
  }, [sheet, labels, sheet.project?.id]);

  const [showModal, setShowModal] = useState(false);
  const [editingRow, setEditingRow] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleChange = (
    value: string | Date | number | DropdownSingleType,
    field: keyof SheetData,
  ) => {
    setSheetData(prev => ({...prev, [field]: value}));
  };

  const onDelete = () => {
    if (sheet)
      deleteSheets({
        orgId: currentOrgId,
        id: sheet.id,
      });

    setShowModal(false);
  };

  const onUndo = () => {
    setSheetData({
      duration: sheet.duration.slice(0, -3) || '1:00',
      description: sheet.description || '',
      project: getOptionFromId(sheet.project?.id || null, labels),
      isPayment: sheet.is_payble,
      date: new Date(sheet?.start_at),
      off: sheet.off?.toString() || '0',
    });
    setEditingRow(false);
    setIsError(false);
  };

  const onSave = () => {
    if (isNotDateFired(sheetData.date)) {
      if (sheetData.description || offOther) {
        setEditingRow(false);
        setIsError(false);
        if (sheet) {
          const adjustedISODate = formatISO(sheetData.date);
          const finalISODate = `${adjustedISODate.slice(0, -6)}+03:00`;

          patchSheets({
            orgId: currentOrgId,
            id: sheet.id,
            data: {
              project_id: sheetData.project ? Number(sheetData.project.value) : null,
              description: sheetData.description,
              start_at: finalISODate,
              end_at: addDurationToDateTime(finalISODate, sheetData.duration),
              duration: `${sheetData.duration}:00`,
              off: Number(sheetData.off),
              is_payble: sheetData.isPayment,
            },
          });
        }
      } else {
        setIsError(true);
      }
    }
  };

  return (
    <StatusChecker statusArray={[projectMembersStatus]}>
      <TableRow
        color={getDayColor(utcToZonedTime(sheet.start_at, serverTimezone))}
        templateColumns={templateColumns}>
        <EditableDatePicker
          setEditingRow={setEditingRow}
          editingRow={editingRow}
          selectedDate={sheetData.date}
          setSelectedDate={value => handleChange(value, 'date')}
        />

        <EditableInput
          isTime
          style={{minWidth: '70px'}}
          value={sheetData.duration}
          onChange={value => handleChange(value, 'duration')}
          setEditingRow={setEditingRow}
          editingRow={editingRow}
        />

        {offOther ? (
          <div onClick={() => setEditingRow(true)} className={styles.off__other}>
            <p className={styles.text} dangerouslySetInnerHTML={{__html: sheetData.description}} />
          </div>
        ) : (
          <EditableInput
            isMultiline
            handleEnter={isNotDateFired(sheetData.date) ? onSave : () => {}}
            handleEsc={onUndo}
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
            handleChange={value => handleChange(value, 'project')}
            labels={labels}
          />

          <div className={styles.money}>
            <button
              onClick={() => {
                setEditingRow(true);
                setSheetData(prev => ({...prev, isPayment: !prev.isPayment}));
              }}
              className={`${styles.button} `}>
              {sheetData.isPayment ? <IconRuble /> : <IconRubleRed />}
            </button>
            {role === 'manager' && sheetData.isPayment && (
              <EditableInput
                isOff
                style={{width: '110px', minWidth: '110px'}}
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
            {editingRow && isNotDateFired ? (
              <>
                <Button type="check" onClick={isNotDateFired(sheetData.date) ? onSave : () => {}}>
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
            {onCopy && (
              <Button
                type="icon"
                onClick={() =>
                  onCopy(
                    sheetData.project,
                    sheetData.duration,
                    sheetData.description,
                    sheetData.isPayment,
                  )
                }>
                <IconCopy />
              </Button>
            )}
            <Button type="icon" onClick={() => setShowModal(true)}>
              <IconDelete />
            </Button>
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
      deleteSheets,
      patchSheets,
      createSheets,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(TimeArbitratyItem);
