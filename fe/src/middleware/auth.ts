export default defineNuxtRouteMiddleware((routeTo, _routeFrom) => {
  const isConnected = useCookie("is-connected").value;

  const privateRoutes = ["profile", "edit-campaign"];

  if (!isConnected && privateRoutes.includes(String(routeTo?.name) ?? "")) {
    return navigateTo({ name: "index" });
  }
});
