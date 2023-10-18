import { FC, memo } from 'react'
import { ArrowDown, ArrowUp } from 'assets'
import { useBreakpoint } from 'utils'
import { Subject, Topic } from 'components'

interface NavbarButtonProps {
  index: number
  setCurrentActiveNavbarItem: (page: number) => void
  currentActiveNavbarItem: number
  subject: Subject
  onClick: (subjectTitle: string) => void
  onClickTopic: (topicTitle: string, subjectTitle: string) => void
  count: number
}

const NavbarButton: FC<NavbarButtonProps> = ({
  index,
  setCurrentActiveNavbarItem,
  currentActiveNavbarItem,
  subject,
  onClick,
  onClickTopic,
  count,
}): JSX.Element => {
  const [breakpoint] = useBreakpoint()

  return (
    <div className="h-full relative w-full text-center z-30" key={index}>
      <button
        onClick={() => {
          onClick(subject.subjectTitle)
          setCurrentActiveNavbarItem(-1)
        }}
        onMouseEnter={() => setCurrentActiveNavbarItem(index)}
        onMouseLeave={() => {
          setCurrentActiveNavbarItem(-1)
        }}
        className={`text-xl h-full w-full absolute flex flex-row active:bg-red-600 text-center items-center z-50 flex flex-row justify-center gap-2 z-30 ${
          currentActiveNavbarItem === index ? 'bg-red-600' : 'bg-red-500'
        }`}
      >
        <span
          className={`truncate ${
            currentActiveNavbarItem === index && 'underline'
          } text-xs lg:text-sm`}
        >
          {subject.subjectTitle}
        </span>
        {breakpoint.width >= 768 &&
          (currentActiveNavbarItem === index && index !== count ? (
            <ArrowDown className="lg:w-4 lg:h-4 w-3 h-3" />
          ) : index !== count ? (
            <ArrowUp className="lg:w-4 lg:h-4 w-3 h-3" />
          ) : null)}
      </button>
      <div
        onMouseEnter={() => setCurrentActiveNavbarItem(index)}
        onMouseLeave={() => {
          setCurrentActiveNavbarItem(-1)
        }}
        className={`bg-red-500 flex-col duration-200 z-10 ease-in-out ${
          currentActiveNavbarItem === index && index !== count
            ? 'translate-y-[128px]'
            : 'translate-y-[-100%]'
        }`}
      >
        {subject.topicList.length === 0 && breakpoint.width > 768 && (
          <div className="w-full cursor-pointer py-4 px-2 2xl:px-10 bg-red-500 hover:bg-red-600">
            <span className="break-all text-center text-xs lg:text-sm">
              Keine Themen
            </span>
          </div>
        )}

        {breakpoint.width > 768 &&
          subject &&
          subject.topicList &&
          subject.topicList.map((topic: Topic, indexTopic: number) => {
            return (
              indexTopic <= count && (
                <div
                  key={indexTopic}
                  onClick={() =>
                    onClickTopic(topic.topicTitle, subject.subjectTitle)
                  }
                  className="w-full cursor-pointer py-4 px-2 2xl:px-10 bg-red-500 hover:bg-red-600"
                >
                  <span className="break-all text-center text-xs lg:text-sm">
                    {indexTopic !== 5 ? topic.topicTitle : 'Alle Themen ➔'}
                  </span>
                </div>
              )
            )
          })}
      </div>
    </div>
  )
}

export default memo(NavbarButton)
