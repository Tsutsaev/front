import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import UseAppSelector from 'hooks/UseAppSelector';

const UseRoleRedirect = () => {
  const navigate = useNavigate();
  const userRole = UseAppSelector(state => state.user.role); // Замените на ваш селектор для роли пользователя

  useEffect(() => {
    if (userRole !== 'manager') {
      navigate('/');
    }
  }, [userRole, navigate]);
};

export default UseRoleRedirect;
