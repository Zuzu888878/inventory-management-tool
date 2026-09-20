import { BrowserRouter, Link, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import AssetDetailsPage from './pages/AssetDetailsPage.jsx';
import AssetFormPage from './pages/AssetFormPage.jsx';
import AssetsPage from './pages/AssetsPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import MaintenanceDetailsPage from './pages/MaintenanceDetailsPage.jsx';
import MaintenanceFormPage from './pages/MaintenanceFormPage.jsx';
import MaintenancePage from './pages/MaintenancePage.jsx';
import SparePartsPage from './pages/SparePartsPage.jsx';
import SparePartFormPage from './pages/SparePartFormPage.jsx';
import SparePartDetailsPage from './pages/SparePartDetailsPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import { UsersFormPage } from './pages/UsersFormPage.jsx';
import { clearToken, hasToken } from './api/client.js';

const isAuthenticated = () => hasToken();

function ProtectedRoute() {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

function Layout() {
  const navigate = useNavigate();

  function logout() {
    clearToken();
    navigate('/login', { replace: true });
  }

  return (
    <>
      <nav>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/assets">Assets</Link>
        <Link to="/maintenance">Maintenance</Link>
        <Link to="/spare-parts">Spare Parts</Link>
        <Link to="/users">Users</Link>
        <button type="button" onClick={logout}>
          Logout
        </button>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />

            <Route path="/assets" element={<AssetsPage />} />
            <Route path="/assets/new" element={<AssetFormPage />} />
            <Route path="/assets/:id" element={<AssetDetailsPage />} />
            <Route path="/assets/:id/edit" element={<AssetFormPage />} />

            <Route path="/spare-parts" element={<SparePartsPage />} />
            <Route path="/spare-parts/new" element={<SparePartFormPage />} />
            <Route path="/spare-parts/:id" element={<SparePartDetailsPage />} />
            <Route path="/spare-parts/:id/edit" element={<SparePartFormPage />} />

            <Route path="/maintenance" element={<MaintenancePage />} />
            <Route path="/maintenance/new" element={<MaintenanceFormPage />} />
            <Route path="/maintenance/:id" element={<MaintenanceDetailsPage />} />
            <Route path="/maintenance/:id/edit" element={<MaintenanceFormPage />} />

            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/new" element={<UsersFormPage />} />
            <Route path="/users/:id/edit" element={<UsersFormPage />} />
          </Route>
        </Route>

        <Route path="/maintanance/*" element={<Navigate to="/maintenance" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
