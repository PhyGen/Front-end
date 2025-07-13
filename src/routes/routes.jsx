import MainScreen from "../pages/MainScreen"; 
import Landing from "../pages/Landing";
import Signin from "../pages/Signin";
import Signup from "../pages/Signup";
import AuthWrapper from "../components/AuthWrapper";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import DataDeletion from "../pages/DataDeletion";
import DefaultLayout from "../layouts/defaultLayout/defaultLayout";
import ModLayout from "../pages/Mod/ModLayout";
import Admin from "../pages/Admin/Admin";
import CardDetail from '../components/CardDetail';

console.log('Loading routes, ModLayout:', ModLayout);

const publicRoutes = [
    { path: '/landing', component: Landing, layout: null },
    { path: '/signup', component: Signup, layout: null},
    { path: '/signin', component: Signin, layout: null},
    { path: '/privacy-policy', component: PrivacyPolicy, layout: null},
    { path: '/data-deletion', component: DataDeletion, layout: null},
    { path: '/card-detail/:itemId', component: CardDetail, layout: null }, // Thêm route CardDetail
];

const privateRoutes = [
    { path: '/', component: MainScreen, layout: DefaultLayout, wrapper: AuthWrapper },
    { path: '/mod', component: ModLayout, layout: null, wrapper: AuthWrapper },
    { path: '/admin', component: Admin, layout: null, wrapper: AuthWrapper },
    // { path: '/payment', component: Payment, layout: HeaderOnly, role: 'user'},
    // { path: '/customer', component: CustomerLayout,layout : null, role: 'user'},
    // { path: '/admin',component: AdminLayout, layout: null, role: 'admin'},
    // { path: '/shipper',component: ShipperLayout, layout: null, role: 'shipper'},
    // { path: '/staff',component: StaffLayout, layout: null, role: 'staff'},
];

console.log('Private routes defined:', privateRoutes);

export { publicRoutes, privateRoutes };