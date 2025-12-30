import { createBrowserRouter, Navigate, Outlet, Route, RouterProvider, useNavigation } from 'react-router-dom';
import { useEffect } from 'react';

import Header from './layouts/Header.jsx';
import Footer from './layouts/Footer.jsx';

import ErrorPage from './pages/navigation/ErrorPage.jsx';
import Register from './pages/auth/Register.jsx';
import Login from './pages/auth/Login.jsx';
import Verify from './pages/auth/Verify.jsx';
import Home from './pages/Home.jsx';
import Search from './pages/Search.jsx';
import PrivacyPolicy from './pages/PrivacyPolicy.jsx';
import TermsOfService from './pages/TermsOfService.jsx';
import BannedPage from './pages/navigation/BannedPage.jsx';
import UnauthorizedPage from './pages/navigation/UnauthorizedPage.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Overview from './pages/dashboard/Overview.jsx';
import Bookings from './pages/dashboard/Bookings.jsx';
import Vehicles from './pages/dashboard/Vehicles.jsx';
import Stations from './pages/dashboard/Stations.jsx';

import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { GlobalErrorProvider } from './contexts/GlobalErrorContext.jsx';
import RouteGuard from './RouteGuard.jsx';

import Spinner from './components/spinner/Spinner.jsx';
import BookingCreate from './pages/BookingCreate.jsx';



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
        path: '/search',
        element: <Search />
      },
      {
        path: '/booking/create',
        element: <BookingCreate />
      },
      {
        path: '/dashboard',
        element: <DashboardLayout><Outlet /></DashboardLayout>,
        children: [
          {
            path: '',
            element: <Overview />
          },
          {
            path: 'bookings',
            element: <Bookings />
          },
          {
            path: 'vehicles',
            element: <Vehicles />
          },
          {
            path: 'stations',
            element: <Stations />
          }
        ]
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
          {state === 'loading' ? <Spinner /> : children}
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
  // Envelopper le router avec les fournisseurs de contexte nécessaires
  return (
    <GlobalErrorProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </GlobalErrorProvider>
  );
}