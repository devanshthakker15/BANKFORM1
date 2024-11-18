import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Link } from 'react-router-dom';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'link' | 'outline-primary';
  size?: 'sm' | 'lg';
  icon?: IconDefinition;
  text?: string;
  link?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size,
  icon,
  text,
  link,
  onClick,
  type = 'submit',
  disabled = false,
  style = {},
  className,
  children,
}) => {
  const buttonContent = (
    <>
      {icon && <FontAwesomeIcon icon={icon} />}
      {text || children}
    </>
  );

  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    size && `btn-${size}`,
    className,
  ].filter(Boolean).join(' ');

  if (link) {
    return (
      <Link to={link}>
        <button
          type="button"
          className={buttonClasses}
          style={style}
          disabled={disabled}
        >
          {buttonContent}
        </button>
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={buttonClasses}
      style={style}
      disabled={disabled}
      onClick={onClick}
    >
      {buttonContent}
    </button>
  );
};

export default Button;