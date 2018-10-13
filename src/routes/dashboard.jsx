// @material-ui/icons
import ShowChart from "@material-ui/icons/ShowChart";
import Person from "@material-ui/icons/Person";
import LocationOn from "@material-ui/icons/LocationOn"
import SettingsRemote from "@material-ui/icons/SettingsRemote";
import EventNote from "@material-ui/icons/EventNote";
// core components/views
import DashboardPage from "../views/Dashboard/Dashboard.jsx";
import ReportsPage from "../views/Reports/Reports.jsx";
import UsersPage from "../views/Users/Users.jsx";
import LocationsPage from "../views/Locations/Locations.jsx";
import NodesPage from "../views/Nodes/Nodes.jsx";


const dashboardRoutes = [
  {
    id: 0,
    rootId: -1,
    path: "/dashboard",
    sidebarName: "Dashboard",
    navbarName: "Dashboard",
    icon: ShowChart,
    component: DashboardPage,
    admin: false,
    dropdown: false,
  },
  {
    id: 1,
    rootId: -1,
    path: "/reports",
    sidebarName: "Relatórios",
    navbarName: "Relatórios",
    icon: EventNote,
    component: ReportsPage,
    admin: false,
    dropdown: true,
  },
  {
    id: 1,
    rootId: 1,
    path: "/reports/measurements",
    sidebarName: "Medições",
    navbarName: "Relatório de Medições",
    icon: "M",
    component: ReportsPage,
    admin: false,
    dropdown: false,
  },
  {
    id: 2,
    rootId: 1,
    path: "/reports/valves",
    sidebarName: "Válvulas",
    navbarName: "Relatório de Acionamento das válvulas",
    icon: "V",
    component: ReportsPage,
    admin: false,
    dropdown: false,
  },
  {
    id: 3,
    rootId: -1,
    path: "/users",
    sidebarName: "Usuários",
    navbarName: "Usuários",
    icon: Person,
    component: UsersPage,
    admin: true,
    dropdown: false,
  },
  {
    id: 4,
    rootId: -1,
    path: "/locations",
    sidebarName: "Locais",
    navbarName: "Locais",
    icon: LocationOn,
    component: LocationsPage,
    admin: true,
    dropdown: false,
  },
  {
    id: 5,
    rootId: -1,
    path: "/nodes",
    sidebarName: "Nós da rede",
    navbarName: "Nós da rede",
    icon: SettingsRemote,
    component: NodesPage,
    admin: true,
    dropdown: false,
  },
  { redirect: true, path: "/", to: "/dashboard", navbarName: "Redirect" }
];

export default dashboardRoutes;
