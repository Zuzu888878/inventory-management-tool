import { Link, useParams } from 'react-router-dom';

export function UsersFormPage() {
    const { id } = useParams();
    const isEditing = Boolean(id);

    return (
        <>
            <h1>{isEditing ? `Edit User ${id}` : 'New User'}</h1>
            <Link to={isEditing ? `/user/${id}` : '/users'}>
                <button type="button">Cancel</button>
            </Link>
        </>
    );
}

