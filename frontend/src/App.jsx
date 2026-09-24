import { BrowserRouter, Link, Navigate, NavLink, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
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
import ProductsPage from './pages/ProductsPage.jsx';
import ProductFormPage from './pages/ProductFormPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import { UsersFormPage } from './pages/UsersFormPage.jsx';
import { clearToken, getCurrentUser, hasToken } from './api/client.js';
import { Icon } from './components/Icon.jsx';
import Breadcrumbs from './components/Breadcrumbs.jsx';

const isAuthenticated = () => hasToken();

function ProtectedRoute() {
  const location = useLocation();
  const currentUser = getCurrentUser();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (currentUser?.role === 'customer' && !location.pathname.startsWith('/products')) {
    return <Navigate to="/products" replace />;
  }

  return <Outlet />;
}

function StaffOnlyRoute() {
  const currentUser = getCurrentUser();
  return currentUser?.role === 'customer' ? <Navigate to="/products" replace /> : <Outlet />;
}

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();

  function logout() {
    clearToken();
    navigate('/login', { replace: true });
  }

  const isTabActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard' || location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link className="brand" to={currentUser?.role === 'customer' ? '/products' : '/dashboard'}>
          <span className="brand-mark">L</span>
          <span>Leets Inventory</span>
        </Link>
        <nav className="nav-links" aria-label="Main navigation">
          {currentUser?.role === 'customer' ? (
            <NavLink to="/products" className={isTabActive('/products') ? 'active' : ''} aria-current={isTabActive('/products') ? 'page' : undefined}>
              <Icon name="package" />
              Products
            </NavLink>
          ) : (
            <>
          <NavLink
            to="/dashboard"
            className={isTabActive('/dashboard') ? 'active' : ''}
            aria-current={isTabActive('/dashboard') ? 'page' : undefined}
          >
            <Icon name="dashboard" />
            Dashboard
          </NavLink>
          <NavLink
            to="/assets"
            className={isTabActive('/assets') ? 'active' : ''}
            aria-current={isTabActive('/assets') ? 'page' : undefined}
          >
            <Icon name="assets" />
            Assets
          </NavLink>
          <NavLink
            to="/maintenance"
            className={isTabActive('/maintenance') ? 'active' : ''}
            aria-current={isTabActive('/maintenance') ? 'page' : undefined}
          >
            <Icon name="wrench" />
            Maintenance
          </NavLink>
          <NavLink
            to="/spare-parts"
            className={isTabActive('/spare-parts') ? 'active' : ''}
            aria-current={isTabActive('/spare-parts') ? 'page' : undefined}
          >
            <Icon name="package" />
            Spare Parts
          </NavLink>
          <NavLink
            to="/products"
            className={isTabActive('/products') ? 'active' : ''}
            aria-current={isTabActive('/products') ? 'page' : undefined}
          >
            <Icon name="package" />
            Products
          </NavLink>
          {currentUser?.role === 'admin' && (
            <NavLink
              to="/users"
              className={isTabActive('/users') ? 'active' : ''}
              aria-current={isTabActive('/users') ? 'page' : undefined}
            >
              <Icon name="users" />
              Users
            </NavLink>
          )}
            </>
          )}
        </nav>
        <div className="topbar-actions">
          {currentUser && <span className="user-badge">{currentUser.displayName || currentUser.username}</span>}
          <button className="button button-ghost" type="button" onClick={logout}>
            <Icon name="logout" /> Log out
          </button>
        </div>
      </header>
      <main className="page-content">
        <Breadcrumbs />
        <Outlet />
      </main>
      <footer className="site-footer">
        <span className="site-footer-company">Leets Inventory</span>
        <span className="site-footer-copyright">© {new Date().getFullYear()} Leets AG</span>
        <span>Tel.: +41 XX XXX XX XX</span>
      </footer>
    </div>
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
            <Route path="/dashboard/:tab" element={<DashboardPage />} />

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

            <Route path="/products" element={<ProductsPage />} />
            <Route element={<StaffOnlyRoute />}>
              <Route path="/products/new" element={<ProductFormPage />} />
              <Route path="/products/:id/edit" element={<ProductFormPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="/maintanance/*" element={<Navigate to="/maintenance" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
