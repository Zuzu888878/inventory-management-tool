import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from '../api/dashboard.js';
import { adjustSparePartStock } from '../api/spareParts.js';
import { formatDate } from '../utils/formatDate.js';
import { Icon } from '../components/Icon.jsx';
import DashboardCharts from '../components/DashboardCharts.jsx';
import MaintenanceCalendar from '../components/MaintenanceCalendar.jsx';

const scheduleLabel = (item) => {
  if (item.daysUntil < 0) return `${Math.abs(item.daysUntil)} day(s) overdue`;
  if (item.daysUntil === 0) return 'Due today';
  return `Due in ${item.daysUntil} day(s)`;
};

const dashboardTabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'calendar', label: 'Calendar' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'stock', label: 'Stock alerts' },
];

function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [restockQuantities, setRestockQuantities] = useState({});
  const [restockingPartId, setRestockingPartId] = useState(null);
  const [stockMessage, setStockMessage] = useState('');
  const [stockActionError, setStockActionError] = useState('');
  const tabRefs = useRef([]);

  async function restockPart(event, part) {
    event.preventDefault();
    setStockMessage('');
    const amount = Number(restockQuantities[part.id]);
    if (!Number.isSafeInteger(amount) || amount < 1) {
      setStockActionError('Enter a whole number greater than zero.');
      return;
    }

    setRestockingPartId(part.id);
    setStockActionError('');

    try {
      await adjustSparePartStock(part.id, amount);
      setRestockQuantities((quantities) => ({ ...quantities, [part.id]: '' }));
      setStockMessage(`Added ${amount} ${amount === 1 ? 'unit' : 'units'} to ${part.name}.`);
    } catch (requestError) {
      setStockActionError(`Could not restock ${part.name}: ${requestError.message}`);
      setRestockingPartId(null);
      return;
    }

    try {
      setDashboard(await getDashboard());
    } catch {
      setStockActionError(
        'Stock was updated, but the dashboard could not refresh. Reload the page to see current totals.'
      );
    } finally {
      setRestockingPartId(null);
    }
  }

  function handleTabKeyDown(event, index) {
    let nextIndex;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % dashboardTabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + dashboardTabs.length) % dashboardTabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = dashboardTabs.length - 1;
    if (nextIndex === undefined) return;
    event.preventDefault();
    setActiveTab(dashboardTabs[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  }

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

      <div className="dashboard-tabs" role="tablist" aria-label="Dashboard widgets">
        {dashboardTabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(element) => {
              tabRefs.current[index] = element;
            }}
            id={`dashboard-tab-${tab.id}`}
            className={`dashboard-tab${activeTab === tab.id ? ' dashboard-tab-active' : ''}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls="dashboard-widget-panel"
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        id="dashboard-widget-panel"
        className="dashboard-tab-panel"
        role="tabpanel"
        aria-labelledby={`dashboard-tab-${activeTab}`}
        tabIndex={0}
      >
        {activeTab === 'overview' && (
          <>
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
            <DashboardCharts assets={assets} spareParts={spareParts} maintenance={maintenance} />
          </>
        )}

        {activeTab === 'calendar' && <MaintenanceCalendar />}

        {activeTab === 'schedule' && (
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
        )}

        {activeTab === 'stock' && (
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
            {stockMessage && (
              <p className="stock-action-message" role="status">
                {stockMessage}
              </p>
            )}
            {stockActionError && (
              <p className="stock-action-error" role="alert">
                {stockActionError}
              </p>
            )}
            {dashboard.lowStockItems.length === 0 ? (
              <p>No stock alerts.</p>
            ) : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">Part</th>
                      <th scope="col">Quantity</th>
                      <th scope="col" className="actions-col">
                        Action
                      </th>
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
                            <form className="stock-restock-form" onSubmit={(event) => restockPart(event, part)}>
                              <input
                                type="number"
                                min="1"
                                max="2147483647"
                                step="1"
                                required
                                value={restockQuantities[part.id] ?? ''}
                                onChange={(event) =>
                                  setRestockQuantities((quantities) => ({
                                    ...quantities,
                                    [part.id]: event.target.value,
                                  }))
                                }
                                aria-label={`Quantity to add to ${part.name}`}
                                placeholder="Qty"
                                disabled={restockingPartId !== null}
                              />
                              <button type="submit" disabled={restockingPartId !== null}>
                                {restockingPartId === part.id ? 'Adding...' : 'Restock'}
                              </button>
                            </form>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        )}
      </div>
    </>
  );
}

export default DashboardPage;
