import React from "react";
import { Route, Routes,Navigate } from "react-router-dom";
import { SignUp } from "./pages/Signup";
import { ProtectRoute } from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";


import { Login } from "./pages/Login";

import JobsPage from "./pages/JobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import AdminPostJob from "./pages/AdminPostJob";
import MyApplicationPage from "./pages/MyApplicationPage";
import AdminJobs from "./pages/AdminJobs";


export default function App() {
  
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/" element={<Navigate to='/signup' replace/>}/>
          

          {/* Private Authenticated route guard by ProtectRoute */}
          <Route element={<ProtectRoute />}>
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobDetailPage />} />
            <Route path="/my-Applications" element={<MyApplicationPage/>} />
            <Route path="/admin/post-job" element={<AdminPostJob/>} />
            <Route path="/admin/jobs" element={<AdminJobs/>} />
          </Route>

          {/* Global fallback redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </>
  );
}