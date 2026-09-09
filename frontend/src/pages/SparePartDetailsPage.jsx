import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSparePart } from '../api/spareParts.js';

function SparePartDetailsPage() {
    const { id } = useParams();

    const [sparePart, setSparePart] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSparePart(id)
            .then(setSparePart)
            .catch((requestError) => setError(requestError.message))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!sparePart) {
        return <p>Spare part not found.</p>;
    }

    return (
        <>
            <h1>{sparePart.name}</h1>

            <p>
                <strong>Manufacturer Number:</strong>{' '}
                {sparePart.manufacturerNumber || 'Not set'}
            </p>

            <p>
                <strong>Compatible Machine Type:</strong>{' '}
                {sparePart.compatibleMachineType || 'Not set'}
            </p>

            <p>
                <strong>Quantity in Stock:</strong>{' '}
                {sparePart.quantityInStock ?? 0}
            </p>

            <p>
                <strong>Description:</strong>{' '}
                {sparePart.description || 'Not set'}
            </p>

            <Link to={`/spare-parts/${sparePart.id}/edit`}>
                <button type="button">Edit</button>
            </Link>

            <Link to="/spare-parts">
                <button type="button">Back to Spare Parts</button>
            </Link>
        </>
    );
}

export default SparePartDetailsPage;