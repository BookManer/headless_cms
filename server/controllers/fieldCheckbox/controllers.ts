export async function onCreateFieldCheckbox(useService, params) {
  console.log(Object.keys(params).length);
  const result = await useService.createFieldCheckbox(params);
  return result;
}
export async function onUpdateFieldCheckbox(useService, params) {
  const result = await useService.updateFieldCheckbox(params);
  return result;
}
export async function onDeleteFieldCheckbox(useService, { id }) {
  const result = await useService.deleteFieldCheckbox(id);
  return result;
}
export async function onGetFieldCheckbox(useService, { id }) {
  const result = await useService.getFieldCheckbox(id);
  return result;
}
