import { Routes, Route } from 'react-router-dom';
import {
  HomePage,
  AuthPage,
  OnboardingPage,
  ExplorePage,
  ExploreDetailPage,
  FounderRegistrationPage,
  InvestorRegistrationPage,
  StartupDetailsPage,
  CreateStartupPage,
} from './pages';
import { ProtectedRoute } from './components';

function App() {
  return (
     <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/auth' element={<AuthPage />} />
        <Route 
          path='/onboarding' 
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/explore' 
          element={
            <ProtectedRoute>
              <ExplorePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/explore/detail' 
          element={
            <ProtectedRoute>
              <ExploreDetailPage />
            </ProtectedRoute>
          } 
        />
        <Route
          path='/register/founder'
          element={
            <ProtectedRoute>
              <FounderRegistrationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/register/investor'
          element={
            <ProtectedRoute>
              <InvestorRegistrationPage />
            </ProtectedRoute>
          }
        />
        <Route 
          path='/startup/:id' 
          element={
            <ProtectedRoute>
              <StartupDetailsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path='/startup/create' 
          element={
            <ProtectedRoute>
              <CreateStartupPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
  );
}

export default App;
