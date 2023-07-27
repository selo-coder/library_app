'use client'

import { useBreakpoint } from '../../utils'
import { AccountDropDownMenu } from '../../next_components'

export default function AccountLayout({ children }: { children: JSX.Element }) {
  const [breakpoint] = useBreakpoint()

  const accountMenuPoints = [
    { key: 'accountInformation', display: 'Kontoinformationen' },
    { key: 'accountSafety', display: 'Kontosicherheit' },
    { key: 'manageFriends', display: 'Freunde' },
    { key: 'myHistory', display: 'Mein Verlauf' },
    { key: 'others', display: 'Sonstiges' },
  ]

  return (
    breakpoint.width !== 0 && (
      <div className="px-8 md:px-12 lg:px-20 xl:px-32 2xl:px-40 py-16 flex flex-col items-center">
        <AccountDropDownMenu accountMenuPoints={accountMenuPoints} />
        {children}
      </div>
    )
  )
}
