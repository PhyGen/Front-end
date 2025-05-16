import Home from "../pages/Home";
import Landing from "../pages/Landing";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import Profile from "../pages/Profile";

const publicRoutes = [
    { path: '/', component: Home,layout: null},
    { path: '/landing', component: Landing, layout: null },
    { path: '/signup', component: Signup, layout: null},
    { path: '/signin', component: Signin, layout: null},
    { path: '/profile', component: Profile, layout: null},
];

const privateRoutes = [
    // { path: '/payment', component: Payment, layout: HeaderOnly, role: 'user'},
    // { path: '/customer', component: CustomerLayout,layout : null, role: 'user'},
    // { path: '/admin',component: AdminLayout, layout: null, role: 'admin'},
    // { path: '/shipper',component: ShipperLayout, layout: null, role: 'shipper'},
    // { path: '/staff',component: StaffLayout, layout: null, role: 'staff'},
];

export { publicRoutes, privateRoutes };