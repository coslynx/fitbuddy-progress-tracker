import React, { FC, useState, FormEvent, useRef, useEffect } from 'react';
import Input from './Input';
import Button from './Button';
import useAuth from '../hooks/useAuth';

interface AuthFormProps {
}

interface FormFields {
    username: string;
    email?: string;
    password: string;
}

const AuthForm: FC<AuthFormProps> = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [form, setForm] = useState<FormFields>({
        username: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const { login, loading, error, isAuthenticated } = useAuth();

    const inputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, []);

    const validateEmail = (email: string): string | undefined => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return 'Invalid email format';
        }
        return undefined;
    };

    const validatePassword = (password: string): string | undefined => {
          if (password.length < 8) {
            return 'Password must be at least 8 characters long';
          }
          if (!/[a-z]/.test(password)) {
            return 'Password must contain at least one lowercase letter';
          }
          if (!/[A-Z]/.test(password)) {
            return 'Password must contain at least one uppercase letter';
          }
          if (!/[0-9]/.test(password)) {
              return 'Password must contain at least one number';
          }
          return undefined;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prevForm) => ({
            ...prevForm,
            [name]: value,
        }));
          setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }));
    };

     const handleSubmit = async (e: FormEvent) => {
            e.preventDefault();
             setErrors({});

        let validationErrors: { [key: string]: string } = {};
        if (isLoginMode) {
            if (!form.username.trim()) {
                validationErrors.username = 'Username is required';
            }
            if (!form.password.trim()) {
                 validationErrors.password = 'Password is required';
            }
        } else {
          if (!form.username.trim()) {
            validationErrors.username = 'Username is required';
          }
          if (!form.email?.trim()) {
                validationErrors.email = 'Email is required';
          } else {
                const emailError = validateEmail(form.email);
                if(emailError){
                  validationErrors.email = emailError;
                }
          }
            const passwordError = validatePassword(form.password);
            if (!form.password.trim()) {
              validationErrors.password = 'Password is required';
          }
          else if(passwordError){
              validationErrors.password = passwordError
          }
        }

        if(Object.keys(validationErrors).length > 0){
            setErrors(validationErrors)
            return
        }

        try {
            if (isLoginMode) {
               await login({ username: form.username, password: form.password });
            } else {
               // Registration logic will go here later
            }
        } catch (apiError: any) {
            setErrors({ form: apiError?.message || 'Authentication failed' });
              // Log the error for debugging
            console.error('Authentication failed:', apiError);
        }
        
    };

    const toggleMode = () => {
        setIsLoginMode((prevMode) => !prevMode);
          setForm({ username: '', email: '', password: '' });
          setErrors({});
    };


    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-background rounded shadow-md">
             <h2 className="text-2xl font-semibold mb-6 text-center text-text">
                  {isLoginMode ? 'Login' : 'Register'}
             </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Username"
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    value={form.username}
                    onChange={handleChange}
                    error={errors.username}
                    required
                    ref={inputRef}
                />
                {!isLoginMode && (
                  <Input
                    label="Email"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                  />
                )}
                <Input
                    label="Password"
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    error={errors.password}
                    required
                />
                {errors.form && (
                  <p className="text-red-500 text-xs mt-1">{errors.form}</p>
                )}
                 <Button
                    type="submit"
                    text={isLoginMode ? 'Login' : 'Register'}
                    variant="primary"
                    disabled={loading}
                  />
                  <div className="text-center mt-4">
                      <Button
                            type="button"
                            text={
                              isLoginMode
                                ? 'Create an account'
                                : 'Already have an account?'
                            }
                            onClick={toggleMode}
                            variant="ghost"
                          />
                  </div>
            </form>
        </div>
    );
};

export default AuthForm;