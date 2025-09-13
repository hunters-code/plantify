import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  HomePage,
  AuthPage,
  ExplorePage,
  ExploreDetailPage,
  FounderRegistrationPage,
  InvestorRegistrationPage,
  StartupDetailsPage,
  CreateStartupPage
} from "./pages";

function App() {
  return (
    <Router>
      <div className="bg-gray-50 text-gray-900">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/explore/detail" element={<ExploreDetailPage />} />
          <Route path="/register/founder" element={<FounderRegistrationPage />} />
          <Route path="/register/investor" element={<InvestorRegistrationPage />} />
          <Route path="/startup/:id" element={<StartupDetailsPage />} />
          <Route path="/startup/create" element={<CreateStartupPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;