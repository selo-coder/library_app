'use client'

/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext } from 'react'

export type SubjectList = Subject[]

export type TopicPoint = {
  topicPointTitle: string
  topicPointId: string
  content: string
  createdAt: string
  createdBy: string
  userId: string
  topicTitle: string
  favorite: boolean
}

export type TopicPointList = {
  subjectTitle: string
  subjectId: string
  topicPointList: TopicPoint[]
}

export type RecentTopicPoint = TopicPoint & {
  subjectId: string
  subjectTitle: string
}

export type Subject = {
  subjectTitle: string
  subjectId: string
  topicList: Topic[]
}

export type Topic = {
  topicTitle: string
  topicId: string
}

export type User = {
  userId: string
  userName: string
  lastCreatedItemDate: string | null
}

export type UserComment = {
  userCommentId: string
  userId: string
  name: string
  comment: string
  upvoteCount: number
  createdAt: string
  imageBase64String?: string
}

export type SortType = 'Neu zuerst' | 'Alt zuerst' | 'A - Z' | 'Z - A'

export type NextAppContextType = {
  subjectList: SubjectList
  setSubjectList: (subjectList: SubjectList) => void
  topicPointsList: TopicPointList
  setTopicPointsList: (topicPointList: TopicPointList) => void
  topicList: Subject
  setTopicList: (topicPointList: Subject) => void
  loggedIn: boolean | undefined
  setLoggedIn: (loggedIn: boolean | undefined) => void
}

const NextAppContext = createContext<NextAppContextType>({
  subjectList: {} as SubjectList,
  setSubjectList: () => {},
  topicPointsList: {} as TopicPointList,
  setTopicPointsList: () => {},
  topicList: {} as Subject,
  setTopicList: () => {},
  loggedIn: false,
  setLoggedIn: () => {},
})

export default NextAppContext
