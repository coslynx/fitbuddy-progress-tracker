import React, {
  FC,
  ChangeEventHandler,
  useState,
  forwardRef,
  InputHTMLAttributes,
  useImperativeHandle,
  Ref,
} from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'date';
  placeholder?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  customClasses?: string;
}

const Input = forwardRef(
  (
    {
      label,
      id,
      name,
      type = 'text',
      placeholder,
      value,
      onChange,
      error,
      required = false,
      disabled = false,
      customClasses,
      ...rest
    }: InputProps,
    ref: Ref<HTMLInputElement>,
  ) => {
    const [internalError, setInternalError] = useState<string | undefined>(
      error,
    );

    // Validate props
    if (typeof id !== 'string' || id.trim() === '') {
      console.error('Input: id prop must be a non-empty string.');
      return null;
    }

    if (typeof name !== 'string' || name.trim() === '') {
      console.error('Input: name prop must be a non-empty string.');
      return null;
    }

    if (
      type !== 'text' &&
      type !== 'email' &&
      type !== 'password' &&
      type !== 'number' &&
      type !== 'tel' &&
      type !== 'date'
    ) {
      console.error(
        "Input: type prop must be 'text', 'email', 'password', 'number', 'tel' or 'date'.",
      );
      return null;
    }

    if (placeholder && typeof placeholder !== 'string') {
      console.error('Input: placeholder prop must be a string.');
      return null;
    }

    if (value && typeof value !== 'string') {
        console.error('Input: value prop must be a string.');
      return null;
    }

    if (onChange && typeof onChange !== 'function') {
        console.error('Input: onChange prop must be a function.');
        return null;
      }

    if (error && typeof error !== 'string') {
      console.error('Input: error prop must be a string.');
      return null;
    }

    if (typeof required !== 'boolean') {
      console.error('Input: required prop must be a boolean.');
      return null;
    }
      if (typeof disabled !== 'boolean') {
        console.error('Input: disabled prop must be a boolean.');
        return null;
    }

    const defaultStyles =
      'border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary';

    const inputClasses = customClasses
      ? `${defaultStyles} ${customClasses}`
      : defaultStyles;

    // Update internal error state when error prop changes
    if (error !== internalError) {
      setInternalError(error);
    }

    useImperativeHandle(ref, () => ({
      focus: () => {
          if (ref && 'current' in ref && ref.current) {
          ref.current.focus();
        }
      },
    }));

    return (
      <div className="mb-4">
        {label && (
          <label htmlFor={id} className="block text-gray-700 text-sm font-bold mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value || ''}
          onChange={onChange}
          className={inputClasses}
          required={required}
          disabled={disabled}
          aria-invalid={!!internalError}
          aria-describedby={internalError ? `${id}-error` : undefined}
          {...rest}
        />
        {internalError && (
          <p id={`${id}-error`} className="text-red-500 text-xs mt-1">
            {internalError}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;