import { createBrowserRouter } from "react-router";
import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";
import Register from "../Auth/Register";
import Login from "../Auth/Login";
import PrivateRoute from "./PrivateRoute";
import AddMedia from "../components/MediaLibrary/AddMedia";
import AllNews from "../components/AllNews";
import Inbox from "../components/career/Inbox";

export const router = createBrowserRouter([
  {
    path: "/",
    element:<PrivateRoute>
      <DashboardLayout></DashboardLayout>

    </PrivateRoute> ,
    children:[
      {
        path:"/add-media",
        element:<AddMedia></AddMedia>
      },
      {
        path:"/all-media",
        element:<AllNews></AllNews>
      },
      {
        path:"/career/inbox",
        element:<Inbox></Inbox>
      },

    ]

  },{
    path:"/",
Component:AuthLayout,
children:[
  {
    path:'/register',
    element:<Register></Register>
  },
  {
    path:'/login',
    element:<Login></Login>
  }
]
 }
]);