import Dashboard from "layouts/Dashboard/Dashboard.jsx";
import Login from "layouts/Login/Login.jsx";

const indexRoutes = [
  { path: "/auth", component: Login },
  { path: "/", component: Dashboard },
  { redirect: true, path: "/", to: "/auth", navbarName: "Redirect" }
];

export default indexRoutes;
