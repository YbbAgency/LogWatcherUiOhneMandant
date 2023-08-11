<template>
  <div >
    <v-toolbar elevation="1" class="d-flex w-100 align-center" style="justify-content: end; height:41px">
      <v-btn style="height:37px" color="success" depressed  @click="$router.push({path: '/logWatcher/'+0})" >
        <v-icon>
          mdi-plus
        </v-icon>
        Neuen Watcher erstellen
      </v-btn>
    </v-toolbar>
    <v-container fluid  >
        <div class=" pa-3">
          <v-row class="h-100">
            <v-col cols="12">
              <template>
                <v-data-table
                    class="elevation-3"
                    :loading="loadingTable"
                    :headers="LogWatcherHeader"
                    @click:row="setLogWatcher($event)"
                    :items="LogWatcherBody"
                    :items-per-page="100"
                    hide-default-footer
                >
                  <template   v-slot:item.identifier="{ item }">
                    <template v-if="item.identifier.length < 1">
                      Kein Idenfikator hinterlegt
                    </template>
                    <template v-else>
                        {{ item.identifier }}
                    </template>
                  </template>
                  <template  v-slot:item.integration="{ item }">
                    <template v-if="item.integration.length < 1">
                      Keine Integration hinterlegt
                    </template>
                    <template v-else>
                      {{ item.integration }}
                    </template>
                  </template>
                  <template v-slot:item.referenceType="{ item }">
                    <template v-if="item.referenceType.length < 1">
                      Kein Referenz Typ hinterlegt
                    </template>
                    <template v-else>
                      {{ item.referenceType }}
                    </template>
                  </template>
                  <template  v-slot:item.referenceValue="{ item }">
                    <template v-if="item.referenceValue.length < 1">
                      Kein Referenz Wert hinterlegt
                    </template>
                    <template v-else>
                      {{ item.referenceValue }}
                    </template>
                  </template>
                </v-data-table>
              </template>
            </v-col>
          </v-row>
        </div>

      </v-container>
    <v-snackbar
        right
        top
        :color="alert.type"
        elevation="15"
        :timeout="3000"
        v-model="alert.active"
    >
      {{ alert.message }}
    </v-snackbar>

  </div>

</template>

<script>
export default {
  name: 'Main',
  data: () =>
      ({
        LogWatcherHeader:
            [
              {
                text: 'Name',
                value: 'watcherName',
              },
              {
                text: 'Level',
                value: 'level',
              },
              {
                text: 'Identifikator',
                sortable: true,
                value: 'identifier',
              },
              {
                text: 'Integration',
                sortable: true,
                value: 'integration',
              },
              {
                text: 'Referenz Typ',
                sortable: true,
                value: 'referenceType',
              },
              {
                text: 'Referenz Wert',
                sortable: true,
                value: 'referenceValue',
              },

            ],
        loading:{
          table:false,
        },
        alert: {
          message:'',
          active:false,
          type:''
        }
      }),
  computed:
      {
        loadingTable()
        {
          return this.$store.state.loadingTable;
        },
        LogWatcherBody()
        {
          return this.$store.state.LogWatcherBody;
        },
      },
  methods:
      {
        setLogWatcher(event)
        {
          this.$store.commit('pushWatcher',event)
          this.$router.push({path: '/logWatcher/'+event.id})
        },

      },
};
</script>