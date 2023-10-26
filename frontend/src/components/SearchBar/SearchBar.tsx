'use client'

import { useGetSuggestions } from 'api'
import { HighlightText, Input } from 'components'
import { useRouter } from 'next/navigation'
import { FC, memo, useRef, useState } from 'react'
import { useOutsideAlerter } from 'utils'

const SearchBar: FC = () => {
  const router = useRouter()

  const [showSuggestions, setShowSuggestions] = useState(false)
  const [searchText, setSearchText] = useState('')
  const suggestions = useGetSuggestions(searchText || undefined).suggestionsList

  const divRef = useRef(null)
  useOutsideAlerter(divRef, setShowSuggestions, showSuggestions)

  return (
    <div className="h-full flex items-end xs:items-center text-white">
      <div ref={divRef} className="w-96 flex flex-row">
        <div className="w-full h-10 relative divide-black divide-y-2">
          <Input
            placeHolder="Beitragsuche"
            onFocus={() => setShowSuggestions(searchText !== '' ? true : false)}
            className="w-full"
            size="small"
            value={searchText}
            onChange={(value: string) => {
              setSearchText(value)
              setShowSuggestions(value !== '' ? true : false)
            }}
          />

          {showSuggestions && suggestions && (
            <div className="absolute w-full bg-white py-1">
              {suggestions.map(
                (suggestion: {
                  suggestionUrl: string
                  suggestionText: string
                }) => (
                  <div
                    onClick={() => {
                      setSearchText('')
                      setShowSuggestions(false)
                      router.push(suggestion.suggestionUrl)
                    }}
                    className="w-full px-4 py-1 text-gray-600 hover:bg-gray-100 cursor-pointer"
                    key={suggestion.suggestionText}
                  >
                    <HighlightText
                      fullText={suggestion.suggestionText}
                      highlightText={searchText}
                    />
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <div
          onClick={() => {
            if (searchText !== '') {
              setSearchText('')
              setShowSuggestions(false)
              router.push('/searchResults?search=' + searchText)
            }
          }}
          className="h-12 flex items-center dark:text-brightModeColor text-darkModeColor cursor-pointer ml-2 brightness-125"
        >
          Suchen
        </div>
      </div>
    </div>
  )
}

export default memo(SearchBar)
