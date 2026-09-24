import { Link, useLocation } from 'react-router-dom';

const labels = {
  dashboard: 'Dashboard',
  calendar: 'Calendar',
  schedule: 'Schedule',
  stock: 'Stock Alerts',
  finance: 'Finance',
  assets: 'Assets',
  'spare-parts': 'Spare Parts',
  maintenance: 'Maintenance',
  users: 'Users',
  new: 'New',
  edit: 'Edit',
};

function Breadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  if (segments.length === 0) return null;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {segments.map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join('/')}`;
        const label = labels[segment] || (/^\d+$/.test(segment) ? 'Details' : segment);
        const isCurrent = index === segments.length - 1;

        return (
          <span className="breadcrumb-item" key={path}>
            {index > 0 && (
              <span className="breadcrumb-separator" aria-hidden="true">
                ›
              </span>
            )}
            {isCurrent ? <span aria-current="page">{label}</span> : <Link to={path}>{label}</Link>}
          </span>
        );
      })}
    </nav>
  );
}

export default Breadcrumbs;
