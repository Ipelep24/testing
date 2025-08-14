'use client'
import Link from 'next/link'
import React, { useState, useEffect, use } from 'react'
import TextInput from './TextInput'
import PasswordInput from './PasswordInput'
import { isPasswordMatch, isValidEmail, isValidName, isValidPassword } from '../validators'

interface Props {
  mode: 'signin' | 'signup'
}

const SignupForm = ({ mode }: Props) => {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [firstNameError, setFirstNameError] = useState<boolean>(false)
  const [firstNameTouched, setFirstNameTouched] = useState<boolean>(false)
  const [lastNameError, setLastNameError] = useState<boolean>(false)
  const [lastNameTouched, setLastNameTouched] = useState<boolean>(false)
  const [emailError, setEmailError] = useState<boolean>(false)
  const [emailTouched, setEmailTouched] = useState<boolean>(false)
  const [passwordError, setPasswordError] = useState<boolean>(false)
  const [passwordTouched, setPasswordTouched] = useState<boolean>(false)
  const [confirmError, setConfirmError] = useState<boolean>(false)
  const [confirmTouched, setConfirmTouched] = useState<boolean>(false)
  const [termsShake, setTermsShake] = useState<boolean>(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const isFirstValid = isValidName(firstName, 3)
    const isLastValid = isValidName(lastName, 4)
    const isEmailValid = isValidEmail(signupEmail)
    const isPasswordValid = isValidPassword(signupPassword)
    const isConfirmValid = isPasswordMatch(signupPassword, confirmPassword)

    setFirstNameTouched(true)
    setLastNameTouched(true)
    setEmailTouched(true)
    setPasswordTouched(true)
    setConfirmTouched(true)

    setFirstNameError(false)
    setLastNameError(false)
    setEmailError(false)
    setPasswordError(false)
    setConfirmError(false)

    requestAnimationFrame(() => {
      setFirstNameError(!isFirstValid)
      setLastNameError(!isLastValid)
      setEmailError(!isEmailValid)
      setPasswordError(!isPasswordValid)
      setConfirmError(!isConfirmValid)
    })

    if (
      !isFirstValid ||
      !isLastValid ||
      !isEmailValid ||
      !isPasswordValid ||
      !isConfirmValid
    ) return

    if (
      isFirstValid &&
      isLastValid &&
      isEmailValid &&
      isPasswordValid &&
      isConfirmValid &&
      !acceptTerms
    ) {
      setTermsShake(true)
      setTimeout(() => setTermsShake(false), 500) // Reset shake after animation
      return
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`
    console.log(fullName)
    console.log("Form submitted!")

    setFirstName("")
    setLastName("")
    setSignupEmail("")
    setSignupPassword("")
    setConfirmPassword("")
    setAcceptTerms(false)
    setFirstNameTouched(false)
    setLastNameTouched(false)
    setFirstNameError(false)
    setLastNameError(false)
    setEmailTouched(false)
    setEmailError(false)
    setPasswordTouched(false)
    setConfirmTouched(false)
    setPasswordError(false)
    setConfirmError(false)
  }


  useEffect(() => {
    if (mode === 'signup') {
      setFirstName("")
      setLastName("")
      setSignupEmail("")
      setSignupPassword("")
      setConfirmPassword("")
      setAcceptTerms(false)
      setFirstNameTouched(false)
      setLastNameTouched(false)
      setFirstNameError(false)
      setLastNameError(false)
      setEmailTouched(false)
      setEmailError(false)
      setPasswordTouched(false)
      setConfirmTouched(false)
      setPasswordError(false)
      setConfirmError(false)
    }
  }, [mode])

  return (
    <div className='w-3/5'>
      <form className='flex flex-col items-center'
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className='flex gap-3'>
          <TextInput
            label="First Name"
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            touched={firstNameTouched}
            error={firstNameError}
            errorMessage="Invalid First Name"
            autoComplete="name"
          />
          <TextInput
            label="Last Name"
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            touched={lastNameTouched}
            error={lastNameError}
            errorMessage="Invalid Last Name"
            autoComplete="name"
          />
        </div>
        <TextInput
          label="Email"
          name="signupEmail"
          value={signupEmail}
          onChange={(e) => setSignupEmail(e.target.value)}
          touched={emailTouched}
          error={emailError}
          errorMessage="Enter a valid Email Address"
          autoComplete="name"
        />
        <PasswordInput
          label="Password"
          name="signupPassword"
          value={signupPassword}
          onChange={(e) => setSignupPassword(e.target.value)}
          touched={passwordTouched}
          error={passwordError}
          errorMessage="Password must be at least 8"
        />
        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          touched={confirmTouched}
          error={confirmError}
          errorMessage="Password Mismatch"
        />

        <div className={`flex w-full my-2 ${termsShake ? 'animate-shake' : ''}`}>
          <label className='truncate text-xs flex leading-none gap-1 text-[#64717E] cursor-pointer'>
            <input
              type="checkbox"
              name="acceptTerms"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
            />
            Accept <Link href="" className="text-[#1281E9]">Terms</Link> and <Link href="" className="text-[#1281E9]">Conditions</Link>
          </label>
        </div>
        <input
          type='submit'
          value="Sign Up"
          name='signupSubmit'
          className='text-white font-semibold bg-[#384959] w-1/2 my-5 p-1 rounded-2xl cursor-pointer'
        />
      </form>
    </div>
  )
}

export default SignupForm
