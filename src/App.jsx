import { Route, Routes, Navigate } from "react-router-dom";
import { useState } from 'react'
import "./App.css";

import ProfilePage from "./pages/ProfilePage/ProfilePage";
import SignUpPage from "./pages/SignupPage/SignupPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import FeedPage from "./pages/FeedPage/FeedPage";

import userService from "./utils/userService";

function App() {

  const [user, setUser] = useState(userService.getUser())

  function handleSignUpOrLogin(){
    
    setUser(userService.getUser())
  }

  function logout() {
    console.log("working");
    userService.logout();
    setUser(null);
  }

  if (!user) {
    return (
      <Routes>
        <Route
          path="/login"
          element={<LoginPage handleSignUpOrLogin={handleSignUpOrLogin} />}
        />
        <Route
          path="/signup"
          element={<SignUpPage handleSignUpOrLogin={handleSignUpOrLogin} />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }
  
  return (
    <Routes>
      <Route path="/" element={<FeedPage loggedUser={user} handleLogout={logout} />} />
      <Route path="/login" element={<LoginPage handleSignUpOrLogin={handleSignUpOrLogin} />} />
      <Route path='/signup' element={<SignUpPage handleSignUpOrLogin={handleSignUpOrLogin} />} />
      <Route path="/:username" element={<ProfilePage loggedUser={user} handleLogout={logout}/>} />
    </Routes>
  );
}

export default App;
