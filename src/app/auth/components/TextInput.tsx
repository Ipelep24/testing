import React from 'react'

interface TextInputProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  touched: boolean
  error: boolean
  errorMessage?: string
  type?: string
  autoComplete?: string
}

const TextInput = ({
  label,
  name,
  value,
  onChange,
  touched,
  error,
  errorMessage,
  type = 'text',
  autoComplete = 'off',
}: TextInputProps) => {
  return (
    <div className='flex flex-col text-[#64717E] w-full my-2 relative'>
      <label htmlFor={name} className='text-sm'>{label}</label>
      <input
        className={`border p-1 rounded-sm text-sm w-full focus:outline-2 ${
          touched
            ? error
              ? 'border-red-500 outline-red-500 text-red-500 animate-shake'
              : 'border-green-500 outline-green-500 text-green-600'
            : 'border-black outline-[#384959] text-black'
        }`}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
      />
      {touched && error && errorMessage && (
        <div className='absolute -bottom-4 left-0 text-xs text-red-500 fade-in truncate'>
          <p>{errorMessage}</p>
        </div>
      )}
    </div>
  )
}

export default TextInput
