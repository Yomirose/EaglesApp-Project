import { createBrowserRouter } from "react-router-dom";
import Register from "../pages/Register";
import VerifyEmail from "../pages/VerifyEmail";
import VerifyPassword from "../pages/VerifyPassword";
import Home from "../pages/Home";
import MessagePage from "../components/MessagePage";
import App from "../App";
import AuthLayOuts from "../layout";
import ForgotPassword from "../pages/ForgotPassword";

const router = createBrowserRouter([
{
    path: "/",
    element: < App />,
    children: [
        {
            path: "register",
            element: <AuthLayOuts>< Register /></AuthLayOuts>
        },
        {
            path: "email",
            element: <AuthLayOuts>< VerifyEmail /></AuthLayOuts>
        },
        {
            path: "password",
            element: <AuthLayOuts>< VerifyPassword /></AuthLayOuts>
        },
        {
            path: "forgot-password",
            element: <AuthLayOuts><ForgotPassword/></AuthLayOuts>
        },
        { 
            path: "",
            element: < Home />,
            children: [
                {
                    path: ":userId",
                    element: < MessagePage /> 
                }
            ]
        }
    ]
}
])
export default router;