'use client'

import { Spinner } from 'assets'

export default function Loading() {
  return (
    <div className="w-full h-full flex justify-center py-40 items-center">
      <Spinner className="w-12 text-gray-200 animate-spin dark:text-gray-600 fill-white" />
    </div>
  )
}
