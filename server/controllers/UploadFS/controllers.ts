export async function onGetAllUploadFS(useService, params) {
    const res = await useService.getAllFS();
    return res;
}