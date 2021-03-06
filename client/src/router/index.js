import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/index.js";
import PickTeam from "../views/PickTeam.vue";
import Registration from "../views/Registration.vue";
import MyTeam from "../views/MyTeam.vue";
import Points from "../views/Points.vue";
import Transfers from "../views/Transfers.vue";
import Table from "../views/Table.vue";
import Stats from "../views/Stats.vue";
import League from "../views/League.vue";
import Fixtures from "../views/Fixtures.vue";

// Imports for Auth
import Login from "../views/Login.vue";
import RegisterUser from "../views/RegisterUser.vue";
import Reset from "../views/Reset.vue";
import Profile from "../views/Profile.vue";

// Imports for Admin
import AdminMain from "../views/AdminMain.vue";

// If authenticated continue / Else goto login
// if admin goto admin
const ifAuthenticated = (to, from, next) => {
  // next()
  if(store.getters.isAuthenticated && store.getters.userId == 1) next("/admin");
  else if (store.getters.isAuthenticated) next();
  else next("/");
};

// If not authenticated continue / Else goto myteam
// For Login % Register route
const ifNotAuthenticated = (to, from, next) => {
  // next()
  if (!store.getters.isAuthenticated) next();
  else next("/myteam");
};

// If authenticated and admin continue / Else go to login
const ifAdmin = (to, from, next) => {
  if (store.getters.isAuthenticated && store.getters.userId == 1) next();
  else next("/");
}
const routes = [
  {
    path: "/pickteam",
    name: "PickTeam",
    component: PickTeam,
    meta: { title: "Pick Team" },
    beforeEnter: ifAuthenticated,
  },
  // Save team for the first time
  {
    path: "/registration",
    name: "Registration",
    component: Registration,
    meta: { title: "Registration" },
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/myteam",
    name: "MyTeam",
    component: MyTeam,
    meta: { title: "Manage your team" },
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/points",
    name: "Points",
    component: Points,
    meta: { title: "Points" },
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/transfers",
    name: "Transfers",
    component: Transfers,
    meta: { title: "Trading Block" },
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/table",
    name: "Table",
    component: Table,
    meta: { title: "DL Cup Official League Table" },
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/statistics",
    name: "Statistics",
    component: Stats,
    meta: { title: "DL Stats" },
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/league",
    name: "Global League",
    component: League,
    meta: { title: "DL Global League" },
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/fixtures",
    name: "Fixtures",
    component: Fixtures,
    meta: { title: "Fixtures" },
    beforeEnter: ifAuthenticated,
  },

  // Routes For Auth
  {
    path: "/",
    alias: ["/login"],
    name: "Login",
    component: Login,
    meta: { title: "Login" },
    beforeEnter: ifNotAuthenticated,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterUser,
    meta: { title: "Register" },
    beforeEnter: ifNotAuthenticated,
  },
  {
    path: "/reset",
    name: "Reset Password",
    component: Reset,
    meta: { title: "Reset" },
    // add nav guard
  },
  {
    path: "/profile",
    name: "Customize Profile",
    component: Profile,
    meta: { title: "Profile" },
    // add nav guard
  },

  // Route for Admin
  {
    path: "/admin",
    name: "Admin Dash",
    component: AdminMain,
    meta: { title: "Admin Dashboard" },
    beforeEnter: ifAdmin,
  },
];

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// Add page title
router.beforeEach((to, from, next) => {
  document.title = to.meta.title
    ? to.meta.title + " - " + "Fantasy DL"
    : "Fantasy DL";
  next();
});

export default router;
