import React from 'react';
import { Button as BootstrapButton } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

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

  if (link) {
    return (
      <Link to={link}>
        <BootstrapButton
          variant={variant}
          size={size}
          onClick={onClick}
          style={style}
          disabled={disabled}
          className={className}
        >
          {buttonContent}
        </BootstrapButton>
      </Link>
    );
  }

  return (
    <BootstrapButton
      variant={variant}
      size={size}
      onClick={onClick}
      type={type}
      style={style}
      disabled={disabled}
      className={className}
    >
      {buttonContent}
    </BootstrapButton>
  );
};

export default Button;