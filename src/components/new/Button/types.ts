import React from 'react';

export type ButtonType = 'submit' | 'reset' | 'icon' | 'check' | 'disabled';

interface ButtonProps {
  type: ButtonType;
  onClick?: () => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
}
export default ButtonProps;
