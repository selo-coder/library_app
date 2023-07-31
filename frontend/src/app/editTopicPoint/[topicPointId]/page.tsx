'use client'

import { useContext, useEffect, useState } from 'react'
import {
  NextAppContext,
  Subject,
  Topic,
  TopicPoint,
  TopicPointList,
  Input,
  ErrorMessage,
  TextareaInput,
} from '../../../next_components'
import { useCookies } from 'react-cookie'
import { useRouter } from 'next/navigation'
import { checkForErrors, filterErrors, getCurrentUserId } from '../../../utils'
import {
  useGetTopicPointsByUserId,
  useEditTopicPoint as useEditTopicPointHook,
  useGetRecentTopicPoints,
  useGetSubjects,
} from '../../../next_api'
import { ErrorType } from '../../../types'
import { ArrowLeft, ArrowUp, Spinner } from '../../../assets'

export default function Page({ params }: { params: { topicPointId: string } }) {
  const [cookie] = useCookies(['jwtToken'])

  const { subjectList, setTopicPointsList, setTopicList } =
    useContext(NextAppContext)

  const [selectedTopicPoint, setSelectedTopicPoint] = useState<TopicPoint>(
    {} as TopicPoint
  )

  const [subjectDropDownIsOpen, setSubjectDropDownIsOpen] =
    useState<boolean>(false)
  const [topicDropDownIsOpen, setTopicDropDownIsOpen] = useState<boolean>(false)
  const [showCreateTopicCreation, setShowTopicCreation] =
    useState<boolean>(false)

  const [currentSelectedSubject, setCurrentSelectedSubject] =
    useState<Subject>()

  const [initialCurrentSelectedSubject, setInitialCurrentSelectedSubject] =
    useState<Subject>()

  const [currentSelectedTopic, setCurrentSelectedTopic] = useState<Topic>()
  const [initialCurrentSelectedTopic, setInitialCurrentSelectedTopic] =
    useState<Topic>()

  const [content, setContent] = useState<string>('')
  const [initialContent, setInitialContent] = useState<string>('')

  const [topicPointTitle, setTopicPointTitle] = useState<string>('')
  const [initialTopicPointTitle, setInitialTopicPointTitle] =
    useState<string>('')

  const [errorMessages, setErrorMessages] = useState<string[]>([])
  const [createClicked, setCreateClicked] = useState<boolean>(false)
  const [creationLoading, setCreationLoading] = useState<boolean>(false)
  const [topicAlreadyExists, setTopicAlreadyExists] = useState<boolean>(false)
  const [generalError, setGeneralError] = useState<boolean>(false)
  const [topicHasChanged, setTopicHasChanged] = useState<boolean>(false)

  const router = useRouter()

  const { userTopicPointsList } = useGetTopicPointsByUserId(
    getCurrentUserId(cookie.jwtToken)
  )

  useEffect(() => {
    if (createClicked)
      checkForErrors(errorList).then(async (errors: string[]) =>
        setErrorMessages(errors)
      )
  }, [
    topicAlreadyExists,
    generalError,
    createClicked,
    content,
    currentSelectedTopic,
    currentSelectedSubject,
    topicPointTitle,
    topicHasChanged,
  ])

  useEffect(() => {
    if (userTopicPointsList) {
      const selectedTopicList = userTopicPointsList.find(
        (topicPointsList: TopicPointList) =>
          topicPointsList.topicPointList.find(
            (topicPoint: TopicPoint) =>
              topicPoint.topicPointId.toString() === params.topicPointId
          )
      )

      setCurrentSelectedSubject(
        subjectList.find(
          (subject: Subject) =>
            subject.subjectTitle === selectedTopicList?.subjectTitle
        ) || ({} as Subject)
      )

      setInitialCurrentSelectedSubject(currentSelectedSubject)

      setCurrentSelectedTopic(
        currentSelectedSubject?.topicList?.find(
          (topic: Topic) => topic.topicTitle === selectedTopicPoint.topicTitle
        )
      )
      setInitialCurrentSelectedTopic(currentSelectedTopic)

      setSelectedTopicPoint(
        selectedTopicList?.topicPointList?.find(
          (topicPoint: TopicPoint) =>
            topicPoint.topicPointId.toString() === params.topicPointId
        ) || ({} as TopicPoint)
      )
    }
  }, [userTopicPointsList, initialCurrentSelectedSubject])

  useEffect(() => {
    if (selectedTopicPoint) {
      setContent(selectedTopicPoint.content || '')
      setInitialContent(selectedTopicPoint.content || '')

      setTopicPointTitle(selectedTopicPoint.topicPointTitle || '')
      setInitialTopicPointTitle(selectedTopicPoint.topicPointTitle || '')
    }
  }, [selectedTopicPoint])

  const errorList: ErrorType[] = [
    {
      condition:
        !currentSelectedSubject ||
        !currentSelectedTopic ||
        currentSelectedSubject?.subjectId === '' ||
        currentSelectedSubject?.subjectTitle === '' ||
        currentSelectedTopic?.topicId === '' ||
        currentSelectedTopic?.topicTitle === '' ||
        !content ||
        !topicPointTitle,
      errorMessage: 'Alle Felder müssen ausgefüllt sein. Eingaben überprüfen.',
    },
    {
      condition: topicAlreadyExists && createClicked && !topicHasChanged,
      errorMessage: 'Thema existiert bereits.',
    },
    {
      condition: generalError && createClicked,
      errorMessage:
        'Fehler bei der Erstellung. Bitte die Eingaben überprüfen und erneut probieren.',
    },
  ]

  const { mutateSubjects } = useGetSubjects()
  const { mutateRecentTopicPoints } = useGetRecentTopicPoints()

  const useEditTopicPoint = useEditTopicPointHook()

  const resetData = (): void => {
    mutateRecentTopicPoints()
    mutateSubjects()
    setTopicPointsList({} as TopicPointList)
    setTopicList({} as Subject)
  }

  const initiateCreateTopicPoint = async () => {
    try {
      checkForErrors(errorList).then(async (errors: string[]) => {
        setErrorMessages(errors)
        if (
          filterErrors(errors, [
            'Fehler bei der Erstellung. Bitte die Eingaben überprüfen und erneut probieren.',
            'Thema existiert bereits.',
          ])?.length === 0
        ) {
          setCreationLoading(true)

          const obj = {
            jwtToken: cookie.jwtToken,
            topicPointId: params.topicPointId || '',
            ...(topicPointTitle !== initialTopicPointTitle && {
              topicPointTitle,
            }),
            ...(currentSelectedTopic?.topicId !==
              initialCurrentSelectedTopic?.topicId && {
              topicId: currentSelectedTopic?.topicId,
            }),
            ...(content !== initialContent && { content }),
            ...(showCreateTopicCreation &&
              currentSelectedTopic?.topicId === '-1' && {
                subjectId: currentSelectedSubject?.subjectId,
                topicTitle: currentSelectedTopic?.topicTitle,
                createNewTopic: 'true',
              }),
          }

          const response = await useEditTopicPoint(obj)

          if (response.statusCode === 200) {
            setCreationLoading(false)

            resetData()
            router.push(
              '/' +
                currentSelectedSubject?.subjectTitle +
                '/' +
                currentSelectedTopic?.topicTitle +
                '/' +
                topicPointTitle
            )
          }
          if (response.statusCode === 500) {
            response.message === 'Duplicate'
              ? setTopicAlreadyExists(true)
              : setGeneralError(true)

            setTopicHasChanged(false)
            setCreationLoading(false)
          }
        }
      })
    } catch (error) {
      console.log(error)
    }
    setCreationLoading(false)
  }

  return (
    <div className="px-8 md:px-16 flex gap-4 xl:gap-14 mt-8 flex-col xl:flex-row">
      <div className="w-full flex flex-col mt-4 gap-8 xl:w-3/4">
        <span
          className={`dark:text-brightModeColor text-darkModeColor text-2xl`}
        >
          Beitrag Inhalt
        </span>
        <TextareaInput content={content} setContent={setContent} size="big" />
      </div>

      <div
        className={`dark:bg-darkModeColor bg-brightModeColor w-full rounded-xl border-red-500 flex gap-12 flex-col py-20 max-w-xl `}
      >
        <Input
          value={topicPointTitle}
          placeHolder="Beitrag Titel"
          onChange={(value: string) => {
            setTopicPointTitle(value)
          }}
        />
        <div className="w-full relative z-20">
          <div
            className="border flex items-center relative border-1 border-black w-full py-3 bg-red-500 cursor-pointer"
            onClick={() => {
              setSubjectDropDownIsOpen(!subjectDropDownIsOpen)
              setTopicDropDownIsOpen(false)
            }}
          >
            <div className="flex flex-row justify-between relativ w-full px-8 items-center">
              <span className="text-white">
                {currentSelectedSubject?.subjectTitle || 'Fach auswählen'}
              </span>
              <ArrowUp className="lg:w-4 lg:h-4 w-3 h-3" />
            </div>
          </div>
          {subjectDropDownIsOpen && (
            <div className="w-full absolute border border-black border-1 z-20">
              {subjectList.map(
                (subject: Subject, index: number) =>
                  currentSelectedSubject?.subjectTitle !==
                    subject.subjectTitle && (
                    <div
                      onClick={() => {
                        setSubjectDropDownIsOpen(false)
                        setCurrentSelectedSubject(subject)
                        setTopicDropDownIsOpen(false)
                        if (!showCreateTopicCreation)
                          setCurrentSelectedTopic(undefined)
                      }}
                      key={index}
                      className="bg-red-500 py-3 pl-8 hover:bg-red-600 cursor-pointer"
                    >
                      <span className="text-white">{subject.subjectTitle}</span>
                    </div>
                  )
              )}
            </div>
          )}
        </div>

        <div className="w-full relative gap-12 z-10">
          {showCreateTopicCreation ? (
            <div className="flex flex-col gap-2">
              <div
                className="flex flex-row items-center gap-2 cursor-pointer"
                onClick={() => {
                  setShowTopicCreation(false)
                  setCurrentSelectedTopic(undefined)
                }}
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Zurück</span>
              </div>

              <Input
                value={currentSelectedTopic?.topicTitle}
                placeHolder="Thema"
                onChange={(value: string) => {
                  setTopicHasChanged(true)

                  setCurrentSelectedTopic({ topicId: '-1', topicTitle: value })
                }}
              />
            </div>
          ) : (
            <button
              className={
                'border flex items-center border-1 border-black w-full py-3 bg-red-500 cursor-pointer '
              }
              onClick={() => {
                setTopicDropDownIsOpen(!topicDropDownIsOpen)
              }}
            >
              <div className="flex flex-row justify-between w-full px-8 items-center">
                <span className="text-white">
                  {currentSelectedTopic?.topicTitle || 'Thema auswählen'}
                </span>
                <ArrowUp className="lg:w-4 lg:h-4 w-3 h-3" />
              </div>
            </button>
          )}

          {topicDropDownIsOpen && (
            <div className="w-full border absolute border-black border-1 z-10">
              <div
                onClick={() => {
                  setShowTopicCreation(true)
                  setCurrentSelectedTopic(undefined)

                  setTopicDropDownIsOpen(false)
                }}
                className="bg-red-500 py-3 pl-8 hover:bg-red-600 cursor-pointer"
              >
                <span className="text-white underline">
                  {'Neues Thema erstellen'}
                </span>
              </div>
              {subjectList &&
                subjectList
                  ?.find(
                    (subject) =>
                      subject.subjectTitle ===
                      currentSelectedSubject?.subjectTitle
                  )
                  ?.topicList?.map((topic: Topic, index: number) => {
                    return (
                      <div
                        onClick={() => {
                          setCurrentSelectedTopic(topic)
                          setTopicHasChanged(true)
                          setTopicDropDownIsOpen(false)
                        }}
                        key={index}
                        className="bg-red-500 py-3 pl-8 hover:bg-red-600 cursor-pointer"
                      >
                        <span className="text-white">{topic.topicTitle}</span>
                      </div>
                    )
                  })}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-6">
          <button
            className={
              'border flex bg-white rounded-xl justify-center text-black items-center border-1 border-red-500 w-full py-3 hover:text-white hover:bg-red-500 cursor-pointer'
            }
            onClick={() => {
              setCreateClicked(true)
              initiateCreateTopicPoint()
            }}
          >
            {creationLoading ? (
              <Spinner className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-white" />
            ) : (
              'Beitrag erstellen'
            )}
          </button>
          <ErrorMessage errorMessages={errorMessages} />
        </div>
      </div>
    </div>
  )
}
