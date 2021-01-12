export async function onCreateFieldText(useService, params) {
  const result = await useService.createFieldText(params);
  return result;
}
//  Observer service for updating the FieldText
export async function onUpdateFieldText(useService, params) {
  const result = await useService.updateFieldText(params);
  return result;
}
//  Observer service for deleting the FieldText
export async function onDeleteFieldText(useService, { id }) {
  const result = await useService.deleteFieldText(id);
  return result;
}
//  Observer service for getting once FieldText
export async function onGetFieldText(useService, { id }) {
  const result = await useService.getFieldTextById(id);
  return result;
}
