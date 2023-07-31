'use client'

import { FC, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CookieAuthType, ErrorType } from '../../../types'
import { checkForErrors, filterErrors, hash } from '../../../utils'
import * as EmailValidator from 'email-validator'
import { useCookies } from 'react-cookie'
import { ClosedEye, OpenEye } from '../../../assets'
import CryptoJS, { AES } from 'crypto-js'
import {
  AuthHeadline,
  Input,
  Checkbox,
  ErrorMessage,
  Button,
  NextAppContext,
} from '../../../next_components'
import { login } from '../../../next_api'

export type LoginData = {
  email: string
  password: string
}

const LoginDialog: FC = (): JSX.Element => {
  const { setLoggedIn } = useContext(NextAppContext)

  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
  })
  const [cookies, setCookie, removeCookie] = useCookies([
    'rememberData',
    'email',
    'password',
    'jwtToken',
  ])
  const router = useRouter()

  const [loginClicked, setLoginClicked] = useState<boolean>(false)
  const [loginInitiated, setLoginInitiated] = useState<boolean>(false)
  const [loginDataWrong, setLoginDataWrong] = useState<boolean>(false)
  const [loginFailed, setLoginFailed] = useState<boolean>(false)
  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [rememberData, setRememberData] = useState<CookieAuthType>({
    value: cookies.rememberData === 'true' ? true : false,
    hasChanged: false,
  })

  const errorList: ErrorType[] = [
    {
      condition: (['email', 'password'] as (keyof LoginData)[]).find(
        (field: keyof LoginData) => !loginData[field]
      )
        ? true
        : false,
      errorMessage: 'Alle Felder müssen ausgefüllt sein',
    },
    {
      condition: !EmailValidator.validate(loginData.email),
      errorMessage: 'E-Mail hat das falsche Format',
    },
    {
      condition: loginData?.password?.length <= 7,
      errorMessage: 'Passwort muss mindestens 8 Zeichen lang sein',
    },
    {
      condition: loginClicked && loginDataWrong,
      errorMessage: 'Login fehlgeschlagen. Passwort und/oder Email ist falsch.',
    },
    {
      condition: loginClicked && loginFailed,
      errorMessage:
        'Login fehlgeschlagen. Bitte überprüfen Sie ihre Daten und probieren Sie es erneut.',
    },
  ]

  useEffect(() => {
    if (rememberData.value) {
      setLoginData({
        email: cookies.email,
        password: AES.decrypt(cookies.password, 'lolberg1234!?1234').toString(
          CryptoJS.enc.Utf8
        ),
      })
    }
  }, [])

  useEffect(() => {
    if (loginClicked)
      checkForErrors(errorList).then((errors: string[]) =>
        setErrorMessages(errors)
      )
  }, [loginData, loginClicked, loginDataWrong, loginFailed])

  const setAuthCookies = (): void => {
    if (rememberData.hasChanged) {
      setCookie('rememberData', String(rememberData.value), { path: '/' })
    }

    if (rememberData.value === true) {
      removeCookie('email', { path: '/' })
      removeCookie('password', { path: '/' })
      setCookie('email', loginData.email, { path: '/' })
      setCookie(
        'password',
        (
          AES.encrypt(
            loginData.password,
            'lolberg1234!?1234'
          ) as CryptoJS.lib.CipherParams
        ).toString(),
        { path: '/' }
      )
    } else {
      removeCookie('email', { path: '/' })
      removeCookie('password', { path: '/' })
    }
  }

  const initiateLogin = async (): Promise<void> => {
    try {
      checkForErrors(errorList).then(async (errors: string[]) => {
        setErrorMessages(errors)

        if (
          filterErrors(errors, [
            'Login fehlgeschlagen. Passwort und/oder Email ist falsch.',
            'Login fehlgeschlagen. Bitte überprüfen Sie ihre Daten und probieren Sie es erneut.',
          ])?.length === 0
        ) {
          setLoginInitiated(true)

          const response = await login({
            body: {
              email: loginData.email,
              password: hash(loginData.password),
            },
          })

          if (response.statusCode === 200) {
            setAuthCookies()
            setCookie('jwtToken', response.jwtToken, { path: '/' })

            setLoginInitiated(false)

            setLoggedIn(true)
            router.push('/')
          } else if (
            response.statusCode === 500 &&
            response.message === 'Login data wrong'
          ) {
            setLoginDataWrong(true)
            setLoginFailed(false)
            checkForErrors(errorList)
            setLoginInitiated(false)
          } else if (response.statusCode === 500) {
            setLoginFailed(true)
            setLoginDataWrong(false)
            checkForErrors(errorList)
            setLoginInitiated(false)
          }
        }
      })
    } catch (error) {
      setLoginInitiated(false)
      console.log(error)
    }
    setLoginInitiated(false)
  }

  return (
    <>
      <AuthHeadline showPersonIcon={true} title={'Login'} />
      <Input
        value={loginData.email}
        placeHolder="E-Mail"
        onChange={(value: string) => {
          setLoginData({ ...loginData, email: value })
        }}
      />
      <div className="flex flex-row items-center justify-end">
        <Input
          className="w-full"
          value={loginData.password}
          type={showPassword ? 'text' : 'password'}
          placeHolder="Passwort"
          onChange={(value: string) => {
            setLoginData({ ...loginData, password: value })
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

      <div className="flex flex-col gap-4 text-sm text-center">
        <Checkbox
          label={'Anmeldendaten merken'}
          checked={rememberData.value}
          onCheck={(value: boolean) => {
            setRememberData({
              value,
              hasChanged: !rememberData.hasChanged,
            })
          }}
        />
      </div>
      <div className="flex px-8 flex-col gap-4">
        <ErrorMessage errorMessages={errorMessages} />

        <Button
          disabled={loginInitiated}
          loading={loginInitiated}
          label={'Einloggen'}
          onClick={() => {
            setLoginClicked(true)
            initiateLogin()
          }}
        />
        <div className="flex flex-row">
          <button
            className="text-xs hover:underline"
            onClick={() => router.push('forgotPassword')}
          >
            Passwort vergessen
          </button>

          <button
            className="text-xs cursor-pointer hover:underline ml-auto"
            onClick={() => router.push('register')}
          >
            {'Registrieren ➔'}
          </button>
        </div>
      </div>
    </>
  )
}

export default LoginDialog
