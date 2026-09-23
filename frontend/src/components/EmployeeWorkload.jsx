import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMaintenanceRecords } from '../api/maintenance.js';
import { Icon } from './Icon.jsx';

export default function EmployeeWorkload() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMaintenanceRecords()
      .then(setRecords)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const { employees, unassigned } = useMemo(() => {
    const assigned = new Map();
    let unassignedCount = 0;
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    for (const record of records) {
      if (record.status !== 'planned' && record.status !== 'in_progress') continue;
      const name = record.technician?.trim();
      if (!name) {
        unassignedCount += 1;
        continue;
      }

      const key = record.technicianId ? `id:${record.technicianId}` : `name:${name.toLowerCase()}`;
      if (!assigned.has(key)) assigned.set(key, { key, name, planned: 0, inProgress: 0, overdue: 0 });
      const employee = assigned.get(key);
      if (record.status === 'planned') employee.planned += 1;
      else employee.inProgress += 1;
      if (record.scheduledDate?.slice(0, 10) < today) employee.overdue += 1;
    }

    return {
      employees: [...assigned.values()].sort(
        (a, b) => b.planned + b.inProgress - a.planned - a.inProgress || a.name.localeCompare(b.name)
      ),
      unassigned: unassignedCount,
    };
  }, [records]);

  const maxTasks = Math.max(1, ...employees.map((employee) => employee.planned + employee.inProgress));

  return (
    <article className="dashboard-panel dashboard-chart dashboard-employee-workload">
      <div className="panel-heading">
        <h2>Employee workload</h2>
        <Link to="/maintenance">
          View maintenance <Icon name="arrowRight" />
        </Link>
      </div>
      <p className="dashboard-chart-description">Open maintenance tasks by assigned technician</p>
      {loading && <p className="dashboard-chart-description">Loading workload...</p>}
      {error && (
        <p className="stock-action-error" role="alert">
          Could not load workload: {error}
        </p>
      )}
      {!loading && !error && (
        <>
          <div className="employee-workload-summary">
            <span>
              {employees.length} {employees.length === 1 ? 'employee' : 'employees'} with open work
            </span>
            <span>
              {unassigned} unassigned {unassigned === 1 ? 'task' : 'tasks'}
            </span>
          </div>
          {employees.length === 0 ? (
            <p className="dashboard-chart-description">No open work assigned to employees.</p>
          ) : (
            <div className="employee-workload-list">
              {employees.map((employee) => {
                const total = employee.planned + employee.inProgress;
                return (
                  <div className="employee-workload-row" key={employee.key}>
                    <div className="employee-workload-label">
                      <strong>{employee.name}</strong>
                      <span>
                        {total} {total === 1 ? 'task' : 'tasks'}
                        {employee.overdue > 0 && ` · ${employee.overdue} overdue`}
                      </span>
                    </div>
                    <div className="employee-workload-track" aria-hidden="true">
                      <span
                        className="dashboard-chart-blue"
                        style={{ width: `${(employee.planned / maxTasks) * 100}%` }}
                      />
                      <span
                        className="dashboard-chart-amber"
                        style={{ width: `${(employee.inProgress / maxTasks) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="employee-workload-legend">
            <span>
              <i className="dashboard-chart-blue" /> Planned
            </span>
            <span>
              <i className="dashboard-chart-amber" /> In progress
            </span>
          </div>
        </>
      )}
    </article>
  );
}
