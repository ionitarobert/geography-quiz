import { Navigate, createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import Intro from './components/Intro';
import Selection from './components/Selection';
import Quiz from './components/Quiz';
import Result from './components/Result';
import Atlas from './components/Atlas';

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
