import React from 'react'
import { FieldValues, UseFormRegister, FieldErrors } from 'react-hook-form';

interface IInputProps {
  id: string;
  label?: string;
  type?: string;
  step?: string;
  defaultValue?: string | number;
  disabled?: boolean;
  formatPrice?: boolean;
  required?: boolean;
  register: UseFormRegister<FieldValues>;
  errors: FieldErrors
}

const Input: React.FC<IInputProps> = ({ 
  id,
  label,
  type="text",
  step,
  defaultValue,
  disabled,
  formatPrice,
  register,
  required,
  errors

}) => {
  return (
    <div className='relative w-full'>
      {formatPrice &&
        <span className='absolute etxt-neutral-700 top-5 left-2'>￦</span>
      }
      <input 
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        placeholder=''
        type={type}
        step={step}
        defaultValue={defaultValue}
        className={`
          w-full
          p-4
          pt-6
          font-light
          border-2
          bg-white
          rounded-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          ${formatPrice ? 'pl-9' : 'pl-4'}
          ${errors[id] ? 'border-rose-500' : 'border-neutral-300'}
          ${errors[id] ? 'focus:border-rose-500' : 'focus:border-black'}
        `}
      />
      <label
        className={`
          absolute
          text-md
          duration-150
          -translate-y-3
          top-5
          z-10
          origin-[0]
          ${formatPrice ? 'left-9' : 'left-4'}
          peer-placeholder-shown:scale-100
          peer-placeholder-shown:translate-y-0
          peer-focus:scale-75
          peer-focus:-translate-y-4
          ${errors[id] ? 'text-rose-500' : 'text-zinc-400'}
        `}
      >
        {label}
      </label>
    </div>
  )
}

export default Input