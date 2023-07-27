'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useBreakpoint } from '../../utils'
import { AccountDropDownMenu } from '../../next_components'

export default function Page() {
  const accountMenuPoints = [
    { key: 'accountInformation', display: 'Kontoinformationen' },
    { key: 'accountSafety', display: 'Kontosicherheit' },
    { key: 'manageFriends', display: 'Freunde' },
    { key: 'myHistory', display: 'Mein Verlauf' },
    { key: 'others', display: 'Sonstiges' },
  ]

  const pathNamesArray = [
    'accountInformation',
    'accountSafety',
    'manageFriends',
    'myHistory',
    'others',
  ]

  const [selectedMenuPoint, setSelectedMenuPoint] = useState<{
    key: string
    display: string
  }>(accountMenuPoints[0])

  const [breakpoint] = useBreakpoint()

  return <div>main</div>
}
