import {useNavigate} from 'react-router-dom';

import {useEffect} from 'react';

import UseAppSelector from 'hooks/UseAppSelector';

const UseDepartmentRedirect = () => {
  const navigate = useNavigate();
  const currentOrgId = UseAppSelector(state => state.user.currentOrgId);
  const org = UseAppSelector(state => state.organizations.organizations).find(
    ({id}) => id === currentOrgId,
  );
  useEffect(() => {
    !org?.can_use_departments && navigate('/');
  }, [org?.can_use_departments, navigate]);
};

export default UseDepartmentRedirect;
