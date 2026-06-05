import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { LangProvider } from './contexts/LangContext'
import LoginPage from './pages/LoginPage'
import CashierPage from './pages/CashierPage'
import OrdersPage from './pages/OrdersPage'
import MenuPage from './pages/MenuPage'
import ReportsPage from './pages/ReportsPage'
import WarehousePage from './pages/WarehousePage'
import AdminPage from './pages/AdminPage'
import TableMapPage from './pages/TableMapPage'
import DeliveriesPage from './pages/DeliveriesPage'
import EmployeesPage from './pages/EmployeesPage'
import WaiterPage from './pages/WaiterPage'
import CustomersPage from './pages/CustomersPage'
import ReservationsPage from './pages/ReservationsPage'
import QrMenuPage from './pages/QrMenuPage'
import QrCodePage from './pages/QrCodePage'
import TableQrPage from './pages/TableQrPage'
import QueueDisplayPage from './pages/QueueDisplayPage'
import KitchenDisplayPage from './pages/KitchenDisplayPage'
import { Sidebar } from './components/layout/Sidebar'

function ProtectedLayout() {
  const { user, loading, appUser } = useAuth()

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Yuklanmoqda...</p>
      </div>
    </div>
  )

  if (!user) return <Navigate to="/login" replace />

  // Ofitsiant — faqat o'z stollarini ko'radi
  if (appUser?.role === 'waiter') return <WaiterPage />

  // Oshpaz — kitchen ekrani
  if (appUser?.role === 'kitchen') return <KitchenDisplayPage />

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-hidden md:pt-0 pt-14 pb-16 md:pb-0">
        <Routes>
          <Route path="/" element={<CashierPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/warehouse" element={<WarehousePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/tablemap" element={<TableMapPage />} />
          <Route path="/deliveries" element={<DeliveriesPage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <LangProvider>
    <ThemeProvider>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/menu-qr" element={<QrMenuPage />} />
          <Route path="/qr-code" element={<QrCodePage />} />
          <Route path="/table-qr" element={<TableQrPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/queue" element={<QueueDisplayPage />} />
          <Route path="/kitchen" element={<KitchenDisplayPage />} />
          <Route path="/*" element={<ProtectedLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
    </LangProvider>
  )
}
