import { createBrowserRouter } from "react-router";
import DashboardLayout from "../layouts/DashboardLayout";
import AuthLayout from "../layouts/AuthLayout";
import Register from "../Auth/Register";
import Login from "../Auth/Login";
import PrivateRoute from "./PrivateRoute";
import AddMedia from "../components/MediaLibrary/AddMedia";
import AllNews from "../components/AllNews";
import Inbox from "../components/career/Inbox";
import AddStory from "../components/NewsStory/AddStory";
import AllStory from "../components/NewsStory/AllStory";
import StorySet from "../components/NewsStory/StorySet";
import UpdateStory from "../components/NewsStory/UpdateStory";

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
      {
        path:"/add-story",
        element:<AddStory></AddStory>
      },
      {
        path:"/all-story",
        element:<AllStory></AllStory>
      },
      {
        path:"/storySet",
        element:<StorySet></StorySet>
      },
      {
        path:"/update-story/:id",
        element:<UpdateStory></UpdateStory>
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