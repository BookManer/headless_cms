export async function onCreateSEO(useService, params) {
  const result = await useService.createSEO(params);
  return result;
}
export async function onUpdateSEO(useService, params) {
  const result = await useService.updateSEO(params);
  return result;
}
export async function onDeleteSEO(useService, { id }) {
  const result = await useService.deleteSEO(id);
  return result;
}
export async function onGetSEO(useService, { id }) {
  const result = await useService.getSEO(id);
  return result;
}
