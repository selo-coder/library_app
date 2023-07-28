/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Parser from 'html-react-parser'
import { getCrumbsFromPathname, getCurrentUserId } from '../../../../utils'
import { useCookies } from 'react-cookie'
import { Pen } from '../../../../assets'
import {
  TopicPointDeletionButton,
  TopicPointFavoriteButton,
  NextAppContext,
  TopicPoint,
  UserComment,
  Pagination,
} from '../../../../next_components/'
import {
  useGetCommentsByTopicPointId,
  useCreateComment as useCreateCommentHook,
  useChangeUpvoteStatus as useChangeUpvoteStatusHook,
} from '../../../../next_api'
import dynamic from 'next/dynamic'

const CKEditorComponent = dynamic(
  () => import('../../../../next_components/CKEditorComponent'),
  { ssr: false }
)

export default function Page() {
  const { topicPointsList } = useContext(NextAppContext)
  const router = useRouter()
  const pathnameArray = getCrumbsFromPathname()

  const [cookie] = useCookies(['jwtToken'])
  const [showInput, setShowInput] = useState(false)
  const [textAreaInput, setTextAreaInput] = useState('')
  const [update, setUpdate] = useState(false)
  const [openImageList, setOpenImageList] = useState<boolean[]>([])
  const [selectedImage, setSelectedImage] = useState('')
  const [userCommentPerPage] = useState<number>(4)
  const [currentPage, setCurrentPage] = useState<number>(0)
  const currentUserId = getCurrentUserId(cookie.jwtToken)
  const [selectedTopicPoint, setSelectedTopicPoint] = useState<TopicPoint>()

  const [userCommentList, setUserCommentList] = useState<UserComment[]>()

  const { commentList, mutate, isLoading } = useGetCommentsByTopicPointId(
    selectedTopicPoint?.topicPointId
  )

  useEffect(() => {
    setUserCommentList(commentList)
  }, [commentList])

  useEffect(() => {
    if (userCommentList) setOpenImageList(userCommentList.map(() => false))
  }, [userCommentList])

  const handleOpenImageChange = (imageIndex: number) => {
    openImageList.splice(imageIndex, 1, !openImageList[imageIndex])
    setUpdate(!update)
  }

  const useChangeUpvoteStatus = useChangeUpvoteStatusHook()
  const handleChangeUpvoteStatus = async (
    userCommentId: string
  ): Promise<void> => {
    try {
      const response = await useChangeUpvoteStatus({
        jwtToken: cookie.jwtToken,
        userId: currentUserId,
        userCommentId,
      })
      if (response.statusCode === 200 && selectedTopicPoint) {
        mutate()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const useCreateComment = useCreateCommentHook()
  const handleCreateComment = async (): Promise<void> => {
    try {
      const response = await useCreateComment({
        jwtToken: cookie.jwtToken,
        userId: currentUserId,
        topicPointId: selectedTopicPoint?.topicPointId || '',
        comment: textAreaInput,
        ...(selectedImage && { imageBase64String: selectedImage }),
      })
      if (response.statusCode === 200 && selectedTopicPoint) {
        mutate()
        setShowInput(false)
        setTextAreaInput('')
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

  const handleImageChange = (e: any) => {
    const data = new FileReader()
    data.addEventListener('load', () => {
      setSelectedImage(data.result as string)
    })
    data.readAsDataURL(e.target.files[0])
  }

  return selectedTopicPoint ? (
    <div className="flex flex-col px-4 md:px-12 lg:px-32 xl:px-40 2xl:px-52 py-20">
      <div className="flex justify-end flex-row gap-3">
        {selectedTopicPoint?.userId == currentUserId && (
          <div
            onClick={() =>
              router.push('/editTopicPoint/' + selectedTopicPoint.topicPointId)
            }
          >
            <Pen className="w-8 h-8 cursor-pointer stroke-red-500" />
          </div>
        )}

        {selectedTopicPoint?.userId == currentUserId && (
          <TopicPointDeletionButton selectedTopicPoint={selectedTopicPoint} />
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
        <p className="text-lg">{Parser(selectedTopicPoint.content)}</p>
      </div>

      <div
        className={`dark:text-brightModeColor text-darkModeColor flex flex-col gap-5 mt-24`}
      >
        <div
          className={`flex flex-col lg:flex-row justify-between gap-6 lg:gap-0 lg:items-center mb-4`}
        >
          <span className={'text-lg font-bold underline'}>Kommentare</span>
          <button
            onClick={() => setShowInput(!showInput)}
            className={`dark:text-brightModeColor text-darkModeColor border-2 border-red-500 hover:bg-red-500 hover:text-white rounded p-2`}
          >
            Kommentar verfassen
          </button>
        </div>
        {showInput && (
          <div className="flex flex-col gap-4 mb-4">
            <div className="text-black">
              <CKEditorComponent
                content={textAreaInput}
                setContent={setTextAreaInput}
              />
            </div>

            <div className="flex flex-col-reverse lg:flex-row w-full gap-3 lg:gap-2 justify-between items-center">
              <div className="flex flex-row w-full gap-2">
                <button
                  onClick={() => {
                    if ((textAreaInput || selectedImage) && showInput) {
                      handleCreateComment()
                    }
                  }}
                  className={`dark:text-brightModeColor text-darkModeColor border-2 border-red-500 hover:bg-red-500 hover:text-white rounded py-1 px-2`}
                >
                  Erstellen
                </button>
                <button
                  onClick={() => setShowInput(false)}
                  className={`dark:text-brightModeColor text-darkModeColor border-2 border-red-500 hover:bg-red-500 hover:text-white rounded py-1 px-2`}
                >
                  Abbrechen
                </button>
              </div>
              <div className="w-full flex flex-col items-start lg:items-end	">
                <input
                  className="text-white "
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  onChange={handleImageChange}
                />
              </div>
            </div>
          </div>
        )}

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
            .map((userComment: UserComment, index: number) => (
              <div key={index} className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <div className="flex">
                    <span
                      className="cursor-pointer hover:underline"
                      onClick={() =>
                        router.push('/users/' + userComment.userId)
                      }
                    >
                      {userComment.name}
                    </span>
                  </div>

                  <div className="flex flex-row gap-2 text-sm">
                    <span className="font-bold">
                      Gepostet am {userComment.createdAt}
                    </span>
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

                  <div
                    className={`py-4 ${
                      openImageList[index] === true ? '' : 'flex flex-row gap-8'
                    }`}
                  >
                    {userComment && userComment.imageBase64String !== '' && (
                      <img
                        onClick={() => {
                          handleOpenImageChange(index)
                        }}
                        className={`${
                          openImageList[index] === true
                            ? 'max-w-full max-h-full'
                            : 'w-60'
                        } cursor-pointer `}
                        src={userComment?.imageBase64String?.slice(
                          2,
                          userComment?.imageBase64String.length - 1
                        )}
                      />
                    )}
                    <div className="flex flex-col gap-3 py-4">
                      <span className="break-all text-sm">
                        {Parser(userComment.comment)}
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
            ))
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
