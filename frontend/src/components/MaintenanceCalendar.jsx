import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMaintenanceRecords } from '../api/maintenance.js';
import { Icon } from './Icon.jsx';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function statusLabel(status) {
  return ({ planned: 'Planned', in_progress: 'In progress', completed: 'Completed', cancelled: 'Cancelled' })[status] || status;
}

export default function MaintenanceCalendar() {
  const today = new Date();
  const todayKey = dateKey(today);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getMaintenanceRecords()
      .then(setRecords)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const recordsByDate = useMemo(() => {
    const grouped = new Map();
    for (const record of records) {
      const key = record.scheduledDate?.slice(0, 10);
      if (!key) continue;
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key).push(record);
    }
    return grouped;
  }, [records]);

  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  const firstWeekday = (visibleMonth.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cellCount = Math.ceil((firstWeekday + daysInMonth) / 7) * 7;
  const days = Array.from({ length: cellCount }, (_, index) => new Date(year, month, index - firstWeekday + 1));
  const selectedRecords = recordsByDate.get(selectedDate) || [];
  const [selectedYear, selectedMonth, selectedDay] = selectedDate.split('-').map(Number);
  const selectedDateLabel = new Date(selectedYear, selectedMonth - 1, selectedDay).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  function changeMonth(offset) {
    const nextMonth = new Date(year, month + offset, 1);
    setVisibleMonth(nextMonth);
    setSelectedDate(dateKey(nextMonth));
  }

  function selectDay(date) {
    setSelectedDate(dateKey(date));
    if (date.getMonth() !== month || date.getFullYear() !== year) {
      setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
  }

  return (
    <section className="dashboard-panel maintenance-calendar" aria-labelledby="maintenance-calendar-title">
      <div className="calendar-heading">
        <div>
          <h2 id="maintenance-calendar-title">Maintenance calendar</h2>
          <p>Scheduled work across all assets</p>
        </div>
        <Link to="/maintenance/new" className="calendar-add-link">
          <Icon name="plus" /> New maintenance
        </Link>
      </div>

      <div className="calendar-toolbar">
        <h3 aria-live="polite">{visibleMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</h3>
        <div className="calendar-navigation">
          <button className="button-outline" type="button" onClick={() => changeMonth(-1)} aria-label="Previous month">
            <Icon name="chevronLeft" />
          </button>
          <button className="button-outline" type="button" onClick={() => {
            const current = new Date();
            setVisibleMonth(new Date(current.getFullYear(), current.getMonth(), 1));
            setSelectedDate(dateKey(current));
          }}>
            Today
          </button>
          <button className="button-outline" type="button" onClick={() => changeMonth(1)} aria-label="Next month">
            <Icon name="chevronRight" />
          </button>
        </div>
      </div>

      {error && <p className="calendar-message" role="alert">Could not load maintenance: {error}</p>}
      {loading && <p className="calendar-message">Loading maintenance calendar...</p>}
      {!loading && !error && (
        <>
          <div className="calendar-grid" aria-label="Monthly maintenance calendar">
            {weekdays.map((day) => <div className="calendar-weekday" key={day}>{day}</div>)}
            {days.map((date) => {
              const key = dateKey(date);
              const dayRecords = recordsByDate.get(key) || [];
              const outsideMonth = date.getMonth() !== month;
              return (
                <div
                  className={`calendar-day${outsideMonth ? ' calendar-day-outside' : ''}${key === todayKey ? ' calendar-day-today' : ''}${key === selectedDate ? ' calendar-day-selected' : ''}`}
                  key={key}
                >
                  <button
                    className="calendar-day-button"
                    type="button"
                    onClick={() => selectDay(date)}
                    aria-label={`${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}, ${dayRecords.length} maintenance ${dayRecords.length === 1 ? 'item' : 'items'}`}
                    aria-pressed={key === selectedDate}
                  >
                    {date.getDate()}
                  </button>
                  {dayRecords.length > 0 && (
                    <span className="calendar-day-count" aria-hidden="true">{dayRecords.length}</span>
                  )}
                  <div className="calendar-events">
                    {dayRecords.slice(0, 2).map((record) => (
                      <Link
                        className={`calendar-event calendar-event-${record.status}`}
                        to={`/maintenance/${record.id}`}
                        title={`${record.assetCode || record.assetName}: ${record.maintenanceType} (${statusLabel(record.status)})`}
                        key={record.id}
                      >
                        {record.assetCode || record.assetName} · {record.maintenanceType}
                      </Link>
                    ))}
                    {dayRecords.length > 2 && (
                      <button className="calendar-more" type="button" onClick={() => selectDay(date)}>
                        +{dayRecords.length - 2} more
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="calendar-agenda">
            <div className="calendar-agenda-heading">
              <h3>{selectedDateLabel}</h3>
              <span>{selectedRecords.length} {selectedRecords.length === 1 ? 'item' : 'items'}</span>
            </div>
            {selectedRecords.length === 0 ? (
              <p>No maintenance scheduled for this day.</p>
            ) : (
              <ul className="calendar-agenda-list">
                {selectedRecords.map((record) => (
                  <li key={record.id}>
                    <Link to={`/maintenance/${record.id}`}>
                      <strong>{record.maintenanceType}</strong>
                      <span>{record.assetCode || record.assetName}</span>
                    </Link>
                    <span className={`status-badge status-${record.status}`}>{statusLabel(record.status)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </section>
  );
}
