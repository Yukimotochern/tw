import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout } from './layouts/AuthLayout';
import { MainLoginPage } from './pages/MainLoginPage';
import { SignupPage } from './pages/SignupPage';
import { StaffLoginPage } from './pages/StaffLoginPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    loader: (ob) => {
      console.log('hi, loader ran', ob.request);
      return null;
    },
    shouldRevalidate: () => false,
    children: [
      {
        path: 'main_login',
        element: <MainLoginPage />,
      },
      {
        path: 'staff_login',
        element: <StaffLoginPage />,
      },
      {
        path: 'sign_up',
        element: <SignupPage />,
      },
    ],
    errorElement: <div> error</div>,
  },
]);
