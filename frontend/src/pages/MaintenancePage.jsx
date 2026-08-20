import { Link } from 'react-router-dom'

function MaintenancePage() {
  return (
    <>
      <h1>Maintenance</h1>
      <Link to="/maintenance/new">
        <button type="button">New Maintenance</button>
      </Link>{' '}
      <Link to="/maintenance/1">
        <button type="button">View Maintenance 1</button>
      </Link>
    </>
  )
}

export default MaintenancePage
