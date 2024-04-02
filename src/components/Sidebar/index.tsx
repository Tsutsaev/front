import NavBarButton from 'components/NavBar/Button/NavBar';
import UseAppDispatch from 'hooks/UseAppDispatch';
import UseAppSelector from 'hooks/UseAppSelector';
import React, {useEffect, useState} from 'react';
import {Link, NavLink, useLocation, useNavigate} from 'react-router-dom';
import {ReactComponent as BalloonsIcon} from 'shared/assets/images/fi-rr-balloons.svg';
import {ReactComponent as IconCompany} from 'shared/assets/images/fi-rr-bank.svg';
import {ReactComponent as ConnectedIcon} from 'shared/assets/images/fi-rr-chart-connected.svg';
import {ReactComponent as ChartTreeIcon} from 'shared/assets/images/fi-rr-chart-tree.svg';
import {ReactComponent as ClockIcon} from 'shared/assets/images/fi-rr-clock.svg';
import {ReactComponent as FileIcon} from 'shared/assets/images/fi-rr-file.svg';
import {ReactComponent as LayersIcon} from 'shared/assets/images/fi-rr-layers.svg';
import {ReactComponent as TelegramIcon} from 'shared/assets/images/fi-rr-paper-plane.svg';
import {ReactComponent as PortraitIcon} from 'shared/assets/images/fi-rr-portrait.svg';
import {ReactComponent as VacationIcon} from 'shared/assets/images/fi-rr-sunrise.svg';
import {ReactComponent as TextIcon} from 'shared/assets/images/fi-rr-text.svg';
import {ReactComponent as SupportIcon} from 'shared/assets/images/fi-rr-comments.svg';
import {ReactComponent as UploadIcon} from 'shared/assets/images/fi-rr-upload.svg';
import {getAllOrganizations} from 'store/organizations/actions';
import {IOrganization} from 'store/organizations/types';
import {getProjectsByOrg} from 'store/projects/actions';
import {getUser} from 'store/user/actions';
import {setCurrentOrgId, setSheetOff} from 'store/user/slice';
import styles from './index.module.scss';
import MainLogo from 'shared/assets/images/billedpro_ logo_png.png';
import SupportModal from 'components/Modal/Support';
import {IApiResponse, baseURL, instance} from 'shared';
import {IOrgMembers} from 'store/orgMembers/types';

const Sidebar = () => {
  const user = UseAppSelector(state => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = UseAppDispatch();
  const organizations = UseAppSelector(state => state.organizations.organizations);

  const [currentOrg, setCurrentOrg] = useState<IOrganization | undefined | null>(null);
  const [shownModal, setShownModal] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      if (currentOrg?.id) {
        const response = await instance.get<IApiResponse<IOrgMembers>>(
          `/${currentOrg?.id}/org_member/?profile=${user.data.id}`,
        );

        if (response.data.results[0]) {
          void dispatch(setSheetOff(response.data.results[0].sheet_off));
        }
      }
    };

    void fetchData();
    void dispatch(getAllOrganizations());

    void dispatch(getUser());
  }, [currentOrg?.id, dispatch, user.data.id]);

  useEffect(() => {
    setCurrentOrg(organizations.find(org => org.id === user.currentOrgId));
  }, [organizations, user.currentOrgId]);

  const handleButtonCompany = (organization: IOrganization) => {
    localStorage.setItem('org', organization.id.toString());
    dispatch(setCurrentOrgId(organization.id));
    setCurrentOrg(organization);
    void dispatch(getProjectsByOrg(organization.id));
  };

  const organizationButtons = organizations.map(organization => ({
    title: organization.name,
    onClick: () => handleButtonCompany(organization),
  }));

  if (currentOrg?.tarif === 3) {
    organizationButtons.push({
      title: 'Создать организацию',
      onClick: () => {
        navigate('/organization/create');
      },
    });
  }

  const onSave = (question: string) => {
    const text =
      'URL адрес страницы, на которой находится пользователь: ' +
      baseURL.replace('/api/v2/', '') +
      location.pathname +
      location.search +
      '\n' +
      'Вопрос: ' +
      question;

    void instance.post('support/', {
      profile_id: Number(user.data.id),
      text,
    });
  };

  return (
    <div className={styles.area}>
      <div className={styles.container}>
        <div className={styles.top__container}>
          <Link to={'/time'}>
            <img src={MainLogo} alt={'billed.pro'} style={{width: '155px'}} />
          </Link>
        </div>

        <nav className={styles.nav__list}>
          {user.sheetOff && (
            <NavLink
              className={({isActive}) => (isActive ? styles.active : styles.link)}
              to={'/time'}>
              <ClockIcon /> Время
            </NavLink>
          )}
          {user.role === 'manager' ? (
            <>
              <b className={styles.area__title}>Отчеты</b>
              <NavLink
                className={({isActive}) => (isActive ? styles.active : styles.link)}
                to={'/monitoring'}>
                <ClockIcon /> Мониторинг
              </NavLink>
              <NavLink
                className={({isActive}) => (isActive ? styles.active : styles.link)}
                to={'/org_member_report'}>
                <ConnectedIcon /> Сотрудники
              </NavLink>
              <NavLink
                className={({isActive}) => (isActive ? styles.active : styles.link)}
                to={'/report_project'}>
                <LayersIcon /> Проекты
              </NavLink>

              <NavLink
                className={({isActive}) => (isActive ? styles.active : styles.link)}
                to={'/summary'}>
                <FileIcon /> Общий
              </NavLink>
              <NavLink
                className={({isActive}) => (isActive ? styles.active : styles.link)}
                to={'/export'}>
                <UploadIcon /> Экспорт
              </NavLink>
              <b className={styles.area__title}>Управление</b>
              <NavLink
                className={({isActive}) => (isActive ? styles.active : styles.link)}
                to={'/organization'}>
                <ChartTreeIcon /> Организация
              </NavLink>
            </>
          ) : null}

          {(user.role === 'manager' || currentOrg?.access_profile) && (
            <NavLink
              className={({isActive}) => (isActive ? styles.active : styles.link)}
              to={'/organizationmember'}>
              <ConnectedIcon /> Сотрудники
            </NavLink>
          )}

          {(user.role === 'manager' || currentOrg?.access_client) && (
            <NavLink
              className={({isActive}) => (isActive ? styles.active : styles.link)}
              to={'/client'}>
              <PortraitIcon /> Клиенты
            </NavLink>
          )}
          {(user.role === 'manager' || currentOrg?.access_project) && (
            <NavLink
              className={({isActive}) => (isActive ? styles.active : styles.link)}
              to={'/project'}>
              <LayersIcon /> Проекты
            </NavLink>
          )}

          {(user.role === 'manager' || currentOrg?.access_rest) && (
            <NavLink
              className={({isActive}) => (isActive ? styles.active : styles.link)}
              to={'/rest'}>
              <VacationIcon /> Отсутствия
            </NavLink>
          )}
          {(user.role === 'manager' || currentOrg?.access_holiday) && (
            <NavLink
              className={({isActive}) => (isActive ? styles.active : styles.link)}
              to={'/holidays'}>
              <BalloonsIcon />
              Праздники
            </NavLink>
          )}
          {user.role === 'manager' ? (
            <NavLink
              className={({isActive}) => (isActive ? styles.active : styles.link)}
              to={'/tags'}>
              <TextIcon />
              Тэги
            </NavLink>
          ) : null}
          <b className={styles.area__title}>Ссылки</b>
          <NavLink className={styles.link} to={'https://t.me/iTimeSheetBot'}>
            <TelegramIcon /> Telegram Бот
          </NavLink>

          <button
            className={styles.link}
            onClick={() => {
              setShownModal(true);
            }}>
            <SupportIcon /> Задать вопрос
          </button>
        </nav>

        <div className={styles.organization__area}>
          <b className={styles.area__title}>Организация</b>

          <div className={styles.profile__area}>
            <NavBarButton
              variant={'sidebar'}
              title={currentOrg?.name || 'Организация не выбрана'}
              buttons={organizationButtons}
              image={<IconCompany />}
            />
          </div>
        </div>
      </div>

      {shownModal && <SupportModal onSave={onSave} onClose={() => setShownModal(false)} />}
    </div>
  );
};

export default Sidebar;
