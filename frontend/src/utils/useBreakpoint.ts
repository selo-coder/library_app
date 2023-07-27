import { useEffect, useState } from 'react'

const breakpoints = {
  0: 'xs',
  640: 'sm',
  768: 'md',
  1024: 'xl',
  1280: 'xl',
  1536: '2xl',
}

export const useBreakpoint = () => {
  const [windowSize, setWindowSize] = useState<{
    width: number
    height: number
  }>({ width: 0, height: 0 })
  const [breakpoint, setBreakPoint] = useState({
    breakpoint: '',
    width: 0,
    height: 0,
  })

  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }

  useEffect(() => {
    try {
      window.addEventListener('resize', handleResize)
      handleResize()

      if (600 < windowSize.width && windowSize.width < 768) {
        setBreakPoint({
          breakpoint: breakpoints['640'],
          width: windowSize.width,
          height: windowSize.height,
        })
      }
      if (960 < windowSize.width && windowSize.width < 1024) {
        setBreakPoint({
          breakpoint: breakpoints['768'],
          width: windowSize.width,
          height: windowSize.height,
        })
      }
      if (1280 < windowSize.width && windowSize.width < 1280) {
        setBreakPoint({
          breakpoint: breakpoints['1024'],
          width: windowSize.width,
          height: windowSize.height,
        })
      }
      if (1280 < windowSize.width && windowSize.width < 1536) {
        setBreakPoint({
          breakpoint: breakpoints['1280'],
          width: windowSize.width,
          height: windowSize.height,
        })
      }
      if (windowSize.width >= 1536) {
        setBreakPoint({
          breakpoint: breakpoints['1536'],
          width: windowSize.width,
          height: windowSize.height,
        })
      }

      setBreakPoint({
        ...breakpoint,
        width: windowSize.width,
        height: windowSize.height,
      })
    } catch (error) {
      console.log(error)
    }

    return () => window.removeEventListener('resize', handleResize)
  }, [windowSize.width])

  return [breakpoint]
}
