import { atom } from 'recoil';

const collectionState = {
  items: [],
  hasLoaded: false,
};

export const assetsState = atom({
  key: 'assetsState',
  default: collectionState,
});

export const maintenanceRecordsState = atom({
  key: 'maintenanceRecordsState',
  default: collectionState,
});

export const sparePartsState = atom({
  key: 'sparePartsState',
  default: collectionState,
});

export const dashboardState = atom({
  key: 'dashboardState',
  default: {
    data: null,
    hasLoaded: false,
  },
});
