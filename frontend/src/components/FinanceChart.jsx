import { Link } from 'react-router-dom';
import { Icon } from './Icon.jsx';

const currency = new Intl.NumberFormat('en-CH', {
  style: 'currency',
  currency: 'CHF',
  notation: 'compact',
  compactDisplay: 'short',
  maximumFractionDigits: 0,
});

const preciseCurrency = new Intl.NumberFormat('en-CH', {
  style: 'currency',
  currency: 'CHF',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const monthName = new Intl.DateTimeFormat('en-CH', { month: 'short' });

function FinanceChart({ monthlySpending = [] }) {
  const pastTotal = monthlySpending.reduce((sum, month) => sum + month.actual, 0);
  const forecastTotal = monthlySpending.reduce((sum, month) => sum + month.forecast, 0);
  const highestAmount = Math.max(0, ...monthlySpending.flatMap((month) => [month.actual, month.forecast]));
  const axisMaximum = Math.max(100, Math.ceil(highestAmount / 100) * 100);
  const chartTitle = 'Past completed maintenance costs and future scheduled costs';
  const chartMonths = monthlySpending.map((item) => {
    const [year, month] = item.month.split('-').map(Number);
    return { ...item, year, label: monthName.format(new Date(year, month - 1, 1)) };
  });

  return (
    <article className="dashboard-panel finance-panel">
      <div className="finance-heading">
        <div>
          <h2>Maintenance spending</h2>
          <p>Completed costs and scheduled work with an estimated cost</p>
        </div>
        <Link to="/maintenance">
          View work orders <Icon name="arrowRight" />
        </Link>
      </div>

      <div className="finance-summary">
        <div>
          <span>Past 12 months</span>
          <strong>{preciseCurrency.format(pastTotal)}</strong>
        </div>
        <div>
          <span>Next 12 months forecast</span>
          <strong>{preciseCurrency.format(forecastTotal)}</strong>
        </div>
      </div>

      {highestAmount === 0 ? (
        <p className="finance-empty">No past costs or future maintenance estimates in this period.</p>
      ) : (
        <div className="finance-chart-scroll">
          <div className="finance-chart-inner">
            <div className="finance-chart-layout" role="group" aria-label={chartTitle}>
              <div className="finance-y-axis" aria-hidden="true">
                <span>{currency.format(axisMaximum)}</span>
                <span>{currency.format(axisMaximum / 2)}</span>
                <span>{currency.format(0)}</span>
              </div>
              <div className="finance-chart-visual">
                <div className="finance-chart-plot">
                  {chartMonths.map((item) => (
                    <div className="finance-chart-column" key={item.month}>
                      <div className="finance-chart-bars">
                        <div
                          className="finance-chart-bar finance-chart-bar-actual"
                          role="img"
                          aria-label={`${item.label} ${item.year} actual: ${preciseCurrency.format(item.actual)}`}
                          title={`Actual: ${preciseCurrency.format(item.actual)}`}
                          style={{ height: `${(item.actual / axisMaximum) * 100}%` }}
                        />
                        <div
                          className="finance-chart-bar finance-chart-bar-forecast"
                          role="img"
                          aria-label={`${item.label} ${item.year} forecast: ${preciseCurrency.format(item.forecast)}`}
                          title={`Forecast: ${preciseCurrency.format(item.forecast)}`}
                          style={{ height: `${(item.forecast / axisMaximum) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="finance-month-labels" aria-hidden="true">
                  {chartMonths.map((item) => (
                    <span className="finance-month-label" key={item.month}>
                      {item.label}<small>{String(item.year).slice(-2)}</small>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="finance-legend" aria-label="Chart legend">
              <span><i className="finance-legend-swatch finance-legend-actual" /> Actual spending</span>
              <span><i className="finance-legend-swatch finance-legend-forecast" /> Scheduled forecast</span>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}

export default FinanceChart;
