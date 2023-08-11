import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    referenceTypes:[],
    integrations:[],
    LogWatcherBody:[],
    loadingTable:true,
    openWatcher:[],
    activeWatcher:0
  },
  mutations:
  {
    activeWatcher(state,id)
    {
      state.activeWatcher = id
    },
    pushWatcher(state,Watcher)
    {
      let push = true;
      for(let i = 0 ; i < state.openWatcher.length ; i++)
      {
        if(state.openWatcher[i].id == Watcher.id)
        {
          push = false;
        }
      }
      if(push == true)
      {
        state.openWatcher.push(Watcher)
      }
    },
    spliceWatcher(state,watcherId)
    {
      for(let i = 0 ; i < state.openWatcher.length ; i++)
      {
        if(state.openWatcher[i].id == watcherId)
        {
          state.openWatcher.splice(state.openWatcher.indexOf(i),1)
        }
      }

    },
    loadingTable(state,data)
    {
      state.loadingTable = data;
    },
    LogWatcherBody(state,data)
    {
      state.LogWatcherBody = data;
    },
    integrations(state,data)
    {
      state.integrations = data;
    },
    referenceTypes(state,data)
    {
      state.referenceTypes = data;
    }
  },
  actions:
  {

  },
  modules:
  {

  }
})
