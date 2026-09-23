import { request } from './client.js';

const SPARE_PARTS_URL = '/api/spare-parts';

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

export async function adjustSparePartStock(id, amount) {
  if (!Number.isSafeInteger(amount) || amount === 0) {
    throw new Error('Enter a whole number greater than zero.');
  }

  const current = await getSparePart(id);
  const currentQuantity = Number(current.quantityInStock);
  const nextQuantity = currentQuantity + amount;
  if (!Number.isSafeInteger(nextQuantity) || nextQuantity > 2147483647) {
    throw new Error('The resulting stock quantity is too large.');
  }
  if (nextQuantity < 0) {
    throw new Error(`Only ${currentQuantity} ${currentQuantity === 1 ? 'unit is' : 'units are'} available.`);
  }

  return updateSparePart(id, {
    name: current.name,
    manufacturerNumber: current.manufacturerNumber,
    compatibleMachineType: current.compatibleMachineType,
    description: current.description,
    quantityInStock: nextQuantity,
  });
}

export function deleteSparePart(id) {
  return request(`${SPARE_PARTS_URL}/${id}`, {
    method: 'DELETE',
  });
}
