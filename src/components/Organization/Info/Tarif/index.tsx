import {useLocation} from 'react-router-dom';

import {differenceInSeconds, formatDuration, intervalToDuration} from 'date-fns';
import {ru} from 'date-fns/locale';
import React, {useEffect, useState} from 'react';
import {instance} from 'shared';

import TarifModal from 'components/Modal/Tarif';
import SingleDropdown from 'components/new/Dropdown/Single';
import {DropdownSingleType} from 'components/new/Dropdown/Single/types';
import TableInfoRow from 'components/new/Table/Info/Row';

import {labelsFills} from './data';
import styles from './index.module.scss';
import {OrganizationInfoTarifProps} from './types';

const OrganizationInfoTarif = ({
  initialState,
  created_at,
  is_trial,
  orgId,
  is_tarif_requested,
}: OrganizationInfoTarifProps) => {
  const [fillType, setFillType] = useState<DropdownSingleType>(
    labelsFills.find(item => item.value === initialState.toString()) || labelsFills[0],
  );

  const location = useLocation();

  const [timeRemaining, setTimeRemaining] = useState<string | null>('');

  const [shownModal, setShownModal] = useState(false);
  const [isTarifChange, setIsTarifChange] = useState(is_tarif_requested);

  useEffect(() => {
    const trialStartDate = new Date(created_at);
    const trialEndDate = new Date(trialStartDate);
    trialEndDate.setDate(trialStartDate.getDate() + 30); // Пробный период - 30 дней

    const interval = setInterval(() => {
      const currentTime = new Date();
      const remainingTimeInSeconds = differenceInSeconds(trialEndDate, currentTime);

      if (remainingTimeInSeconds <= 0) {
        clearInterval(interval);
        setTimeRemaining(null);
      } else {
        const duration = intervalToDuration({start: currentTime, end: trialEndDate});
        const remainingTimeFormatted = formatDuration(duration, {
          locale: ru,
        });

        setTimeRemaining(remainingTimeFormatted);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [created_at]);

  useEffect(() => {
    if ((location.state as {isPaymentTarif: boolean})?.isPaymentTarif) {
      setShownModal(true);
    }
  }, [location.state, location.pathname]);

  const onSave = async (comment: string) => {
    if (fillType) {
      const dataTarif = {
        organization: orgId,
        tarif_id: fillType.value,
        comment,
      };
      await instance.post(`/${orgId}/tarif/`, dataTarif);
      setIsTarifChange(true);
    }
  };

  const onUndo = () => {
    setFillType(labelsFills.find(item => item.value === initialState.toString()) || labelsFills[0]);
  };

  const handleChange = (fillType: DropdownSingleType) => {
    setFillType(fillType);
  };

  return (
    <>
      <TableInfoRow
        title={`Действующий тариф ${isTarifChange ? '(Проверяется)' : ''}`}
        value={fillType?.label}
        onUndo={onUndo}
        onSave={() => setShownModal(true)}>
        <SingleDropdown
          isFocus
          width={500}
          handleChange={handleChange}
          value={fillType}
          labels={labelsFills}
          isClearable={false}
        />
      </TableInfoRow>

      {is_trial && (
        <div className={styles.row}>
          <div className={styles.title}>До окончания пробного периода:</div>
          <div className={`${styles.text} ${!timeRemaining ? styles.error : ''}`}>
            {timeRemaining || 'Пробный период закончился'}
          </div>
        </div>
      )}

      {shownModal && <TarifModal onSave={onSave} onClose={() => setShownModal(false)} />}
    </>
  );
};

export default OrganizationInfoTarif;
