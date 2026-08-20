import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAssets } from '../api/assets.js';

function AssetsPage() {
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAssets()
      .then(setAssets)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <h1>Assets</h1>
      <Link to="/assets/new">
        <button type="button">New Asset</button>
      </Link>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && assets.length === 0 && <p>No assets found.</p>}
      {assets.length > 0 && (
        <table>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Status</th>
              <th scope="col">Location</th>
              <th scope="col">Next Maintenance</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td>{asset.name || `Asset ${asset.id}`}</td>
                <td>{asset.status || 'Not set'}</td>
                <td>{asset.location || 'Not set'}</td>
                <td>{asset.nextMaintenance || 'Not set'}</td>
                <td>
                  <Link to={`/assets/${asset.id}`}>View</Link> <Link to={`/assets/${asset.id}/edit`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default AssetsPage;
