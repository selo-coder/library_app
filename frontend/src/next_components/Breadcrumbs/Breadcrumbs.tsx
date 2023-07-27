'use client'

import { FC } from 'react'
import { getCrumbsFromPathname, getLinkFromCrumbs } from '../../utils'
import { useRouter } from 'next/navigation'

const Breadcrumbs: FC = (): JSX.Element => {
  const router = useRouter()

  const pathnamesDisplays = [
    { pathname: 'favorites', display: 'Favoriten' },
    { pathname: 'createTopicPoint', display: 'Beitrag erstellen' },
    { pathname: 'editTopicPoint', display: 'Beitrag anpassen' },
    { pathname: 'myTopicPoints', display: 'Meine Beiträge' },
    { pathname: 'account', display: 'Konto' },
    { pathname: 'accountInformation', display: 'Kontoinformationen' },
    { pathname: 'accountSafety', display: 'Kontosicherheit' },
    { pathname: 'manageFriends', display: 'Freunde' },
    { pathname: 'myHistory', display: 'Mein Verlauf' },
    { pathname: 'others', display: 'Sonstiges' },
  ]

  const pathnamesArray = pathnamesDisplays.map((a) => a.pathname)

  const crumbs = getCrumbsFromPathname().map((crumb: string) => {
    return {
      pathname: crumb,
      display:
        (pathnamesArray.includes(crumb)
          ? pathnamesDisplays.find((url) => url.pathname === crumb)?.display
          : decodeURIComponent(crumb)) || '',
    }
  })

  return (
    <div
      className={`dark:text-brightModeColor text-darkModeColor px-8 md:px-12 lg:px-20 xl:px-32 2xl:px-40 pt-2`}
    >
      <div className="flex flex-row flex-wrap gap-2">
        <span
          onClick={() => router.push(getLinkFromCrumbs(crumbs, 0))}
          className={`cursor-pointer hover:underline ${
            crumbs.length === 0 && 'text-red-500'
          }`}
        >
          Home
        </span>
        {crumbs &&
          crumbs.map((crumb, index: number) => (
            <div key={index} className={'flex flex-row gap-2'}>
              <span>/</span>
              <span
                onClick={() =>
                  router.push(getLinkFromCrumbs(crumbs, index + 1))
                }
                className={`cursor-pointer flex-wrap hover:underline ${
                  index === crumbs.length - 1 && 'text-red-500'
                }`}
              >
                {crumb.display}
              </span>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Breadcrumbs
