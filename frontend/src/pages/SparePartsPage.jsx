import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSpareParts } from '../api/spareParts.js';

function SparePartsPage() {
    const [spareParts, setSpareParts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSpareParts()
            .then(setSpareParts)
            .catch((requestError) => setError(requestError.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <h1>Spare Parts</h1>

            <Link to="/spare-parts/new">
                <button type="button">New Spare Part</button>
            </Link>

            {loading && <p>Loading...</p>}

            {error && <p>{error}</p>}

            {!loading && !error && spareParts.length === 0 && (
                <p>No spare parts found.</p>
            )}

            {spareParts.length > 0 && (
                <table>
                    <thead>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Manufacturer Number</th>
                        <th scope="col">Compatible Machine Type</th>
                        <th scope="col">Quantity in Stock</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {spareParts.map((sparePart) => (
                        <tr key={sparePart.id}>
                            <td>{sparePart.name || `Spare Part ${sparePart.id}`}</td>
                            <td>{sparePart.manufacturerNumber || 'Not set'}</td>
                            <td>{sparePart.compatibleMachineType || 'Not set'}</td>
                            <td>{sparePart.quantityInStock ?? 0}</td>
                            <td>
                                <Link to={`/spare-parts/${sparePart.id}`}>
                                    View
                                </Link>{' '}
                                <Link to={`/spare-parts/${sparePart.id}/edit`}>
                                    Edit
                                </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </>
    );
}

export default SparePartsPage;