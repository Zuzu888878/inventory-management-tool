export function upsertCachedItem(cache, item) {
  const items = cache.items || [];
  const index = items.findIndex((currentItem) => String(currentItem.id) === String(item.id));

  if (index === -1) {
    return { ...cache, items: [...items, item], hasLoaded: true };
  }

  return {
    ...cache,
    items: items.map((currentItem, currentIndex) => (currentIndex === index ? item : currentItem)),
    hasLoaded: true,
  };
}

export function markDashboardStale(cache) {
  return { ...cache, hasLoaded: false };
}
