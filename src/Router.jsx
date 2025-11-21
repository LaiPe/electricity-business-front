import { createBrowserRouter, Navigate, Outlet, RouterProvider, useNavigation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './layouts/Header.jsx';
import Footer from './layouts/Footer.jsx';

import ErrorPage from './pages/navigation/ErrorPage.jsx';
import Register from './pages/auth/Register.jsx';
import Login from './pages/auth/Login.jsx';
import Verify from './pages/auth/Verify.jsx';
import Home from './pages/Home.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsOfService from './pages/TermsOfService.jsx';
import BannedPage from './pages/navigation/BannedPage.jsx';
import UnauthorizedPage from './pages/navigation/UnauthorizedPage.jsx';
import Dashboard from './pages/Dashboard.jsx';

import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import Spinner from './components/spinner/Spinner.jsx';
import RouteGuard from './RouteGuard.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root><Outlet /></Root>,
    errorElement: <Root><ErrorPage /></Root>,
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/verify',
        element: <Verify />
      },
      {
        path: '/logout',
        element: <LogoutPage />
      },
      {
        path: '/privacy-policy',
        element: <PrivacyPolicy />
      },
      {
        path: '/terms-of-service',
        element: <TermsOfService />
      },
      {
        path: '/banned',
        element: <BannedPage />
      },
      {
        path: '/unauthorized',
        element: <UnauthorizedPage />
      },
      {
        path: '/dashboard',
        element: <Dashboard />
      }
    ]
  }
]);


function Root({children}) {
  const { state } = useNavigation();
  const { initialLoading } = useAuth();

  if (initialLoading) {
    return <Spinner />;
  } else {
    return (
      <RouteGuard>
        <Header />
        <main>
          {state === 'loading' ? <Spinner /> : children}
        </main>
        <Footer />
      </RouteGuard>
    );
  }
}

function LogoutPage() {
  const { logout, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      logout();
    }
  }, [logout, isAuthenticated]);

  // Rediriger immédiatement vers la page d'accueil
  return <Navigate to="/" replace />;
}

export default function Router() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}