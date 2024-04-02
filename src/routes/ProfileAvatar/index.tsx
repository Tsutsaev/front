import {Dispatch, bindActionCreators} from '@reduxjs/toolkit';
import React, {useRef} from 'react';
import {connect} from 'react-redux';
import {patchMyProfileAvatar} from 'store/Profile/actions';

import {ReactComponent as PortraitIcon} from 'shared/assets/images/fi-rr-portrait.svg';

import styles from './index.module.scss';
import {Props} from './types';

const ProfileAvatar = ({userData, patchMyProfileAvatar}: Props) => {
  const {avatar, id} = userData;
  const fileRef = useRef<HTMLInputElement | null>(null);
  const handleUpdateImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      patchMyProfileAvatar({id: id, avatar: file});
    }
  };
  return (
    <div className={styles.avatar} onClick={() => fileRef.current?.click()}>
      {avatar ? <img src={avatar} alt="avatar" /> : <PortraitIcon />}
      <input
        ref={fileRef}
        accept=".png, .jpeg, .jpg, .mbp"
        type="file"
        className={styles.file}
        onChange={handleUpdateImage}
      />
    </div>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      patchMyProfileAvatar: patchMyProfileAvatar,
    },
    dispatch,
  );
export default connect(null, mapDispatchToProps)(ProfileAvatar);
