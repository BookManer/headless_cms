export async function onCreateFieldList(useService, params) {
  const result = await useService.createFieldList(params);
  return result;
}
export async function onUpdateFieldList(useService, params) {
  const result = await useService.updateFieldList(params);
  return result;
}
export async function onDeleteFieldList(useService, { id }) {
  const result = await useService.deleteFieldList(id);
  return result;
}
export async function onGetFieldList(useService, { id }) {
  const result = await useService.getFieldList(id);
  return result;
}
