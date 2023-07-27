'use client'

import { useRouter } from 'next/navigation'
import { Button } from '../../../next_components'

const RegisterCompleteDialog = (): JSX.Element => {
  const router = useRouter()

  return (
    <div className="flex px-8 flex-col">
      <span className="mt-2 mb-4">
        Du kannst du dich nun mit deinen Daten anmelden
      </span>

      <Button
        label={'Zur Anmeldung'}
        onClick={() => {
          router.push('/auth/login')
        }}
      />
    </div>
  )
}

export default RegisterCompleteDialog
