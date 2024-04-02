import React, {useEffect, useState} from 'react';
import styles from './index.module.scss';
import {ReactComponent as IconPortrait} from 'shared/assets/images/fi-rr-portrait.svg';
import UseAppDispatch from 'hooks/UseAppDispatch';
import {logoutUser, setCurrentOrgId} from 'store/user/slice';
import UseAppSelector from 'hooks/UseAppSelector';
import {getAllOrganizations} from 'store/organizations/actions';
import Loader from 'shared/uIkit/Loader';
import NavBarButton from './Button/NavBar';
import {IOrganization} from 'store/organizations/types';
import {getProjectsByOrg} from 'store/projects/actions';
import {getUser} from 'store/user/actions';
import {useNavigate} from 'react-router-dom';

const Navbar = () => {
  const dispatch = UseAppDispatch();
  const navigate = useNavigate();
  const {data: profile, currentOrgId} = UseAppSelector(state => state.user);
  const organizations = UseAppSelector(state => state.organizations.organizations);
  const status = UseAppSelector(state => state.organizations.status);
  const [currentOrg, setCurrentOrg] = useState<IOrganization | undefined | null>(null);
  useEffect(() => {
    void dispatch(getAllOrganizations());

    void dispatch(getUser());
  }, []);

  useEffect(() => {
    setCurrentOrg(organizations.find(org => org.id === currentOrgId));
  }, [organizations, currentOrgId]);

  const handleButtonCompany = (organization: IOrganization) => {
    localStorage.setItem('org', organization.id.toString());
    dispatch(setCurrentOrgId(organization.id));
    setCurrentOrg(organization);
    void dispatch(getProjectsByOrg(organization.id));
  };

  const buttonsProfile = [
    {
      title: 'Профиль',
      onClick: () => {
        navigate('/me');
      },
    },
    {
      title: 'Выход',
      onClick: () => {
        localStorage.clear();
        dispatch(logoutUser());
      },
    },
  ];

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
  if (status === 'failed') {
    return <div>Произошла ошибка</div>;
  }

  if (status === 'loading') {
    return <Loader />;
  }

  return (
    <div className={styles.navbar}>
      <NavBarButton
        variant={'navbar'}
        title={profile.fio || profile.email}
        buttons={buttonsProfile}
        image={profile.avatar ? <img src={profile.avatar} alt="#" /> : <IconPortrait />}
      />
    </div>
  );
};

export default Navbar;
