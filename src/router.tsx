import { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Intro from './components/Intro';

const Selection = lazy(() => import('./components/Selection'));
const Quiz = lazy(() => import('./components/Quiz'));
const Result = lazy(() => import('./components/Result'));
const Atlas = lazy(() => import('./components/Atlas'));

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Intro /> },
      { path: 'select', element: <Selection /> },
      { path: 'quiz/:limit?', element: <Quiz /> },
      { path: 'result', element: <Result /> },
      { path: 'atlas', element: <Atlas /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
