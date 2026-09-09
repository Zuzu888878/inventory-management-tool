const SPARE_PARTS_URL = '/api/spare-parts';

async function request(url, options) {
    const response = await fetch(url, options);

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || 'Request failed');
    }

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

export function getSpareParts() {
    return request(SPARE_PARTS_URL);
}

export function getSparePart(id) {
    return request(`${SPARE_PARTS_URL}/${id}`);
}

export function createSparePart(sparePart) {
    return request(SPARE_PARTS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sparePart),
    });
}

export function updateSparePart(id, sparePart) {
    return request(`${SPARE_PARTS_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sparePart),
    });
}

export function deleteSparePart(id) {
    return request(`${SPARE_PARTS_URL}/${id}`, {
        method: 'DELETE',
    });
}