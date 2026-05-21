import { HashRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login.jsx";
import Register from "./pages/Register";
import UserHome from "./pages/UserHome";
import Chatbot from "./pages/Chatbot";
import Notices from "./pages/Notices";
import AdminDashboard from "./pages/AdminDashboard";
import UploadDocument from "./pages/UploadDocument";
import AllDocuments from "./pages/AllDocuments";
import EditDocuments from "./pages/EditDocuments";
import SuspiciousUsers from "./pages/SuspiciousUsers";

function App() {
  return (
    
    <HashRouter>
      <Routes>
        {/* public login route at root */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<UserHome />} />
        <Route path="/chat" element={<Chatbot />} />
        <Route path="/notices" element={<Notices />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/upload" element={<UploadDocument />} />
        <Route path="/documents" element={<AllDocuments />} />
        <Route path="/edit-docs" element={<EditDocuments />} />
        <Route path="/suspicious-users" element={<SuspiciousUsers />} />
        {/* fallback or catch-all could be added here */}
      </Routes>
    </HashRouter>
  );
}

export default App;
