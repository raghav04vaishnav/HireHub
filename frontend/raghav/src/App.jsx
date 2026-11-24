import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import Home from "./Home";
import UserSignup from "./UserSignUp";
import Login from "./Login";
import CompanySignup from "./CompanySignup";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import CompanyDashboard from "./CompanyDashboard";
import UserDashboard from "./UserDashboard";
import AdminDashboard from "./AdminDashboard";
import CreateJob from "./CreateJob";
import ManageJobs from "./ManageJobs";
import AllJobs from "./AllJobs";
import JobDetails from "./JobDetails";
import ApplyJob from "./ApplyJob";
import ManageApplicants from "./ManageApplicants";
import ManageUsers from "./ManageUsers";
import Notifications from "./Notifications";
import MyApplications from "./MyApplications";
import ChangePassword from "./ChangePassword";
import ScheduleInterview from "./ScheduleInterview";
import ManageInterviews from "./ManageInterviews";
import MyInterviews from "./MyInterviews";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user-signup" element={<UserSignup />} />
          <Route path="/company-signup" element={<CompanySignup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/jobs" element={<AllJobs />} />
          <Route
            path="/job/:id"
            element={
              <ProtectedRoute role="user" showLoginPrompt={true}>
                <JobDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/job/:id/apply"
            element={
              <ProtectedRoute role="user">
                <ApplyJob />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute role="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/notifications"
            element={
              <ProtectedRoute role="user">
                <Notifications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/my-applications"
            element={
              <ProtectedRoute role="user">
                <MyApplications />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/my-interviews"
            element={
              <ProtectedRoute role="user">
                <MyInterviews />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/change-password"
            element={
              <ProtectedRoute role="user">
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/dashboard"
            element={
              <ProtectedRoute role="company">
                <CompanyDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/manage-jobs"
            element={
              <ProtectedRoute role="company">
                <ManageJobs />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/create-job"
            element={
              <ProtectedRoute role="company">
                <CreateJob />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/manage-applicants"
            element={
              <ProtectedRoute role="company">
                <ManageApplicants />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/applicants"
            element={
              <ProtectedRoute role="company">
                <ManageApplicants />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/schedule-interview"
            element={
              <ProtectedRoute role="company">
                <ScheduleInterview />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/manage-interviews"
            element={
              <ProtectedRoute role="company">
                <ManageInterviews />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="admin">
                <ManageUsers />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
