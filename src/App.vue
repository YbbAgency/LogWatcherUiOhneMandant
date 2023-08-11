<template>
  <v-app>
    <v-navigation-drawer app :mini-variant.sync="mini">
      <div class="border-bottom toggleButton" style="line-height:41px;">
        <v-btn @click="goMiniOrMax()" fab x-small icon>
          <v-icon>
            mdi-menu
          </v-icon>
        </v-btn>
      </div>
      <div v-for="item in treeItems" :key="item.name" class="border-bottom">
        <ul class="plenty-treeview">
          <template v-if="item.hasOwnProperty('children')">
            <TreeItem :items="item" :has-child="true"></TreeItem>
          </template>
          <template v-else>
            <TreeItem :items="item"></TreeItem>
          </template>
        </ul>
      </div>
      <template v-if="$store.state.openWatcher.length > 0">
        <div
            class="border-bottom"
            v-for="(watcher,index) in $store.state.openWatcher"
            :key="index">
          <ul :class="{'activeWatcher':activeWatcher() == watcher.id}" class="plenty-treeview" @click="toWatcher(watcher)">
            <li class="">
              <div class="d-flex">
                <div class="d-flex flex-fill">
                  <i aria-hidden="true" class="v-icon notranslate tree-icon mdi mdi-clipboard-text theme--light" style="font-size: 16px;">
                  </i>
                  <span class="flex-fill">{{ watcher.watcherName }}</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </template>
    </v-navigation-drawer>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import TreeItem from "./components/Tree/TreeItem";

export default {
  name: 'App',
  components:
      {
        TreeItem
      },
  data: () => (
      {
        mini  :false,
      }),
  created() {
    this.getInitialData();

  },

  methods:
      {
        toWatcher(watcher)
        {
          if(window.location.hash !== '#/logWatcher/'+watcher.id)
          {
            this.$router.push({path:'/logWatcher/'+watcher.id});
          }
        },
        openWatcher()
        {
          return this.$store.state.openWatcher;
        },
        activeWatcher()
        {
           return this.$store.state.activeWatcher;
        },
        getInitialData()
        {
          let _self = this;

          _self.$http.get( process.env.VUE_APP_GET_INTEGRATION_KEYS+process.env.VUE_APP_PLUGIN_SET_PREVIEW).then((response) => {
            if(response)
            {
              let data = response.data

              let integrations = []
              for(let i = 0; i < data.length; i++)
              {
                integrations.push(data[i])
              }
              this.$store.commit('integrations',integrations);

            }
          }).catch((error) => {
            console.log("INTEGRATION_KEYS",error)
          })

          _self.$http.get( process.env.VUE_APP_GET_REFERNCE_TYPES+process.env.VUE_APP_PLUGIN_SET_PREVIEW).then((response) => {
            if(response)
            {
              let data = response.data

              let referenceTypes = [];

              for (const [key, value] of Object.entries(data)) {
                referenceTypes.push(key)
              }

              this.$store.commit('referenceTypes',referenceTypes);

            }
          }).catch((error) => {
            console.log(error)
          })


          _self.$http.post( process.env.VUE_APP_GET_UI_DATA+process.env.VUE_APP_PLUGIN_SET_PREVIEW).then((response) => {
            if(response)
            {

              let data = response.data


              let body = [];
              for(let i = 0 ; i < data.logs.entries.length ; i++)
              {



                  body.push ({
                    watcherName:data.logs.entries[i].watcherName,
                    id:data.logs.entries[i].id,
                    level:data.logs.entries[i].level,
                    integration:data.logs.entries[i].integration,
                    identifier:data.logs.entries[i].identifier,
                    referenceType:data.logs.entries[i].referenceType,
                    referenceValue:data.logs.entries[i].referenceValue,
                    emailTitle:data.logs.entries[i].emailTitle,
                    sendTo:data.logs.entries[i].sendTo,
                    bcc:data.logs.entries[i].bcc,
                    cronIntervall:data.logs.entries[i].cronIntervall
                  })

              }
              this.$store.commit('LogWatcherBody',body);
              this.$store.commit('loadingTable',false);
            }
          }).catch((error) => {
            console.log(error)
          })

        },
        goMiniOrMax:function()
        {
          if(this.mini)
          {
            this.mini = false
          }
          else
          {
            this.mini = true
          }
        },
        setCurrentActive:function(current)
        {
          for(let i = 0; i < this.treeItems.length; i++)
          {
            this.treeItems[i].active = false
          }
          for(let i = 0; i < this.treeItems.length; i++)
          {
            if(this.treeItems[i].highlight == current.name)
            {
              this.treeItems[i].active = true
            }
          }
        }
      },
  watch: {
    $route() {

      if(this.$router.currentRoute.params.id > 0)
      {
        this.$store.commit('activeWatcher',this.$router.currentRoute.params.id);
      }
      else{
        this.$store.commit('activeWatcher',0);
      }
      this.setCurrentActive(this.$router.currentRoute)
    }
  },
  computed:
      {
        treeItems:function ()
        {
          let items =
              [
                {
                  name: "Dashboard",
                  icon:'chart-bar',
                  key:'dashboard',
                  url:'/',
                  active:false
                },
              ];
          return items;
        }
      }
};
</script>

