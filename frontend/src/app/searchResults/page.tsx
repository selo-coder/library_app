'use client'

import { useGetSearchResults } from 'api'
import { Blocks, Bars } from 'assets'
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function Page() {
  const router = useRouter()
  const searchParams = useSearchParams().get('search')
  if (!searchParams) redirect('/')

  const searchResults = useGetSearchResults(searchParams).searchResults

  const [currentViewMode, setCurrentViewMode] = useState<'Blocks' | 'Bars'>(
    'Bars'
  )

  return (
    <div className="px-8 md:px-12 lg:px-20 xl:px-32 2xl:px-40 flex flex-col gap-8 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-row gap-4">
          <div className="w-full flex items-center">
            <span className="text-3xl dark:text-brightModeColor text-darkModeColor">
              Alle Suchergebnisse - {searchParams}
            </span>
          </div>
          <div className="w-full flex gap-2">
            <span
              className="flex items-center"
              onClick={() => {
                setCurrentViewMode('Blocks')
              }}
            >
              <Blocks
                className={`${
                  currentViewMode === 'Blocks'
                    ? ' hover:stroke-red-500/80 stroke-red-500'
                    : 'dark:stroke-brightModeColor dark:hover:stroke-brightModeColor/75 hover:stroke-darkModeColor/70 stroke-darkModeColor'
                } cursor-pointer w-10 h-10`}
              />
            </span>
            <span
              className="flex items-center"
              onClick={() => {
                setCurrentViewMode('Bars')
              }}
            >
              <Bars
                className={`${
                  currentViewMode === 'Bars'
                    ? ' hover:stroke-red-500/80 stroke-red-500'
                    : 'dark:stroke-brightModeColor dark:hover:stroke-brightModeColor/75 hover:stroke-darkModeColor/70 stroke-darkModeColor'
                } cursor-pointer w-10 h-10`}
              />
            </span>
          </div>
        </div>

        <div
          className={`flex gap-5 ${
            currentViewMode === 'Bars' ? 'divide-y flex-col' : 'flex-wrap'
          }  dark:text-brightModeColor text-darkModeColor`}
        >
          {searchResults && searchResults.length > 0 ? (
            searchResults.map(
              (
                searchResult: {
                  topicPointTitle: string
                  subjectTitle: string
                  topicTitle: string
                },
                index: number
              ) => (
                <div
                  key={searchResult.topicPointTitle + index}
                  className={`${
                    currentViewMode === 'Blocks'
                      ? 'border py-5 w-36 xs:w-40'
                      : 'pt-5 flex'
                  }`}
                >
                  <div className="px-4 divide-y gap-2 flex flex-col">
                    <div className="flex">
                      <span>
                        {searchResult.subjectTitle}, {searchResult.topicTitle}
                      </span>
                    </div>

                    <div className="flex pt-2">
                      <span
                        onClick={() => {
                          router.push(
                            '/' +
                              searchResult.subjectTitle +
                              '/' +
                              searchResult.topicTitle +
                              '/' +
                              searchResult.topicPointTitle
                          )
                        }}
                        className="cursor-pointer hover:underline font-bold"
                      >
                        {searchResult.topicPointTitle}
                      </span>
                    </div>
                  </div>
                </div>
              )
            )
          ) : (
            <span>Keine Einträge gefunden</span>
          )}
        </div>
      </div>
    </div>
  )
}
