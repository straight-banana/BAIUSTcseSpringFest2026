import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home.jsx";
import LoadingPage from "../pages/LoadingPage.jsx";
import ErrorPage from "../pages/ErrorPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";

// Add new page routes here as features are built.
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/loading" element={<LoadingPage />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
