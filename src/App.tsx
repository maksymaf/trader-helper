import LoginForm from "./components /LoginForm"
import NotFoundPage from "./components /pages/NotFoundPage";
import { TraderJournalPage } from "./components /pages/TraderJournalPage";
import { SignalPage } from './components /pages/SignalPage';
import { CalculatorPage } from "./components /pages/CalculatorPage";

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { NewsPage } from './components /pages/NewsPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginForm/>,
    errorElement: <NotFoundPage/>
  },

  {
    path: '/',
    element: <TraderJournalPage/>,
  },

  {
    path: '/signal',
    element: <SignalPage/>,
    errorElement: <NotFoundPage/>
  },

  {
    path: '/calculator',
    element: <CalculatorPage/>,
    errorElement: <NotFoundPage/>
  },

  {
    path: '/news',
    element: <NewsPage/>,
    errorElement: <NotFoundPage />
  }
]);

function App() {

  return (
    <div className="min-h-screen bg-base">
      <RouterProvider router={router} />
    </div>
  )
}

export default App
