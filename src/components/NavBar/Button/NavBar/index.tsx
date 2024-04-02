import React, {MouseEvent, useMemo, useState} from 'react';
import {ReactComponent as DownArrow} from 'shared/assets/images/fi-rr-caret-down.svg';
import styles from './index.module.scss';
import {INavBarButton} from './types';
import DropdownAction from 'components/new/Dropdown/Action';

const classNameList = {
  ['sidebar']: styles.sidebar__button,
  ['navbar']: styles.button,
};

const NavBarButton = ({image, title, buttons, style, variant}: INavBarButton) => {
  const [isDropdownShown, setIsDropdownShown] = useState(false);
  const toggleDropdown = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsDropdownShown(prev => !prev);
  };

  const classList = useMemo(() => classNameList[variant] || '', [variant]);

  return (
    <div className={styles.container}>
      <button style={style} onClick={e => toggleDropdown(e)} className={classList}>
        <div className={styles.sidebar__button__section}>
          {image} <p>{title.length > 30 ? title.slice(0, 30) + '...' : title}</p>
        </div>
        {<DownArrow />}
      </button>
      {isDropdownShown && (
        <DropdownAction
          position={variant === 'sidebar' ? 'right' : 'down'}
          active={title}
          setIsOpen={setIsDropdownShown}
          buttons={buttons}
          avatar={!!image}
        />
      )}
    </div>
  );
};

export default NavBarButton;
