import {useDispatch} from 'react-redux';
import {AppDispatch} from 'store';

type DispatchFunc = () => AppDispatch;

const UseAppDispatch: DispatchFunc = useDispatch;
export default UseAppDispatch;
