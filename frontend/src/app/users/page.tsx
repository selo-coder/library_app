'use client'

import { useRouter } from 'next/navigation'
import { NextAppContext, User } from 'components'
import { useGetUserList } from 'api'
import { UserIcon } from 'assets'
import { redirectToUserPage } from 'utils'
import { useContext } from 'react'

export default function Page() {
  const router = useRouter()
  const { myUserId } = useContext(NextAppContext)
  const { userList, isLoading } = useGetUserList()

  return (
    !isLoading && (
      <div className="w-full flex-row justify-center flex-wrap gap-8 flex p-12">
        {userList.map((user: User, index: number) => (
          <div
            key={index}
            className="py-6 flex w-52 items-center text-center gap-5 rounded-xl flex-col border-2 border-red-500"
          >
            <UserIcon className="w-14 h-14 stroke-red-500" />
            <div className="px-3 flex flex-col gap-4">
              <span
                onClick={() =>
                  redirectToUserPage(user.userId, myUserId, router)
                }
                className="text-white break-all cursor-pointer hover:underline font-bold"
              >
                {user.userName}
              </span>
              <div
                style={{ height: '1px' }}
                className="w-full flex z-50 bg-red-500 rounded"
              />
              {user.lastCreatedItemDate ? (
                <div className="flex flex-col text-white gap-2">
                  <span className="font-bold">Letzter Beitrag:</span>
                  <span>{user.lastCreatedItemDate}</span>
                </div>
              ) : (
                <span className="text-white">Keine Beiträge</span>
              )}
            </div>
          </div>
        ))}
      </div>
    )
  )
}
