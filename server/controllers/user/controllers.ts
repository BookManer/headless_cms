export async function onGetUser(useService, {token}, req) {
    const result = await useService.getUserByToken(req.header('Authorization').split('Bearer ')[1]);
    return result;
}