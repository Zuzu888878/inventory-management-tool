import {useEffect, useState} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import {deleteAsset, getAsset} from '../api/assets.js'

function AssetDetailsPage() {
    const {id} = useParams()
    const navigate = useNavigate()
    const [asset, setAsset] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        getAsset(id)
            .then(setAsset)
            .catch((requestError) => setError(requestError.message))
    }, [id])

    async function removeAsset() {
        try {
            await deleteAsset(id)
            navigate('/assets')
        } catch (requestError) {
            setError(requestError.message)
        }
    }

    return (
        <>
            <h1>{asset?.name}</h1>
            {!asset && !error && <p>Loading...</p>}
            {asset?.description && <p>{asset.description}</p>}
            {error && <p>{error}</p>}
            <Link to={`/assets/${id}/edit`}>
                <button type="button">Edit</button>
            </Link>{' '}
            <button type="button" onClick={removeAsset}>
                Delete
            </button>
            {' '}
            <Link to="/assets">
                <button type="button">Back</button>
            </Link>
        </>
    )
}

export default AssetDetailsPage
