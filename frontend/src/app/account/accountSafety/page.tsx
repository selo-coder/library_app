'use client'

import { useEffect, useState } from 'react'
import { ErrorMessage, Input } from '../../../next_components'
import { ErrorType } from '../../../types'
import { getCurrentUserId, hash } from '../../../utils'
import * as EmailValidator from 'email-validator'
import { useCookies } from 'react-cookie'
import { useUpdateUserData as useUpdateUserDataProps } from '../../../next_api'

export type GenericResponseType = {
  statusCode: number
  message?: string
}

export default function Page() {
  const [oldPassword, setOldPassword] = useState<string>('')
  const [newPassword, setNewPassword] = useState<string>('')
  const [passwordUpdateClicked, setPasswordUpdateClicked] =
    useState<boolean>(false)
  const [successfullPasswordChange, setSuccessfullPasswordChange] =
    useState<boolean>(false)
  const [passwordErrorMessages, setPasswordErrorMessages] = useState<string[]>(
    []
  )

  const [cookie] = useCookies(['jwtToken'])

  const currentUserId = getCurrentUserId(cookie.jwtToken)

  const [oldEmail, setOldEmail] = useState<string>('')
  const [newEmail, setNewEmail] = useState<string>('')
  const [emailUpdateClicked, setEmailUpdateClicked] = useState<boolean>(false)
  const [emailErrorMessages, setEmailErrorMessages] = useState<string[]>([])
  const [successfullEmailChange, setSuccessfullEmailChange] =
    useState<boolean>(false)

  const checkForPasswordErrors = async (
    response?: GenericResponseType
  ): Promise<string[]> => {
    const passwordErrorList: ErrorType[] = [
      {
        condition: oldPassword === '' || newPassword === '',
        errorMessage: 'Alle Felder müssen ausgefüllt werden.',
      },
      {
        condition: newPassword?.length <= 7,
        errorMessage: 'Neues Passwort muss mindestens 8 Zeichen lang sein.',
      },
      {
        condition: response?.message === 'oldPasswordWrong',
        errorMessage:
          'Das alte Passwort war nicht richtig. Bitte Eingabe überprüfen und erneut probieren.',
      },
      {
        condition: response?.message === 'passwordNotChanged',
        errorMessage:
          'Das neue Passwort ist mit dem alten identisch. Bitte anpassen und erneut probieren.',
      },
      {
        condition: response?.message === 'noNewDataGiven',
        errorMessage:
          'Daten konnten nicht verarbeitet werden. Eingaben überprüfen und erneut probieren.',
      },
    ]

    return passwordErrorList
      .map((error: { condition: boolean; errorMessage: string }) =>
        error.condition ? error.errorMessage : ''
      )
      .filter((errorMessage: string) => errorMessage !== '')
  }

  const checkForEmailErrors = async (
    response?: GenericResponseType
  ): Promise<string[]> => {
    const emailErrorList: ErrorType[] = [
      {
        condition: oldEmail === '' || newEmail === '',
        errorMessage: 'Alle Felder müssen ausgefüllt werden.',
      },
      {
        condition: !EmailValidator.validate(newEmail),
        errorMessage: 'Neue E-Mail hat das falsche Format.',
      },
      {
        condition: !EmailValidator.validate(oldEmail),
        errorMessage: 'Alte E-Mail hat das falsche Format',
      },
      {
        condition: response?.message === 'oldEmailWrong',
        errorMessage:
          'Die alte E-Mail war nicht richtig. Bitte Eingabe überprüfen und erneut probieren.',
      },
      {
        condition: response?.message === 'emailNotChanged',
        errorMessage:
          'Die neue E-Mail ist mit der Alten identisch. Bitte anpassen und erneut probieren.',
      },
      {
        condition: response?.message === 'noNewDataGiven',
        errorMessage:
          'Daten konnten nicht verarbeitet werden. Eingaben überprüfen und erneut probieren.',
      },
    ]
    return emailErrorList
      .map((error: { condition: boolean; errorMessage: string }) =>
        error.condition ? error.errorMessage : ''
      )
      .filter((errorMessage: string) => errorMessage !== '')
  }

  useEffect(() => {
    if (passwordUpdateClicked)
      checkForPasswordErrors().then((errors: string[]) =>
        setPasswordErrorMessages(errors)
      )
  }, [oldPassword, newPassword, passwordUpdateClicked])

  useEffect(() => {
    if (emailUpdateClicked)
      checkForEmailErrors().then((errors: string[]) =>
        setEmailErrorMessages(errors)
      )
  }, [oldEmail, newEmail, emailUpdateClicked])

  const useUpdateUserData = useUpdateUserDataProps()

  const handleUpdatePassword = async () => {
    try {
      checkForPasswordErrors().then(async (errors: string[]) => {
        if (errors?.length === 0) {
          const response = await useUpdateUserData({
            jwtToken: cookie.jwtToken,
            userId: currentUserId,
            ...(oldPassword &&
              newPassword && {
                oldPassword: hash(oldPassword),
                newPassword: hash(newPassword),
              }),
          })

          if (response.statusCode === 200) {
            setSuccessfullPasswordChange(true)
            setPasswordUpdateClicked(false)
            setNewPassword('')
            setOldPassword('')

            setTimeout(() => {
              setSuccessfullPasswordChange(false)
            }, 3000)
          } else if (response.statusCode === 500) {
            setPasswordErrorMessages(await checkForPasswordErrors(response))
          }
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  const handleUpdateEmail = async () => {
    try {
      checkForEmailErrors().then(async (errors: string[]) => {
        if (errors?.length === 0) {
          const response = await useUpdateUserData({
            jwtToken: cookie.jwtToken,
            userId: currentUserId,
            ...(oldEmail &&
              newEmail && {
                oldEmail,
                newEmail,
              }),
          })

          if (response.statusCode === 200) {
            setSuccessfullEmailChange(true)

            setEmailUpdateClicked(false)

            setNewEmail('')
            setOldEmail('')

            setTimeout(() => {
              setSuccessfullEmailChange(false)
            }, 3000)
          } else if (response.statusCode === 500) {
            setEmailErrorMessages(await checkForEmailErrors(response))
          }
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex flex-col md:flex-row w-full py-12 lg:px-24 gap-24 md:gap-12">
      <div className="w-full flex flex-col items-center gap-12">
        <Input
          className="w-full max-w-lg"
          value={oldEmail}
          placeHolder="Alte E-Mail"
          onChange={(value: string) => {
            setOldEmail(value)
          }}
        />

        <Input
          className="w-full max-w-lg"
          value={newEmail}
          placeHolder="Neue E-Mail"
          onChange={(value: string) => {
            setNewEmail(value)
          }}
        />
        <div className="w-full flex flex-col items-center gap-8">
          <button
            onClick={() => {
              setEmailUpdateClicked(true)
              handleUpdateEmail()
            }}
            className={`max-w-lg w-full dark:text-brightModeColor text-darkModeColor border-2 border-red-500 hover:bg-red-500 hover:text-white rounded p-2`}
          >
            E-Mail ändern
          </button>
          <ErrorMessage errorMessages={emailErrorMessages} />
          {successfullEmailChange && (
            <span className="text-green-500">
              Neue Email wurde gespeichert!
            </span>
          )}
        </div>
      </div>
      <div className="w-full flex flex-col items-center gap-12">
        <Input
          className="w-full max-w-lg"
          value={oldPassword}
          placeHolder="Altes Passwort"
          onChange={(value: string) => {
            setOldPassword(value)
          }}
        />

        <Input
          className="w-full max-w-lg"
          value={newPassword}
          placeHolder="Neues Passwort"
          onChange={(value: string) => {
            setNewPassword(value)
          }}
        />

        <div className="w-full flex flex-col items-center gap-8">
          <button
            onClick={() => {
              setPasswordUpdateClicked(true)
              handleUpdatePassword()
            }}
            className={`max-w-lg w-full dark:text-brightModeColor text-darkModeColor border-2 border-red-500 hover:bg-red-500 hover:text-white rounded p-2`}
          >
            Passwort ändern
          </button>
          <ErrorMessage errorMessages={passwordErrorMessages} />
          {successfullPasswordChange && (
            <span className="text-green-500">
              Neues Passwort wurde gespeichert!
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
