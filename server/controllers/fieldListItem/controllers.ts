export async function onCreateFieldListItem(useService, params) {
  const result = await useService.createFieldListItem(params);
  return result;
}
export async function onUpdateFieldListItem(useService, params) {
  const result = await useService.updateFieldListItem(params);
  return result;
}
export async function onDeleteFieldListItem(useService, { id }) {
  const result = await useService.deleteFieldListItem(id);
  return result;
}
export async function onGetFieldListItem(useService, { id }) {
  const result = await useService.getFieldListItem(id);
  return result;
}
export async function onGetAllFieldListItemsByListId(useService, { list_id }) {
  const result = await useService.getAllFieldListItemByListId(list_id);
  return result;
}
