import { AuthService } from "../auth";

// Observer an assert authication the Entity
export default async function observerAssertAuth(
  req,
  res,
  Service: any,
  callback: Function
) {
  try {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "POST, GET, PUT, UPDATE, DELETE, OPTIONS"
    );
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Content-Type", "application/json;charset=UTF-8")
    
    const useAuth = await AuthService.Init();
    await useAuth.isAuth(req);
    console.log('Пользователь авторизован!')
    const useService = await Service.Init();
    const params = req.query;
    const result = await callback(useService, params, req, res);
    res.send(result);
  } catch (e) {
    res.status(401).send(e?.message);
  }
}
