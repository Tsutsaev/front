import TagsDropdownListItem from 'components/new/TagsDropdown/ListItem';
import DropdownTag from 'components/new/TagsDropdown/Tag';
import TagsDropdownTextInput from 'components/new/TagsDropdown/TextInput';
import React, {useEffect, useRef, useState} from 'react';
import styles from './index.module.css';

interface TagsDropdownProps {
  placeholder?: string;
  style?: React.CSSProperties;
  onChange: (value: string[]) => void;
  options: string[];
  defaultValue?: string[];
  isFocus?: boolean;
  mode?: 'single' | 'multi';
}

const TagsDropdown = ({
  placeholder,
  style,
  onChange,
  options,
  defaultValue,
  isFocus,
  mode = 'multi',
}: TagsDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeDropdown = () => setIsOpen(false);
  const [value, setValue] = useState<string[]>(defaultValue || []);
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownOptions, setDropdownOptions] = useState<string[]>([]);

  useEffect(() => {
    setDropdownOptions(options);
  }, [options]);

  const addTagToValue = (tag: string) => {
    if (mode === 'single') {
      setValue([tag]);
      onChange([tag]);
      setDropdownOptions(() => options.filter(prevTag => prevTag !== tag));
    } else {
      if (!value.includes(tag)) {
        setValue(prevState => [...prevState, tag]);
        setDropdownOptions(prevState => prevState.filter(prevTag => prevTag !== tag));
        onChange([...value, tag]);
      }
    }
  };

  const removeTagFromValue = (tag: string) => {
    if (mode === 'single') {
      setValue([]);
      setDropdownOptions(prevState => [...prevState, tag]);
      onChange([]);
    } else {
      if (!dropdownOptions.includes(tag)) {
        setDropdownOptions(prevState => [...prevState, tag]);
      }
      setValue(prevState => prevState.filter(prevTag => prevTag !== tag));
      onChange(value.filter(prevTag => prevTag !== tag));
    }
  };

  const toggleDropdown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    setIsOpen(prevState => !prevState);
  };

  useEffect(() => {
    if (isFocus) {
      setIsOpen(true);
    }
  }, [isFocus]);

  useEffect(() => {
    document.addEventListener('click', closeDropdown);

    if (inputRef.current !== null) {
      inputRef.current.focus();
    }

    return () => document.removeEventListener('click', closeDropdown);
  }, [isOpen]);

  if (!isOpen)
    return (
      <div style={style}>
        <div
          className={styles.dropdown__tags__container}
          onClick={event => toggleDropdown(event)}
          style={{
            borderColor: 'rgba(24, 24, 29, 0.14)',
          }}>
          {!value.length && placeholder}
          {value.map(tag => (
            <DropdownTag key={tag} value={tag} onClick={() => removeTagFromValue(tag)} />
          ))}
        </div>
      </div>
    );

  return (
    <div style={style}>
      <div
        style={{border: '1px solid #2684ff'}}
        className={styles.dropdown__tags__container}
        onClick={event => event.stopPropagation()}>
        {value.map(tag => (
          <DropdownTag key={tag} value={tag} onClick={() => removeTagFromValue(tag)} />
        ))}
        <TagsDropdownTextInput onKeyPress={addTagToValue} ref={inputRef} />
      </div>
      {!!dropdownOptions.length && (
        <section className={styles.tags_dropdown__list} style={style}>
          {dropdownOptions?.map(tag => (
            <TagsDropdownListItem
              onClick={() => {
                addTagToValue(tag);
              }}
              key={tag}
              tag={tag}
            />
          ))}
        </section>
      )}
    </div>
  );
};

export default TagsDropdown;
