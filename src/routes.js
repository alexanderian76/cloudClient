import { ADMIN_ROUTE, DEVICE_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE, LOGIN_ROUTE, BASKET_ROUTE } from "./utils/consts"
import Admin from './pages/Admin'
import Auth from "./pages/Auth";

export const authRoutes = [
    {
        route: ADMIN_ROUTE,
        Element: Admin
    },
]

export const publicRoutes = [
    
    {
        route: LOGIN_ROUTE,
        Element: Auth
    },
    {
        route: REGISTRATION_ROUTE,
        Element: Auth
    },
    

]