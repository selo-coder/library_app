/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCrumbsFromPathname, redirectToUserPage } from 'utils'
import { useCookies } from 'react-cookie'
import {
  NextAppContext,
  TopicPoint,
  UserComment,
  UserCommentCreation,
} from 'components'
import {
  useGetCommentsByTopicPointId,
  changeUpvoteStatus,
  deleteComment,
  deleteTopicPoint,
  useGetRecentTopicPoints,
  useGetSubjects,
  useGetTopicPointsBySubjectTitle,
  useGetTopicsBySubjectTitle,
} from 'api'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const DeletionButton = dynamic(
  () => import('../../../../components/DeletionButton')
)

const TopicPointFavoriteButton = dynamic(
  () => import('../../../../components/TopicPointFavoriteButton')
)

const Pagination = dynamic(
  () => import('../../../../components/common/Pagination')
)

const Pen = dynamic(() => import('../../../../assets/Pen'))

export default function Page() {
  const { topicPointsList, myUserId } = useContext(NextAppContext)
  const router = useRouter()
  const pathnameArray = getCrumbsFromPathname()

  const [cookie] = useCookies(['jwtToken'])

  const [update, setUpdate] = useState(false)
  const [openImageList, setOpenImageList] = useState<boolean[]>([])
  const [userCommentPerPage] = useState<number>(4)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const [selectedTopicPoint, setSelectedTopicPoint] = useState<TopicPoint>()
  const [userCommentList, setUserCommentList] = useState<UserComment[]>()

  const { commentList, mutate, isLoading } = useGetCommentsByTopicPointId(
    selectedTopicPoint?.topicPointId
  )
  const { mutateRecentTopicPoints } = useGetRecentTopicPoints()
  const { mutateSubjects } = useGetSubjects()
  const { mutateTopicPoints } = useGetTopicPointsBySubjectTitle(
    pathnameArray[0]
  )
  const { mutateTopics } = useGetTopicsBySubjectTitle(pathnameArray[0])

  const handleOpenImageChange = (imageIndex: number) => {
    openImageList.splice(imageIndex, 1, !openImageList[imageIndex])
    setUpdate(!update)
  }

  const handleChangeUpvoteStatus = async (
    userCommentId: string
  ): Promise<void> => {
    try {
      const response = await changeUpvoteStatus({
        jwtToken: cookie.jwtToken,
        body: { userId: myUserId, userCommentId },
      })
      if (response.statusCode === 200 && selectedTopicPoint) mutate()
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteComment = async (userCommentId: string): Promise<void> => {
    try {
      const response = await deleteComment({
        jwtToken: cookie.jwtToken,
        body: {
          userCommentId,
        },
      })
      if (response.statusCode === 200 && selectedTopicPoint) {
        mutate()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteTopicPoint = async (): Promise<void> => {
    try {
      const response = await deleteTopicPoint({
        jwtToken: cookie.jwtToken,
        body: {
          topicPointId: selectedTopicPoint?.topicPointId.toString() || '',
        },
      })
      if (response.statusCode === 200 && pathnameArray[0] && pathnameArray[1]) {
        mutateRecentTopicPoints()
        mutateSubjects()
        mutateTopicPoints()
        mutateTopics()

        router.push('/')
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (pathnameArray) {
      setSelectedTopicPoint(
        topicPointsList?.topicPointList?.find(
          (value) =>
            value.topicPointTitle === decodeURIComponent(pathnameArray[2]) &&
            value.topicTitle === decodeURIComponent(pathnameArray[1])
        )
      )
    }
  }, [pathnameArray])

  useEffect(() => {
    setUserCommentList(commentList)
  }, [commentList])

  useEffect(() => {
    if (userCommentList) setOpenImageList(userCommentList.map(() => false))
  }, [userCommentList])

  function getWeekdayName(dayNumber: number) {
    const weekdays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]

    if (dayNumber >= 0 && dayNumber <= 6) {
      return weekdays[dayNumber].substring(0, 3)
    } else {
      return 'Invalid day number'
    }
  }

  return selectedTopicPoint ? (
    <div className="flex flex-col px-4 md:px-12 lg:px-32 xl:px-40 2xl:px-52 py-20">
      <div className="flex justify-end flex-row gap-3">
        {selectedTopicPoint?.userId == myUserId && (
          <div
            onClick={() =>
              router.push('/editTopicPoint/' + selectedTopicPoint.topicPointId)
            }
          >
            <Pen className="w-8 h-8 cursor-pointer stroke-red-500" />
          </div>
        )}

        {selectedTopicPoint?.userId == myUserId && (
          <DeletionButton
            primaryText="Diesen Beitrag löschen ?"
            secondaryText="Daten können nicht wiederhergestellt werden"
            handleDelete={handleDeleteTopicPoint}
          />
        )}

        <TopicPointFavoriteButton selectedTopicPoint={selectedTopicPoint} />
      </div>
      <div
        className={`flex flex-col w-full gap-8 dark:text-brightModeColor text-darkModeColor`}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-row justify-between">
            <span className="text-3xl md:text-4xl">
              {selectedTopicPoint.topicTitle +
                ' - ' +
                selectedTopicPoint.topicPointTitle}
            </span>
            <div className="flex flex-col w-40 h-full overflow-visible relative">
              <div className="flex cursor-pointer justify-center flex-row items-center gap-2"></div>
            </div>
          </div>
        </div>
        <div
          style={{ height: '1px' }}
          className={`w-full rounded dark:bg-brightModeColor bg-darkModeColor`}
        />
        <p className="text-lg whitespace-pre-line	">
          {selectedTopicPoint.content}
        </p>
      </div>

      <div
        className={`dark:text-brightModeColor text-darkModeColor flex flex-col gap-5 mt-24`}
      >
        <UserCommentCreation
          mutate={mutate}
          currentUserId={myUserId}
          selectedTopicPoint={selectedTopicPoint}
        />

        {!isLoading && userCommentList && userCommentList.length > 0 ? (
          userCommentList
            .sort(
              (a: any, b: any) =>
                Date.parse(b.createdAt) - Date.parse(a.createdAt)
            )
            .slice(
              currentPage * userCommentPerPage,
              (currentPage + 1) * userCommentPerPage
            )
            .map((userComment: UserComment, index: number) => {
              const createdDate = new Date(userComment.createdAt)
              return (
                <div key={index} className="flex flex-col gap-4">
                  <div className="flex flex-col">
                    <div className="flex justify-between">
                      <span
                        className="cursor-pointer hover:underline"
                        onClick={() =>
                          redirectToUserPage(
                            userComment.userId,
                            myUserId,
                            router
                          )
                        }
                      >
                        {userComment.name}
                      </span>
                      {userComment.userId.toString() ===
                        myUserId.toString() && (
                        <DeletionButton
                          primaryText="Diesen Kommentar löschen ?"
                          handleDelete={() => {
                            return handleDeleteComment(
                              userComment.userCommentId
                            )
                          }}
                        />
                      )}
                    </div>

                    <div className="flex flex-col xs:flex-row gap-2 text-sm">
                      <span className="font-bold">{`${createdDate.getDate()}/${
                        createdDate.getMonth() + 1
                      }/${createdDate.getFullYear()}(${getWeekdayName(
                        createdDate.getDay()
                      )})${createdDate.toLocaleTimeString()}`}</span>
                      <div className="flex flex-row gap-2 text-sm">
                        {' '}
                        <span className="font-bold">
                          Score: {userComment.upvoteCount}
                        </span>
                        <span
                          onClick={() => {
                            handleChangeUpvoteStatus(userComment.userCommentId)
                          }}
                          className="hover:underline cursor-pointer"
                        >
                          (vote Up)
                        </span>
                      </div>
                    </div>

                    <div
                      className={`py-4 ${
                        openImageList[index] === true
                          ? ''
                          : 'flex flex-row gap-8'
                      }`}
                    >
                      {userComment && userComment.imageBase64String !== '' && (
                        <Image
                          onClick={() => {
                            handleOpenImageChange(index)
                          }}
                          alt=""
                          width={500}
                          height={500}
                          className={`${
                            openImageList[index] === true
                              ? 'max-w-full max-h-full'
                              : 'w-60'
                          } cursor-pointer `}
                          src={
                            userComment?.imageBase64String?.slice(
                              2,
                              userComment?.imageBase64String.length - 1
                            ) || ''
                          }
                        />
                      )}
                      <div className="flex flex-col gap-3 py-4">
                        <span className="break-all whitespace-pre-line text-sm ">
                          {userComment.comment}
                        </span>
                      </div>
                    </div>
                    <div className="pb-4">
                      <div
                        style={{ height: '1px' }}
                        className="w-full bg-gray-600 rounded"
                      />
                    </div>
                  </div>
                </div>
              )
            })
        ) : (
          <div>Keine Kommentare</div>
        )}
      </div>
      {userCommentList && userCommentList.length > 0 && (
        <Pagination
          arrayLength={userCommentList?.length}
          itemsPerPage={userCommentPerPage}
          currentPage={currentPage}
          setCurrentPage={(currentPage: number) => {
            setCurrentPage(currentPage)
            setOpenImageList(openImageList.fill(false))
          }}
        />
      )}
    </div>
  ) : (
    <div></div>
  )
}
