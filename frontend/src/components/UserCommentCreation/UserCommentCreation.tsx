'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createComment } from 'api'
import { TopicPoint } from 'components'
import dynamic from 'next/dynamic'
import { FC, useState } from 'react'
import { useCookies } from 'react-cookie'
import { KeyedMutator } from 'swr'

const Spinner = dynamic(() => import('../../assets/Spinner'))

const TextareaInput = dynamic(() => import('../common/TextareaInput'))

interface UserCommentCreationProps {
  mutate: KeyedMutator<any>
  currentUserId: string
  selectedTopicPoint: TopicPoint
}

const UserCommentCreation: FC<UserCommentCreationProps> = ({
  mutate,
  currentUserId,
  selectedTopicPoint,
}) => {
  const [showInput, setShowInput] = useState(false)
  const [textAreaInput, setTextAreaInput] = useState('')
  const [selectedImage, setSelectedImage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [cookie] = useCookies(['jwtToken'])

  const handleImageChange = (e: any) => {
    const data = new FileReader()
    data.addEventListener('load', () => {
      setSelectedImage(data.result as string)
    })
    data.readAsDataURL(e.target.files[0])
  }

  const handleCreateComment = async (): Promise<void> => {
    try {
      setIsLoading(true)
      const response = await createComment({
        jwtToken: cookie.jwtToken,
        body: {
          userId: currentUserId,
          topicPointId: selectedTopicPoint?.topicPointId || '',
          comment: textAreaInput,
          ...(selectedImage && { imageBase64String: selectedImage }),
        },
      })
      if (response.statusCode === 200 && selectedTopicPoint) {
        mutate()
        setIsLoading(false)
        setShowInput(false)
        setTextAreaInput('')
        setSelectedImage('')
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
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
        <div className="flex flex-col gap-4 mb-4 w-full">
          <div className="text-black w-full">
            <TextareaInput
              content={textAreaInput}
              setContent={setTextAreaInput}
              size="small"
            />
          </div>

          <div className="flex flex-col-reverse lg:flex-row w-full gap-3 lg:gap-2 justify-between items-center">
            <div className="flex flex-row w-full gap-2">
              <button
                onClick={() => {
                  if (
                    (textAreaInput || selectedImage) &&
                    showInput &&
                    !isLoading
                  ) {
                    handleCreateComment()
                  }
                }}
                className={`dark:text-brightModeColor text-darkModeColor border-2 border-red-500 hover:bg-red-500 hover:text-white rounded py-1 px-2`}
              >
                {isLoading ? (
                  <Spinner className="w-6 text-gray-200 animate-spin dark:text-gray-600 fill-white" />
                ) : (
                  'Erstellen'
                )}
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
                className="text-white"
                type="file"
                accept=".png,.jpg,.jpeg"
                onChange={handleImageChange}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default UserCommentCreation
