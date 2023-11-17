export const selectedPointUseCase = async (appStoreProvider, name) => {
  await appStoreProvider.setSelectedPoint(name);
};
