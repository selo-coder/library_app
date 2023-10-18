import dynamic from 'next/dynamic'
import NextAppContext from './NextAppContext'

const Footer = dynamic(() => import('./Footer'))
const Breadcrumbs = dynamic(() => import('./Breadcrumbs'))
const Navbar = dynamic(() => import('./Navbar'))
const Sidebar = dynamic(() => import('./Sidebar'))
const TopicPointDeletionButton = dynamic(() => import('./DeletionButton'))
const TopicPointFavoriteButton = dynamic(
  () => import('./TopicPointFavoriteButton')
)
const TopicsContent = dynamic(() => import('./TopicsContent'))
const TopicSlider = dynamic(() => import('./TopicSlider'))
const AccountDropDownMenu = dynamic(() => import('./AccountDropDownMenu'))

export * from './NextAppContext'
export * from './common'

export {
  Breadcrumbs,
  Footer,
  Navbar,
  Sidebar,
  TopicPointDeletionButton,
  TopicPointFavoriteButton,
  TopicsContent,
  TopicSlider,
  NextAppContext,
  AccountDropDownMenu,
}
