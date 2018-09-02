// @material-ui/icons
import ShowChart from "@material-ui/icons/ShowChart";
import Person from "@material-ui/icons/Person";
import LocationOn from "@material-ui/icons/LocationOn"
import SettingsRemote from "@material-ui/icons/SettingsRemote";
import EventNote from "@material-ui/icons/EventNote";
// core components/views
import DashboardPage from "views/Dashboard/Dashboard.jsx";
import ReportsPage from "views/Reports/Reports.jsx";
import UsersPage from "views/Users/Users.jsx";
import LocationsPage from "views/Locations/Locations.jsx";
import NodesPage from "views/Nodes/Nodes.jsx";

const dashboardRoutes = [
  {
    path: "/dashboard",
    sidebarName: "Dashboard",
    navbarName: "Dashboard",
    icon: ShowChart,
    component: DashboardPage,
    admin: false
  },
  {
    path: "/reports",
    sidebarName: "Relatórios",
    navbarName: "Relatórios",
    icon: EventNote,
    component: ReportsPage,
    admin: false
  },
  {
    path: "/users",
    sidebarName: "Usuários",
    navbarName: "Usuários",
    icon: Person,
    component: UsersPage,
    admin: true,
  },
  {
    path: "/locations",
    sidebarName: "Locais",
    navbarName: "Locais",
    icon: LocationOn,
    component: LocationsPage,
    admin: true
  },
  {
    path: "/nodes",
    sidebarName: "Nós da rede",
    navbarName: "Nós da rede",
    icon: SettingsRemote,
    component: NodesPage,
    admin: true
  },
  { redirect: true, path: "/", to: "/dashboard", navbarName: "Redirect" }
];

export default dashboardRoutes;
