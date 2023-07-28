'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import {
  Footer,
  Breadcrumbs,
  Navbar,
  Subject,
  SubjectList,
  TopicPointList,
  NextAppContext,
} from '../next_components'
import { usePathname, useRouter } from 'next/navigation'
import { useCookies } from 'react-cookie'
import { Spinner } from '../assets'
// eslint-disable-next-line camelcase
import jwt_decode, { JwtPayload } from 'jwt-decode'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: JSX.Element }) {
  const router = useRouter()
  const [cookie] = useCookies(['jwtToken'])
  const pathname = usePathname()

  const [theme, setTheme] = useState('')
  useEffect(() => {
    if (!localStorage.theme) localStorage.theme = 'light'
    setTheme(localStorage.theme)
  }, [])

  const [loggedIn, setLoggedIn] = useState<boolean>()

  const [darkModeActive, setDarkModeActive] = useState<boolean>()

  const [subjectList, setSubjectList] = useState<SubjectList>([] as SubjectList)
  const [topicPointsList, setTopicPointsList] = useState<TopicPointList>(
    {} as TopicPointList
  )

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
    <html lang="en" className={theme}>
      <body className={inter.className}>
        {loggedIn !== undefined && cookie && theme !== '' ? (
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
              <>{children}</>
            ) : (
              <div className="w-full h-full flex justify-center py-40 items-center">
                <Spinner className="w-12 text-gray-200 animate-spin dark:text-gray-600 fill-white" />
              </div>
            )}
          </NextAppContext.Provider>
        ) : (
          <div className="w-full h-screen flex bg-darkModeColor justify-center items-start py-40">
            <Spinner className="w-12 text-gray-200 animate-spin dark:text-gray-600 fill-white" />
          </div>
        )}
      </body>
    </html>
  )
}
