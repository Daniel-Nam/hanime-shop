// Public
import Home from '~/pages/Home'
import Login from '~/pages/Auth/Login'
import Register from '~/pages/Auth/Register'
import ProductDetail from '~/pages/ProductDetail'
import NotFound from '~/pages/NotFound'
import User from '~/pages/User'
import Search from '~/pages/Search'

// Private
import Bookmarks from '~/pages/Bookmarks'
import UpgradeToSeller from '~/pages/UpgradeToSeller'
import Upload from '~/pages/Seller/Upload'
import Settings from '~/pages/Settings'
import Notifications from '~/pages/Notifications'
import Cart from '~/pages/Cart'
import Profile from '~/pages/Profile'
import Shop from '~/pages/Seller/Shop'
import Recent from '~/pages/Recent'

// Layout
import { NoSidebar } from '~/layouts'

export const publicRoutes = [
	{
		path: '/',
		component: Home,
	},
	{
		path: '/login',
		component: Login,
		layout: null,
	},
	{
		path: '/register',
		component: Register,
		layout: null,
	},
	{
		path: '/product/:slug',
		component: ProductDetail,
	},
	{
		path: '/@:username',
		component: User,
	},
	{
		path: '/search',
		component: Search,
		layout: NoSidebar,
	},
	{
		path: '/not-found',
		component: NotFound,
	},
	{
		path: '*',
		component: NotFound,
	},
]

export const privateRoutes = [
	{
		path: '/bookmarks',
		component: Bookmarks,
	},
	{
		path: '/upload',
		component: Upload,
		layout: null,
	},
	{
		path: '/upgrade-to-seller',
		component: UpgradeToSeller,
	},
	{
		path: '/settings',
		component: Settings,
		layout: NoSidebar,
	},
	{
		path: '/notifications',
		component: Notifications,
	},
	{
		path: '/cart',
		component: Cart,
	},
	{
		path: '/profile',
		component: Profile,
	},
	{
		path: '/shop',
		component: Shop,
	},
	{
		path: '/recent',
		component: Recent,
	},
]
