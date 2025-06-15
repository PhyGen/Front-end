import MainScreen from "../pages/MainScreen"; 
import Landing from "../pages/Landing";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import Profile from "../pages/Profile";
import AuthWrapper from "../components/AuthWrapper";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import DataDeletion from "../pages/DataDeletion";


const publicRoutes = [
    { path: '/landing', component: Landing, layout: null },
    { path: '/signup', component: Signup, layout: null},
    { path: '/signin', component: Signin, layout: null},
    { path: '/privacy-policy', component: PrivacyPolicy, layout: null},
    { path: '/data-deletion', component: DataDeletion, layout: null},
];

const privateRoutes = [
    { path: '/', component: MainScreen, layout: null, wrapper: AuthWrapper },
    { path: '/profile', component: Profile, layout: null, wrapper: AuthWrapper },
    // { path: '/payment', component: Payment, layout: HeaderOnly, role: 'user'},
    // { path: '/customer', component: CustomerLayout,layout : null, role: 'user'},
    // { path: '/admin',component: AdminLayout, layout: null, role: 'admin'},
    // { path: '/shipper',component: ShipperLayout, layout: null, role: 'shipper'},
    // { path: '/staff',component: StaffLayout, layout: null, role: 'staff'},
];

export { publicRoutes, privateRoutes };