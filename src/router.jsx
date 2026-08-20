import { createBrowserRouter } from 'react-router-dom'

import { RootLayout } from './components/layout/RootLayout'
import { HistoryPage } from './pages/HistoryPage'
import { SimulationFormPage } from './pages/SimulationFormPage'
import { SimulationResultsPage } from './pages/SimulationResultsPage'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <SimulationFormPage />,
      },
      {
        path: '/resultado',
        element: <SimulationResultsPage />,
      },
      {
        path: '/resultado/:id',
        element: <SimulationResultsPage />,
      },
      {
        path: '/historico',
        element: <HistoryPage />,
      },
    ],
  },
])
