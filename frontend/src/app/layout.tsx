'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import { checkForLoggedInStatus } from '../utils'
import {
  Footer,
  Breadcrumbs,
  Navbar,
  Subject,
  SubjectList,
  TopicPointList,
  NextAppContext,
} from '../next_components'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }: { children: JSX.Element }) {
  checkForLoggedInStatus()

  const [darkModeActive, setDarkModeActive] = useState<boolean>()
  const [subjectList, setSubjectList] = useState<SubjectList>([] as SubjectList)
  const [topicPointsList, setTopicPointsList] = useState<TopicPointList>(
    {} as TopicPointList
  )

  const [topicList, setTopicList] = useState<Subject>({} as Subject)

  useEffect(() => {
    if (!localStorage.theme) localStorage.theme = 'light'
  }, [])

  return (
    <html lang="en" className={localStorage.theme}>
      <body className={inter.className}>
        {children.props.childProp.segment !== 'auth' ? (
          <NextAppContext.Provider
            value={{
              subjectList,
              setSubjectList,
              topicPointsList,
              setTopicPointsList,
              topicList,
              setTopicList,
            }}
          >
            <div className="h-full min-h-screen w-screen max-w-full dark:bg-darkModeColor bg-brightModeColor flex flex-col relative z-100">
              <Navbar />

              <Breadcrumbs />

              {children}

              <Footer
                darkModeActive={darkModeActive}
                setDarkModeActive={setDarkModeActive}
              />
            </div>
          </NextAppContext.Provider>
        ) : (
          <>{children}</>
        )}
      </body>
    </html>
  )
}
