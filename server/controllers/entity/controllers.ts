export async function onCreatedEntity(useService, params) {
  params.date_created = new Date(params.date_created);
  params.date_last_updated = new Date(params.date_last_updated);
  const entity = await useService.createEntity(params);

  return entity;
}
// Observer service for updating the Entity
export async function onUpdateEntity(useService, params) {
  const entity = await useService.updateEntity(params);
  return entity;
}
// Observer service for deleting the Entity
export async function onDeletedEntity(useService, { id }) {
  console.log(id);
  const entity = await useService.deleteEntity(id);
  return entity;
}
// Observer service for geting once the Entity
export async function onGetEntity(useService, { id }) {
  const result = await useService.getEntity(id);
  return result;
}
export async function onGetAllEntites(useService, params) {
  const result = await useService.getAllEntities(params);
  return result;
}
// Observer service for getting all rows by the Entity
export async function onGetAllFieldsById(useService, { id }) {
  const result = await useService.getAllFieldsById(id);
  return result;
}
export async function onGetAllEntityByGroupId(useService, {group_id}) {
  const result = await useService.getAllEntityByGroupId(group_id);
  return result;
}
export async function onGetAllEntitiesByModelId(useService, { id }) {
  const result = await useService.getAllEntitiesByModelId(id);
  return result;
}

export async function onGetAllFields(useService) {
  const result = await useService.getAllFields();
  return result;
}

export async function onSyncEntityWithModel(useService, params) {
  const result = await useService.syncEntityWithModel(params);
  return result;
}