import { BrowserRouter, useRoutes } from 'react-router-dom'
import publicRoutes from './publicRoutes'
import privateRoutes from './privateRoutes'

function Routes() {
  const combined = [...publicRoutes, ...privateRoutes] as any
  const element = useRoutes(combined)
  return element
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  )
}
