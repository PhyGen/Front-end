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
import MyExam from '../pages/MyExam';
import Home from '../pages/Home';
import Recently from '../pages/Recently';
import TrashCan from '../pages/TrashCan';
import PhyGenVideo from '../pages/PhyGenVideo';
import { Navigate } from 'react-router-dom';

console.log('Loading routes, ModLayout:', ModLayout);

const publicRoutes = [
    { path: '/landing', component: Landing, layout: null },
    { path: '/signup', component: Signup, layout: null},
    { path: '/signin', component: Signin, layout: null},
    { path: '/privacy-policy', component: PrivacyPolicy, layout: null},
    { path: '/data-deletion', component: DataDeletion, layout: null},
];

const privateRoutes = [
    { path: '/', component: MainScreen, layout: DefaultLayout, wrapper: AuthWrapper },
    { path: '/home', component: MainScreen, layout: DefaultLayout, wrapper: AuthWrapper },
    { path: '/myexam', component: MyExam, layout: DefaultLayout, wrapper: AuthWrapper },
    { path: '/myexam/:id', component: MyExam, layout: DefaultLayout, wrapper: AuthWrapper },
    { path: '/question/:id', component: Home, layout: DefaultLayout, wrapper: AuthWrapper },
    { path: '/recently', component: Recently, layout: DefaultLayout, wrapper: AuthWrapper },
    { path: '/trashcan', component: TrashCan, layout: DefaultLayout, wrapper: AuthWrapper },
    { path: '/pgvideo', component: PhyGenVideo, layout: DefaultLayout, wrapper: AuthWrapper },
    { path: '/mod', component: () => <Navigate to="/mod/grade" />, layout: null, wrapper: AuthWrapper },
    { path: '/mod/grade', component: ModLayout, layout: null, wrapper: AuthWrapper },
    { path: '/mod/semester', component: ModLayout, layout: null, wrapper: AuthWrapper },
    { path: '/mod/chapter', component: ModLayout, layout: null, wrapper: AuthWrapper },
    { path: '/mod/lesson', component: ModLayout, layout: null, wrapper: AuthWrapper },
    { path: '/mod/textbook', component: ModLayout, layout: null, wrapper: AuthWrapper },
    { path: '/mod/question', component: ModLayout, layout: null, wrapper: AuthWrapper },
    { path: '/mod/setting', component: ModLayout, layout: null, wrapper: AuthWrapper },
    { path: '/mod/pgvideo', component: ModLayout, layout: null, wrapper: AuthWrapper },
    { path: '/admin', component: Admin, layout: null, wrapper: AuthWrapper },
    // { path: '/payment', component: Payment, layout: HeaderOnly, role: 'user'},
    // { path: '/customer', component: CustomerLayout,layout : null, role: 'user'},
    // { path: '/admin',component: AdminLayout, layout: null, role: 'admin'},
    // { path: '/shipper',component: ShipperLayout, layout: null, role: 'shipper'},
    // { path: '/staff',component: StaffLayout, layout: null, role: 'staff'},

];

console.log('Private routes defined:', privateRoutes);

export { publicRoutes, privateRoutes };