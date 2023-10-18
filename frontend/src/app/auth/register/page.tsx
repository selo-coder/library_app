'use client'

import { FC, useEffect, useState } from 'react'
import { ErrorType, User } from 'types'
import * as EmailValidator from 'email-validator'
import { checkForErrors, filterErrors, hash } from 'utils'
import { ClosedEye, OpenEye } from 'assets'
import { useRouter } from 'next/navigation'
import { AuthHeadline, Button, ErrorMessage, Input } from 'components'
import { register } from 'api'

const RegisterDialog: FC = (): JSX.Element => {
  const [userData, setUserData] = useState<User>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  } as User)

  const router = useRouter()

  const [registerInitiated, setRegisterInitiated] = useState<boolean>(false)
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const [registerClicked, setRegisterClicked] = useState<boolean>(false)
  const [duplicateEmail, setDuplicateEmail] = useState<string>()
  const [registerFailed, setRegisterFailed] = useState<boolean>()
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const errorList: ErrorType[] = [
    {
      condition: (
        ['firstName', 'lastName', 'email', 'password'] as (keyof User)[]
      ).find((field: keyof User) => !userData[field])
        ? true
        : false,
      errorMessage: 'Alle Felder müssen ausgefüllt sein',
    },
    {
      condition: !EmailValidator.validate(userData.email),
      errorMessage: 'E-Mail hat das falsche Format',
    },
    {
      condition: userData?.password?.length <= 7,
      errorMessage: 'Passwort muss mindestens 8 Zeichen lang sein',
    },
    {
      condition:
        registerClicked && duplicateEmail && duplicateEmail === userData.email
          ? true
          : false,
      errorMessage: 'E-Mail bereits registriert.',
    },
    {
      condition: registerClicked && registerFailed ? true : false,
      errorMessage:
        'Registrierung fehlgeschlagen. Bitte überprüfen Sie ihre Daten und probieren Sie es erneut.',
    },
  ]

  useEffect(() => {
    if (registerClicked)
      checkForErrors(errorList).then((errors: string[]) =>
        setErrorMessages(errors)
      )
  }, [userData, registerClicked, duplicateEmail, registerFailed])

  const initiateRegister = async (): Promise<void> => {
    try {
      checkForErrors(errorList).then(async (errors: string[]) => {
        setErrorMessages(errors)

        if (
          filterErrors(errors, [
            'E-Mail bereits registriert.',
            'Registrierung fehlgeschlagen. Bitte überprüfen Sie ihre Daten und probieren Sie es erneut.',
          ])?.length === 0
        ) {
          setRegisterInitiated(true)

          const response = await register({
            body: {
              ...userData,
              password: hash(userData.password),
            },
          })

          if (response.statusCode === 200)
            router.push('/auth/registerCompleted')
          else if (
            response.statusCode === 500 &&
            response.message === 'Email duplicate'
          ) {
            setDuplicateEmail(userData.email)
            setRegisterFailed(false)
            checkForErrors(errorList)
            setRegisterInitiated(false)
          } else if (response.statusCode === 500) {
            setDuplicateEmail('')
            setRegisterFailed(true)
            checkForErrors(errorList)
            setRegisterInitiated(false)
          }
        }
      })
    } catch (error) {
      setRegisterInitiated(false)
      console.log(error)
    }
    setRegisterInitiated(false)
  }

  return (
    <>
      <AuthHeadline showPersonIcon={true} title={'Login'} />

      <Input
        placeHolder="Vorname"
        onChange={(value: string) => {
          setUserData({ ...userData, firstName: value })
        }}
      />
      <Input
        placeHolder="Nachname"
        onChange={(value: string) => {
          setUserData({ ...userData, lastName: value })
        }}
      />
      <Input
        placeHolder="E-Mail"
        onChange={(value: string) => {
          setUserData({ ...userData, email: value })
        }}
      />
      <div className="flex flex-row items-center justify-end">
        <Input
          className="w-full"
          placeHolder="Passwort"
          type={showPassword ? 'text' : 'password'}
          onChange={(value: string) => {
            setUserData({ ...userData, password: value })
          }}
        />
        <button
          className="absolute p-1 mr-2"
          onClick={() => setShowPassword(!showPassword)}
        >
          {!showPassword ? (
            <ClosedEye className="w-7 h-7" />
          ) : (
            <OpenEye className="w-7 h-7" />
          )}
        </button>
      </div>

      <div className="flex px-8 flex-col gap-4">
        <ErrorMessage errorMessages={errorMessages} />
        <Button
          disabled={registerInitiated}
          loading={registerInitiated}
          label={'Registrieren'}
          onClick={() => {
            setRegisterClicked(true)
            initiateRegister()
          }}
        />
        <div className="flex flex-row">
          <button
            className={'text-xs cursor-pointer hover:underline ml-auto'}
            onClick={() => router.push('/auth/login')}
          >
            {'Zurück ➔'}
          </button>
        </div>
      </div>
    </>
  )
}

export default RegisterDialog
