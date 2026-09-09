import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
    createSparePart,
    getSparePart,
    updateSparePart,
} from '../api/spareParts.js';

function SparePartFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [name, setName] = useState('');
    const [manufacturerNumber, setManufacturerNumber] = useState('');
    const [compatibleMachineType, setCompatibleMachineType] = useState('');
    const [quantityInStock, setQuantityInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isEditing) return;

        getSparePart(id)
            .then((sparePart) => {
                setName(sparePart.name || '');
                setManufacturerNumber(sparePart.manufacturerNumber || '');
                setCompatibleMachineType(sparePart.compatibleMachineType || '');
                setQuantityInStock(sparePart.quantityInStock ?? 0);
                setDescription(sparePart.description || '');
            })
            .catch((requestError) => setError(requestError.message));
    }, [id, isEditing]);

    async function saveSparePart(event) {
        event.preventDefault();
        setError('');

        try {
            const sparePartData = {
                name,
                manufacturerNumber,
                compatibleMachineType,
                quantityInStock: Number(quantityInStock),
                description,
            };

            const sparePart = isEditing
                ? await updateSparePart(id, sparePartData)
                : await createSparePart(sparePartData);

            navigate(`/spare-parts/${sparePart.id}`);
        } catch (requestError) {
            setError(requestError.message);
        }
    }

    return (
        <>
            <h1>{isEditing ? 'Edit Spare Part' : 'New Spare Part'}</h1>

            {error && <p>{error}</p>}

            <form onSubmit={saveSparePart}>
                <label>
                    Name
                    <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        required
                    />
                </label>

                <br />

                <label>
                    Manufacturer Number
                    <input
                        value={manufacturerNumber}
                        onChange={(event) => setManufacturerNumber(event.target.value)}
                    />
                </label>

                <br />

                <label>
                    Compatible Machine Type
                    <input
                        value={compatibleMachineType}
                        onChange={(event) =>
                            setCompatibleMachineType(event.target.value)
                        }
                    />
                </label>

                <br />

                <label>
                    Quantity in Stock
                    <input
                        type="number"
                        min="0"
                        value={quantityInStock}
                        onChange={(event) => setQuantityInStock(event.target.value)}
                    />
                </label>

                <br />

                <label>
                    Description
                    <input
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                    />
                </label>

                <br />

                <button type="submit">Save</button>
            </form>

            <Link to="/spare-parts">
                <button type="button">Cancel</button>
            </Link>
        </>
    );
}

export default SparePartFormPage;