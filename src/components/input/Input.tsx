import React, { ChangeEvent, useState } from 'react';
import classNames from 'classnames';
import styles from './Input.module.scss';
import Icon from '../icon/Icon';
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';

interface IInputProps {
    id: string;
    label: string;
    labelVisible?: boolean;
    icon?: 'letter' | 'lock' | 'show' | 'hide';
    type?: string;
    formatPrice?: boolean;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    required?: boolean;
    className?: string;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
    [x: string]: any;
}

const Input = ({
    id,
    label,
    labelVisible=true,
    icon,
    type='text',
    placeholder = '',
    readOnly,
    disabled,
    className = '',
    formatPrice,
    register,
    errors,
    required,
    ...restProps
}: IInputProps) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(
        type === 'password' ? false : true
    );

    const checkType = () => {
        if (type === 'email') {
            return 'email';
        } else if (type === 'password') {
            return isPasswordVisible ? 'text' : 'password';
        } else {
            return 'text';
        }
    };    

    const iconType = isPasswordVisible ? 'show' : 'hide';
    const iconLabel = `비밀번호 ${isPasswordVisible ? '표시' : '감춤'}`;

    return (
        <div className={classNames(styles['form-control'], className)}>
            <label
                htmlFor={id}
                className={classNames(
                    styles['label'],
                    labelVisible || styles['label-hidden']
                )}
            >
                {label}
            </label>
            <div
                className={classNames(
                    styles['input-wrapper'],
                    errors && styles['input-wrapper-error']
                )}
            >
                {formatPrice &&
                    <span className={styles['format-price']}>￦</span>
                }

                {icon ? <Icon type={icon} /> : null}

                <input
                    id={id}
                    type={checkType()}
                    className={classNames(styles['input'])}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    disabled={disabled}
                    {...register(id, { required })}
                    {...restProps}
                />

                {type === 'password' ? (
                    <button
                        type="button"
                        className={styles['button']}
                        onClick={() => setIsPasswordVisible((prev) => !prev)}
                        disabled={disabled}
                    >
                        <Icon
                            type={iconType}
                            alt={iconLabel}
                            title={iconLabel}
                        />
                    </button>
                ) : null}
            </div>
            {errors && (
                <span role="alert" className={styles['error']}>
                </span>
            )}
        </div>
    );
};

export default Input;
