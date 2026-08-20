import { Link, useParams } from 'react-router-dom'

function MaintenanceDetailsPage() {
  const { id } = useParams()

  return (
    <>
      <h1>View Maintenance {id}</h1>
      <Link to={`/maintenance/${id}/edit`}>
        <button type="button">Edit</button>
      </Link>{' '}
      <Link to="/maintenance">
        <button type="button">Back</button>
      </Link>
    </>
  )
}

export default MaintenanceDetailsPage
