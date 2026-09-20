import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../api/dashboard.js';
import { formatDate } from '../utils/formatDate.js';
import { Icon } from '../components/Icon.jsx';

const scheduleLabel = (item) => {
  if (item.daysUntil < 0) return `${Math.abs(item.daysUntil)} day(s) overdue`;
  if (item.daysUntil === 0) return 'Due today';
  return `Due in ${item.daysUntil} day(s)`;
};

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard()
      .then(setDashboard)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>{error}</p>;
  if (!dashboard) return null;

  const { assets, spareParts, maintenance } = dashboard;

  return (
    <>
      <div className="dashboard-heading">
        <div>
          <h1>Dashboard</h1>
          <p>Operational overview for assets, inventory, and maintenance.</p>
        </div>
        <small>Updated {new Date(dashboard.generatedAt).toLocaleString()}</small>
      </div>

      <section className="dashboard-grid" aria-label="Key metrics">
        <article className="metric-card">
          <span className="metric-label">Total assets</span>
          <strong>{assets.total}</strong>
          <small>{assets.active} active</small>
        </article>
        <article className={`metric-card ${assets.needsAttention ? 'metric-warning' : ''}`}>
          <span className="metric-label">Assets needing attention</span>
          <strong>{assets.needsAttention}</strong>
          <small>{assets.offline} offline</small>
        </article>
        <article className={`metric-card ${spareParts.outOfStock ? 'metric-warning' : ''}`}>
          <span className="metric-label">Low stock parts</span>
          <strong>{spareParts.lowStock}</strong>
          <small>{spareParts.outOfStock} out of stock</small>
        </article>
        <article className={`metric-card ${maintenance.overdue ? 'metric-danger' : ''}`}>
          <span className="metric-label">Overdue maintenance</span>
          <strong>{maintenance.overdue}</strong>
          <small>{maintenance.dueSoon} due within 30 days</small>
        </article>
      </section>

      <section className="dashboard-columns">
        <article className="dashboard-panel">
          <div className="panel-heading">
            <h2>Maintenance schedule</h2>
            <Link to="/maintenance">
              View all <Icon name="arrowRight" />
            </Link>
          </div>
          <div className="dashboard-summary">
            <span>{maintenance.open} open</span>
            <span>{maintenance.inProgress} in progress</span>
            <span>{maintenance.completedThisMonth} completed this month</span>
            <span>{maintenance.costThisMonth.toFixed(2)} CHF spent this month</span>
          </div>
          {dashboard.schedule.length === 0 ? (
            <p>No overdue or upcoming maintenance.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Due</th>
                    <th scope="col">Asset</th>
                    <th scope="col">Work</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.schedule.map((item) => (
                    <tr key={item.id}>
                      <td className="cell-nowrap">
                        <Link to={`/maintenance/${item.id}`} className="table-link">
                          {formatDate(item.scheduledDate)}
                        </Link>
                        <div className={`cell-subtext ${item.daysUntil < 0 ? 'text-danger' : ''}`}>
                          {scheduleLabel(item)}
                        </div>
                      </td>
                      <td>
                        <Link to={`/assets/${item.assetId}`} className="table-link">
                          {item.assetCode}
                        </Link>
                        <div className="cell-subtext">{item.assetName}</div>
                      </td>
                      <td>{item.maintenanceType}</td>
                      <td>
                        <span className={`status-badge status-${item.status}`}>{item.status.replace('_', ' ')}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>

        <article className="dashboard-panel">
          <div className="panel-heading">
            <h2>Stock alerts</h2>
            <Link to="/spare-parts">
              View all <Icon name="arrowRight" />
            </Link>
          </div>
          <div className="dashboard-summary">
            <span>{spareParts.totalItems} part types</span>
            <span>{spareParts.totalUnits} units in stock</span>
          </div>
          {dashboard.lowStockItems.length === 0 ? (
            <p>No stock alerts.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th scope="col">Part</th>
                    <th scope="col">Quantity</th>
                    <th scope="col" className="actions-col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {dashboard.lowStockItems.map((part) => (
                    <tr key={part.id}>
                      <td className="cell-name">{part.name}</td>
                      <td className={part.quantityInStock === 0 ? 'text-danger' : 'text-warning'}>
                        {part.quantityInStock}
                      </td>
                      <td className="actions-cell">
                        <div className="table-actions">
                          <Link to={`/spare-parts/${part.id}`}>
                            <Icon name="eye" /> Review
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>
    </>
  );
}

export default DashboardPage;
