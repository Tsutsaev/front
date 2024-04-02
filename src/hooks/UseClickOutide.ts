import {useEffect, RefObject} from 'react';

const UseClickOutside = <T extends HTMLElement>(ref: RefObject<T>, callback: () => void) => {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    if (ref.current) document.addEventListener('mousedown', handleClickOutside);
    else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
};

export default UseClickOutside;
