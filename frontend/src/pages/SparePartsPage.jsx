import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteSparePart, getSpareParts } from '../api/spareParts.js';
import { Icon } from '../components/Icon.jsx';
import { SortButton, TableToolbar } from '../components/TableToolbar.jsx';
import { useTableControls } from '../hooks/useTableControls.js';

function SparePartsPage() {
  const [spareParts, setSpareParts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [stockFilter, setStockFilter] = useState('all');
  const { rows, search, setSearch, sort, toggleSort } = useTableControls(spareParts, {
    searchFields: ['name', 'manufacturerNumber', 'compatibleMachineType'],
    filter: (part) => {
      if (stockFilter === 'out') return part.quantityInStock === 0;
      if (stockFilter === 'low') return part.quantityInStock > 0 && part.quantityInStock <= 5;
      return true;
    },
    initialSort: { key: 'name', direction: 'asc' },
  });

  useEffect(() => {
    getSpareParts()
      .then(setSpareParts)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  async function removeSparePart(sparePart) {
    if (!window.confirm(`Delete spare part "${sparePart.name}"?`)) return;
    setError('');
    try {
      await deleteSparePart(sparePart.id);
      setSpareParts((currentParts) => currentParts.filter((currentPart) => currentPart.id !== sparePart.id));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <>
      <div className="page-heading">
        <h1>Spare Parts</h1>
        <Link to="/spare-parts/new">
          <button className="button" type="button">
            <Icon name="plus" /> New Spare Part
          </button>
        </Link>
      </div>

      <TableToolbar search={search} onSearch={setSearch} placeholder="Search spare parts...">
        <select
          value={stockFilter}
          onChange={(event) => setStockFilter(event.target.value)}
          aria-label="Filter by stock"
        >
          <option value="all">All stock levels</option>
          <option value="low">Low stock</option>
          <option value="out">Out of stock</option>
        </select>
      </TableToolbar>

      {loading && <p>Loading...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && spareParts.length === 0 && <p>No spare parts found.</p>}

      {spareParts.length > 0 && (
        <table>
          <thead>
            <tr>
              <th scope="col">
                <SortButton label="Name" sortKey="name" sort={sort} onSort={toggleSort} />
              </th>
              <th scope="col">
                <SortButton label="Manufacturer Number" sortKey="manufacturerNumber" sort={sort} onSort={toggleSort} />
              </th>
              <th scope="col">
                <SortButton
                  label="Compatible Machine Type"
                  sortKey="compatibleMachineType"
                  sort={sort}
                  onSort={toggleSort}
                />
              </th>
              <th scope="col">
                <SortButton label="Quantity in Stock" sortKey="quantityInStock" sort={sort} onSort={toggleSort} />
              </th>
              <th scope="col">Actions</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((sparePart) => (
              <tr key={sparePart.id}>
                <td>{sparePart.name || `Spare Part ${sparePart.id}`}</td>
                <td>{sparePart.manufacturerNumber || 'Not set'}</td>
                <td>{sparePart.compatibleMachineType || 'Not set'}</td>
                <td>{sparePart.quantityInStock ?? 0}</td>
                <td>
                  <Link to={`/spare-parts/${sparePart.id}`}>View</Link>{' '}
                  <Link to={`/spare-parts/${sparePart.id}/edit`}>Edit</Link>{' '}
                  <button className="button-destructive" type="button" onClick={() => removeSparePart(sparePart)}>
                    Delete
                  </button>
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
