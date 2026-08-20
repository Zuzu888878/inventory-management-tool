import { Link, useParams } from 'react-router-dom';

function MaintenanceFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);

  return (
    <>
      <h1>{isEditing ? `Edit Maintenance ${id}` : 'New Maintenance'}</h1>
      <Link to={isEditing ? `/maintenance/${id}` : '/maintenance'}>
        <button type="button">Cancel</button>
      </Link>
    </>
  );
}

export default MaintenanceFormPage;
