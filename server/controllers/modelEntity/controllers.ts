export async function onCreateModel(useService, params) {
  const result = await useService.createModel(params);
  return result;
}

export async function onUpdateModel(useService, params) {
  const result = await useService.updateModel(params);
  return result;
}

export async function onDeleteModel(useService, { id }) {
    const result = await useService.deleteModel(id);
    return result;
}

export async function onGetAllModels(useService, params) {
  const result = await useService.getAllModels();
  return result;
}

export async function onGetAllModelsByEntityId(useService, { id }) {
  const result = await useService.getAllModelsByEntityId(id);
  return result;
}

export async function onGetAllFieldsByIdModel(useService, { id }) {
  const result = await useService.getAllFieldsByIdModel(id);
  return result;
}
