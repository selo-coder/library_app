import { FC, useEffect, useState } from 'react'

import { ArrowLeft, ArrowRight } from 'assets'
import { useBreakpoint } from 'utils'

interface PaginationProps {
  arrayLength: number
  itemsPerPage: number
  currentPage: number
  setCurrentPage: (currentPage: number) => void
}

const Pagination: FC<PaginationProps> = ({
  arrayLength,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}): JSX.Element => {
  const [breakpoint] = useBreakpoint()
  const [maxPagination, setMaxPagination] = useState(3)

  const pageCountArray = arrayLength
    ? Array.from(Array(Math.ceil(arrayLength / itemsPerPage)).keys())
    : []

  useEffect(() => {
    setMaxPagination(
      breakpoint.width > 1400 ? 7 : breakpoint.width > 700 ? 5 : 3
    )
  }, [breakpoint])

  return (
    <div className="w-full flex mt-16 justify-center">
      <div className="flex flex-row gap-4 items-center">
        <button
          onClick={() => {
            if (currentPage > 0) setCurrentPage(currentPage - 1)
          }}
        >
          <ArrowLeft
            className={`dark:fill-brightModeColor fill-darkModeColor w-4 h-4`}
          />
        </button>

        {pageCountArray
          .slice(
            currentPage >
              maxPagination - (maxPagination === 3 ? maxPagination : 4) // Bei 7 = 3
              ? currentPage -
                  (maxPagination - (maxPagination - (maxPagination - 1) / 2)) // 3
              : 0,
            currentPage + maxPagination - (maxPagination - 1) / 2 // 2
          )
          .map((value: number, index: number) => (
            <span
              onClick={() => setCurrentPage(value)}
              className={`rounded-full hover:bg-red-500 cursor-pointer py-3 px-4 ${
                currentPage === value
                  ? 'text-brightModeColor bg-red-500 hover:bg-red-600 hover:border-red-600'
                  : 'dark:text-brightModeColor text-darkModeColor dark:hover:bg-red-600 dark:hover:border-red-600 hover:bg-red-600 hover:border-red-600'
              }`}
              key={index}
            >
              {value + 1}
            </span>
          ))}
        <button
          onClick={() => {
            if (Math.ceil(arrayLength / itemsPerPage) - 1 !== currentPage)
              setCurrentPage(currentPage + 1)
          }}
        >
          <ArrowRight
            className={`cursor-pointer dark:fill-brightModeColor fill-darkModeColor w-4 h-4`}
          />
        </button>
      </div>
    </div>
  )
}

export default Pagination
