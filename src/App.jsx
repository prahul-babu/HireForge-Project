import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import ResumeAnalyzer from "@/pages/ResumeAnalyzer";
import CareerRoadmap from "@/pages/CareerRoadmap";
import Wellness from "@/pages/Wellness";
import InterviewPrep from "@/pages/InterviewPrep";
import Profile from "@/pages/Profile";
import PageNotFound from "@/lib/PageNotFound";
import { queryClientInstance } from "@/lib/query-client";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analyze" element={<ResumeAnalyzer />} />
        <Route path="/roadmap" element={<CareerRoadmap />} />
        <Route path="/wellness" element={<Wellness />} />
        <Route path="/interview" element={<InterviewPrep />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClientInstance}>
      <Router>
        <AppRoutes />
      </Router>
      <Toaster />
    </QueryClientProvider>
  );
}
