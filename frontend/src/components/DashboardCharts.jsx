import { Link } from 'react-router-dom';
import { Icon } from './Icon.jsx';
import EmployeeWorkload from './EmployeeWorkload.jsx';

function DistributionChart({ title, href, total, segments }) {
  const count = Math.max(0, Number(total) || 0);

  return (
    <article className="dashboard-panel dashboard-chart">
      <div className="panel-heading">
        <h2>{title}</h2>
        <Link to={href}>
          View all <Icon name="arrowRight" />
        </Link>
      </div>
      <strong className="dashboard-chart-total">{count}</strong>
      <span className="dashboard-chart-caption">total</span>
      <div className="dashboard-chart-track" aria-hidden="true">
        {count === 0 ? (
          <span className="dashboard-chart-empty" />
        ) : (
          segments.map((segment) => (
            <span
              key={segment.label}
              className={`dashboard-chart-segment ${segment.className}`}
              style={{ width: `${(Math.max(0, segment.value) / count) * 100}%` }}
            />
          ))
        )}
      </div>
      <ul className="dashboard-chart-legend">
        {segments.map((segment) => (
          <li key={segment.label}>
            <span className={`dashboard-chart-key ${segment.className}`} aria-hidden="true" />
            <span>{segment.label}</span>
            <strong>{segment.value}</strong>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function DashboardCharts({ assets, spareParts, maintenance }) {
  const otherAssets = Math.max(0, assets.total - assets.active - assets.needsAttention);
  const healthyParts = Math.max(0, spareParts.totalItems - spareParts.lowStock - spareParts.outOfStock);
  const workload = [
    { label: 'Open', value: maintenance.open, className: 'dashboard-chart-blue' },
    { label: 'Overdue', value: maintenance.overdue, className: 'dashboard-chart-red' },
    { label: 'Due within 30 days', value: maintenance.dueSoon, className: 'dashboard-chart-amber' },
    { label: 'Completed this month', value: maintenance.completedThisMonth, className: 'dashboard-chart-green' },
  ];
  const workloadMax = Math.max(1, ...workload.map((item) => item.value));

  return (
    <section className="dashboard-charts" aria-label="Current dashboard statistics">
      <DistributionChart
        title="Asset status"
        href="/assets"
        total={assets.total}
        segments={[
          { label: 'Active', value: assets.active, className: 'dashboard-chart-green' },
          { label: 'Needs attention', value: assets.needsAttention, className: 'dashboard-chart-amber' },
          { label: 'Other', value: otherAssets, className: 'dashboard-chart-slate' },
        ]}
      />
      <DistributionChart
        title="Spare parts stock"
        href="/spare-parts"
        total={spareParts.totalItems}
        segments={[
          { label: 'Healthy', value: healthyParts, className: 'dashboard-chart-green' },
          { label: 'Low', value: spareParts.lowStock, className: 'dashboard-chart-amber' },
          { label: 'Out of stock', value: spareParts.outOfStock, className: 'dashboard-chart-red' },
        ]}
      />
      <article className="dashboard-panel dashboard-chart">
        <div className="panel-heading">
          <h2>Maintenance workload</h2>
          <Link to="/maintenance">
            View all <Icon name="arrowRight" />
          </Link>
        </div>
        <p className="dashboard-chart-description">Overdue and due soon work is included in open work.</p>
        <div className="dashboard-workload">
          {workload.map((item) => (
            <div className="dashboard-workload-row" key={item.label}>
              <div className="dashboard-workload-label">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
              <div className="dashboard-workload-track" aria-hidden="true">
                <span className={item.className} style={{ width: `${(item.value / workloadMax) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </article>
      <EmployeeWorkload />
    </section>
  );
}
