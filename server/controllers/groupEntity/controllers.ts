export async function onGetGroupById(useService, {id}) {
    const result = await useService.getGroupById(id);
    return result;
}

export async function onGetAllGroup(useService) {
    const result = await useService.getAllGroups();
    return result;
}

export async function onGetAllEntityByGroupId(useService, {group_id}) {
    const result = await useService.getAllEntityByGroupId(group_id);
    return result;
}