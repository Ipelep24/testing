'use client'
import { Eye, EyeClosed } from 'lucide-react'
import React, { useState } from 'react'

interface PasswordInputProps {
    id?: string
    label: string
    name: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    touched: boolean
    error: boolean
    errorMessage?: string
    autoComplete?: string
}

const PasswordInput = ({
    label,
    name,
    value,
    onChange,
    touched,
    error,
    errorMessage,
    autoComplete
}: PasswordInputProps) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
        <div className='flex flex-col text-[#64717E] w-full my-2 relative'>
            <label htmlFor={name} className='text-sm'>{label}</label>
            <div className='relative'>
                <input
                    suppressHydrationWarning
                    id={name}
                    className={`border p-1 rounded-sm text-sm w-full pr-10 focus:outline-2 ${touched
                        ? error
                            ? 'border-red-500 outline-red-500 text-red-500 animate-shake'
                            : 'border-green-500 outline-green-500 text-green-600'
                        : 'border-black outline-[#384959] text-black'
                        }`}
                    type={showPassword ? 'text' : 'password'}
                    name={name}
                    value={value}
                    onChange={onChange}
                    autoComplete={autoComplete}
                />
                <button
                suppressHydrationWarning
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#384959] hover:text-[#1281E9]"
                >
                    {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
                </button>

            </div>
            {touched && error && errorMessage && (
                <div className='absolute -bottom-4 left-0 text-xs text-red-500 fade-in'>
                    <p>{errorMessage}</p>
                </div>
            )}
        </div>
    )
}

export default PasswordInput
