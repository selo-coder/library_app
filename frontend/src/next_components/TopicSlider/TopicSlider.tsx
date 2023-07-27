import { FC, useEffect, useState } from 'react'
import { useKeenSlider } from 'keen-slider/react'

import { useBreakpoint } from '../../utils'
import { RecentTopicPoint } from '../NextAppContext'
import { ArrowLeft, ArrowRight } from '../../assets'
import { useRouter } from 'next/navigation'

interface TopicSliderProps {
  title: string
  topicPoints: RecentTopicPoint[]
  linkToUser?: boolean
}

const TopicSlider: FC<TopicSliderProps> = ({
  topicPoints,
  title,
  linkToUser = false,
}): JSX.Element => {
  const router = useRouter()
  const [loaded, setLoaded] = useState(false)

  const [breakpoint] = useBreakpoint()
  const [, setCurrentSlide] = useState<number>()

  const [slidesPerView, setSlidesPerView] = useState<number>(4)
  const [sliderRef, slider] = useKeenSlider(
    {
      slides: { perView: slidesPerView, spacing: 20 },
      loop: true,
    },
    [
      (slider) => {
        let timeout: ReturnType<typeof setTimeout>
        let mouseOver = false
        function clearNextTimeout() {
          clearTimeout(timeout)
        }
        function nextTimeout() {
          clearTimeout(timeout)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider?.next()
          }, 3000)
        }

        if (topicPoints.length > 1) {
          slider.on('created', () => {
            setLoaded(true)
            setCurrentSlide(0)

            slider.container.addEventListener('mouseover', () => {
              mouseOver = true
              clearNextTimeout()
            })
            slider.container.addEventListener('mouseout', () => {
              mouseOver = false
              nextTimeout()
            })
            nextTimeout()
          })
          slider.on('dragStarted', clearNextTimeout)
          slider.on('animationEnded', nextTimeout)
          slider.on('updated', nextTimeout)
          slider.on('slideChanged', (slider) =>
            setCurrentSlide(slider.track.details.rel)
          )
        }
      },
    ]
  )

  useEffect(() => {
    if (breakpoint.width > 1650) {
      setSlidesPerView(topicPoints.length < 4 ? topicPoints.length : 4)
    } else if (breakpoint.width > 1380) {
      setSlidesPerView(topicPoints.length < 3 ? topicPoints.length : 3)
    } else if (breakpoint.width > 650) {
      setSlidesPerView(topicPoints.length < 2 ? topicPoints.length : 2)
    } else {
      slider.current?.update()
      setSlidesPerView(1)
    }
  }, [breakpoint, slider, sliderRef, topicPoints])

  useEffect(() => {
    if (breakpoint.width > 1650) {
      slider.current?.update()
      setSlidesPerView(topicPoints.length < 4 ? topicPoints.length : 4)
    } else if (breakpoint.width > 1380) {
      slider.current?.update()
      setSlidesPerView(topicPoints.length < 3 ? topicPoints.length : 3)
    } else if (breakpoint.width > 650) {
      slider.current?.update()
      setSlidesPerView(topicPoints.length < 2 ? topicPoints.length : 2)
    } else {
      setSlidesPerView(1)
    }
  }, [])

  return (
    <div
      className={`${
        topicPoints.length === 2
          ? 'max-w-screen-2xl	'
          : topicPoints.length === 1
          ? 'max-w-5xl'
          : ''
      } pt-20 px-4 md:px-14 lg:px-20 xl:px-28 2xl:px-32 w-full`}
    >
      <div
        className={`dark:bg-darkModeColor bg-brightModeColor py-10 flex flex-col rounded-xl gap-10`}
      >
        <div className="flex flex-row items-center gap-4">
          <span className="text-2xl text-red-500 whitespace-nowrap">
            {title}
          </span>
          <div
            style={{ height: '1px' }}
            className="w-full bg-red-500 rounded"
          />
        </div>
        <div className="flex flex-row gap-8">
          {breakpoint.width >= 900 && topicPoints.length > 1 && (
            <button
              onClick={() => {
                slider.current?.prev()
              }}
              className="w-8 h-16 self-center flex items-center justify-center rounded hover:bg-red-500 hover:text-white"
            >
              <ArrowLeft
                className={`w-6 h-6 dark:fill-brightModeColor fill-darkModeColor`}
              />
            </button>
          )}

          {slider && sliderRef && (
            <div
              className={`flex flex-row keen-Slider w-full overflow-hidden`}
              ref={sliderRef}
            >
              {topicPoints?.map(
                (topicPoint: RecentTopicPoint, index: number) => (
                  <div
                    key={index}
                    className={`keen-slider__slide ${
                      'number-slide' + index + 1
                    } h-64 border-2 w-full border-red-700 bg-red-500 px-2 py-1 rounded`}
                  >
                    <div className="flex flex-row justify-between items-end text-white">
                      <span className="text-sm">
                        {topicPoint.topicPointTitle}
                      </span>
                      <span
                        onClick={() =>
                          router.push('/users/' + topicPoint.userId)
                        }
                        className={`text-xs ${
                          linkToUser && 'hover:underline cursor-pointer'
                        }`}
                      >
                        erstellt von {topicPoint.createdBy}
                      </span>
                    </div>
                    <div className="py-2">
                      <div
                        style={{ height: '1px' }}
                        className="w-full bg-white rounded"
                      />
                    </div>

                    <div className="flex flex-col gap-2 h-full overflow-hidden">
                      <div className="h-40 overflow-hidden">
                        <p
                          dangerouslySetInnerHTML={{
                            __html: topicPoint.content,
                          }}
                          className="text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex flex-row sticky bottom-1 py-1 justify-between">
                      <span />
                      <span
                        onClick={() =>
                          router.push(
                            '/' +
                              topicPoint.subjectTitle +
                              '/' +
                              topicPoint.topicTitle +
                              '/' +
                              topicPoint.topicPointTitle
                          )
                        }
                        className="text-xs cursor-pointer text-white hover:underline"
                      >
                        Mehr Anzeigen
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
          {breakpoint.width >= 900 && topicPoints.length > 1 && (
            <button
              onClick={() => {
                slider.current?.next()
              }}
              className="w-8 flex items-center justify-center h-16 self-center rounded hover:bg-red-500 hover:text-white"
            >
              <ArrowRight
                className={`w-6 h-6 dark:fill-brightModeColor fill-darkModeColor`}
              />
            </button>
          )}
        </div>
        {(loaded || topicPoints.length === 1) && (
          <div className="flex justify-center px-2 xs:px-10 gap-3 xs:gap-4">
            {[...Array.from(Array(topicPoints.length).keys())].map((idx) => {
              return (
                <button
                  key={idx}
                  onClick={() => {
                    slider.current?.moveToIdx(idx)
                  }}
                  className={
                    'xs:w-4 xs:h-4 w-3 h-3 rounded-full ' +
                    ((slider?.current?.track?.details?.rel || 0) === idx
                      ? 'bg-red-500'
                      : 'bg-gray-500')
                  }
                ></button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default TopicSlider
