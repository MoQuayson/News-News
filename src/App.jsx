import { Route, Routes } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Feeds from "./components/feeds/Feeds";
import ProfileSettings from "./components/settings/ProfileSettings";

export default function App(){
    return(
        <>
        <Routes>
          <Route path="/"  element={<Feeds/>}/>
          <Route path="/auth/login" element={<Login/>}/>
          <Route path="/auth/register" element={<Register/>}/>
          <Route path="/feeds" element={<Feeds/>}/>
          <Route path="/settings/user/:id" element={<ProfileSettings/>}/>
        </Routes>
        </>
    )
}
