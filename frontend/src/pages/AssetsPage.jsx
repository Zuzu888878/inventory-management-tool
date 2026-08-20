import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAssets } from '../api/assets.js'

function AssetsPage() {
  const [assets, setAssets] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAssets()
      .then(setAssets)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <h1>Assets</h1>
      <Link to="/assets/new">
        <button type="button">New Asset</button>
      </Link>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {assets.map((asset) => (
          <li key={asset.id}>
            {asset.name || `Asset ${asset.id}`}{' '}
            <Link to={`/assets/${asset.id}`}>View</Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export default AssetsPage
