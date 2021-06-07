import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    myTeam: {
      goalkeeper: [null, null],
      defender: [null, null, null],
      midfielder: [null, null, null],
      striker: [null, null],
    },
    myTeamName: localStorage.getItem('team-name') || '',
    userId: localStorage.getItem('user-id') || null,
    activeGameweek: 0,
  },

  getters: {
    isAuthenticated(state) {
      return state.userId && state.userId != "undefined" ? true : false;
    },

    myTeamName(state){
      return state.myTeamName;
    },
  },

  mutations: {
    updateMyTeam(state, myTeamUpdate) {
      state.myTeam = myTeamUpdate;
      console.log("Store--> MyTeam Updated Successfully!");
    },

    setMyTeamName(state, newTeamName) {
      localStorage.setItem("team-name", newTeamName);
      state.myTeamName = localStorage.getItem('team-name') || '';
      console.log("Store--> Team Name Updated Successfully!");
    },

    // Updater for User ID (AUTH)
    setCurrentUserID(state, userId) {
      // update state
      localStorage.setItem("user-id", userId);
      state.userId = localStorage.getItem('user-id') || null,
      console.log("Store--> User ID Updated Successfully!");
    },

    setActiveGameweek(state, gameweek) {
      state.gameweek = gameweek;
      console.log("Store--> Active Gameweek Updated Successfully");
    }
  },
  actions: {
    getActiveGameweek(context) {
      axios.get("http://localhost:5000/getactivegw")
        .then(res => context.commit("setActiveGameweek", res.activeGW))
        .catch(err => console.error(err));
    }
  },
  modules: {},
});
