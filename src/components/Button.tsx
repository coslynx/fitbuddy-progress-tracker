import React, { FC, MouseEventHandler } from 'react';

interface ButtonProps {
  text: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'ghost' | string;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({
  text,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
}) => {
  // Validate props
  if (typeof text !== 'string' || text.trim() === '') {
    console.error('Button: Text prop must be a non-empty string.');
    return null;
  }
  if (typeof onClick !== 'function') {
    console.error('Button: onClick prop must be a function.');
    return null;
  }
  if (type !== 'button' && type !== 'submit') {
    console.error("Button: type prop must be 'button' or 'submit'.");
    return null;
  }
  if (typeof disabled !== 'boolean') {
    console.error('Button: disabled prop must be a boolean.');
    return null;
  }

  // Define base styles
  let baseStyles =
    'rounded px-4 py-2 text-white font-bold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-opacity-50';
  let variantStyles = '';

  // Apply variant styles
  switch (variant) {
    case 'primary':
      variantStyles = 'bg-primary hover:bg-primary-dark focus:ring-primary';
      break;
    case 'secondary':
      variantStyles = 'bg-secondary hover:bg-secondary-dark focus:ring-secondary';
      break;
      case 'ghost':
          variantStyles = 'bg-transparent text-text border border-gray-300 hover:bg-gray-100 focus:ring-gray-300';
          break;
    default:
      variantStyles = variant; // Allow custom classes
      break;
  }

  // Combine base and variant styles
  const buttonClasses = `${baseStyles} ${variantStyles}`;

  return (
    <button
      type={type}
      onClick={onClick}
      className={buttonClasses}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default Button;