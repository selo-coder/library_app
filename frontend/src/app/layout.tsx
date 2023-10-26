'use client'

import './globals.css'
import { useState, useEffect } from 'react'
import {
  Subject,
  SubjectList,
  TopicPointList,
  NextAppContext,
} from 'components'
import { usePathname, useRouter } from 'next/navigation'
import useCookies from 'react-cookie/es6/useCookies'
// eslint-disable-next-line camelcase
import jwt_decode, { JwtPayload } from 'jwt-decode'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { getCurrentUserId } from 'utils'

const Footer = dynamic(() => import('../components/Footer'))

const Breadcrumbs = dynamic(() => import('../components/Breadcrumbs'))

const Navbar = dynamic(() => import('../components/Navbar'))

const Spinner = dynamic(() => import('../assets/Spinner'))

export default function RootLayout({ children }: { children: JSX.Element }) {
  const executeInitialJS = `

  // Set Initial color theme //

  if (!localStorage.theme) {
    const systemPrefersDarkMode = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches

    if (systemPrefersDarkMode) {
      document.documentElement.classList.add('dark')

      localStorage.theme = 'dark'
    } else {
      localStorage.theme = 'light'
    }
  } else if (localStorage.theme === 'dark') {
    document.documentElement.classList.add('dark')
  } else if (localStorage.theme === 'light') {
    document.documentElement.classList.remove('dark')
  }
  `

  const router = useRouter()
  const [cookie] = useCookies(['jwtToken'])
  const pathname = usePathname()
  const [loggedIn, setLoggedIn] = useState<boolean>()
  const [darkModeActive, setDarkModeActive] = useState<boolean>()
  const [subjectList, setSubjectList] = useState<SubjectList>([] as SubjectList)
  const [topicPointsList, setTopicPointsList] = useState<TopicPointList>(
    {} as TopicPointList
  )
  const [myUserId] = useState(getCurrentUserId(cookie.jwtToken))

  const [topicList, setTopicList] = useState<Subject>({} as Subject)

  useEffect(() => {
    const loggedInJWT =
      cookie &&
      cookie.jwtToken &&
      Math.floor(Date.now() / 1000) <
        ((jwt_decode(cookie.jwtToken) as JwtPayload)?.exp || 0)

    setLoggedIn(loggedInJWT === true ? true : false)

    if (loggedInJWT && pathname.includes('auth')) {
      router.push('/')
    } else if (!loggedInJWT && !pathname.includes('auth')) {
      router.push('/auth/')
    }
  }, [])

  return (
    <html lang="en">
      <Head>
        <link rel="preload" as="image" href="/images/lib.webp" />
      </Head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: executeInitialJS }}></script>
        {loggedIn !== undefined && (
          <NextAppContext.Provider
            value={{
              subjectList,
              setSubjectList,
              topicPointsList,
              setTopicPointsList,
              topicList,
              setTopicList,
              loggedIn,
              setLoggedIn,
              myUserId,
            }}
          >
            {loggedIn === true && !pathname.includes('auth') ? (
              <div className="h-full min-h-screen w-screen max-w-full dark:bg-darkModeColor bg-brightModeColor flex flex-col relative z-100">
                <Navbar />
                <Breadcrumbs />
                {children}
                <Footer
                  darkModeActive={darkModeActive}
                  setDarkModeActive={setDarkModeActive}
                />
              </div>
            ) : loggedIn === false && pathname.includes('auth') ? (
              children
            ) : (
              <div className="w-full h-full flex justify-center py-40 items-center">
                <Spinner className="w-12 text-gray-200 animate-spin dark:text-gray-600 fill-white" />
              </div>
            )}
          </NextAppContext.Provider>
        )}
      </body>
    </html>
  )
}
