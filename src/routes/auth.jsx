import LoginPage from "views/Login/Login";

const authRoutes = [
  { path: "/auth/authenticate", component: LoginPage },
  { path: "/auth/logout", component: LoginPage },
  { redirect: true, path: "/auth", to: "/auth/authenticate", navbarName: "Redirect" }
];

export default authRoutes;
