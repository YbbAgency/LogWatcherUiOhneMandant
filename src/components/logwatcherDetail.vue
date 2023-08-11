<template>
  <div>
    <v-toolbar elevation="1" style="height:41px">
      <v-row class="d-flex w-100" style="height:37px">
        <v-col cols="2" style="height:37px">
          <h4>
            <template v-if="currentLogWatcher.id > -1">
              Log Watcher bearbeiten
            </template>
            <template v-else>
              Neuen Log Watcher Erstellen
            </template>
          </h4>
        </v-col>
        <v-col cols="10" style="height:37px;justify-content:end" class="d-flex align-center">
            <v-btn color="primary"  depressed :disabled="loading.update == true" @click="updateLogWatcher()" v-if="currentLogWatcher.id > -1">
              <v-icon>
                mdi-content-save
              </v-icon>
              Änderungen Speichern
            </v-btn>
            <v-btn color="success" depressed :disabled="loading.add == true" @click="createLogWatcher()" v-else>
              <v-icon>
                mdi-plus
              </v-icon>
              Erstellen
            </v-btn>
            <v-btn color="error"  depressed class="ml-3" :disabled="currentLogWatcher.id < 1" @click="deleteLogModalShow = true">
              <v-icon>
                mdi-delete
              </v-icon>
              Watcher Löschen
            </v-btn>
        </v-col>

      </v-row>

    </v-toolbar>
    <v-container   class=" pa-3" fluid >

          <v-row>
            <v-col cols="12" >
              <v-row >
                              <v-col cols="4">
                                <v-card rounded>
                                  <v-card-text style="height: 300px;" class="p-3">
                                    <v-text-field

                                        label="Watcher Name"
                                        hide-details="auto"
                                        type="string"
                                        v-model="currentLogWatcher.watcherName"
                                    >
                                    </v-text-field>
                                    <v-text-field
                                        class="mt-3"
                                        label="Betreff für Email bei gefundenem Log"
                                        hide-details="auto"
                                        type="text"
                                        v-model="currentLogWatcher.emailTitle"
                                    >
                                    </v-text-field>
                                    <v-text-field
                                        class="mt-3"
                                        label="Email Adresse"
                                        hide-details="auto"
                                        type="text"
                                        v-model="currentLogWatcher.sendTo"
                                    >
                                    </v-text-field>
                                    <v-text-field
                                        class="mt-3"
                                        label="BCC Email"
                                        hide-details="auto"
                                        type="text"
                                        :disabled="currentLogWatcher.sendTo == ''"
                                        v-model="currentLogWatcher.bcc"
                                    >
                                    </v-text-field>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                              <v-col cols="4">
                                <v-card rounded>
                                  <v-card-text   style="height: 300px;" class="p-3">
                                    <v-autocomplete
                                        :items="selectData.integration"
                                        v-model="currentLogWatcher.integration"
                                        label="Log Integration"
                                    >
                                    </v-autocomplete>
                                    <v-autocomplete
                                        :items="selectData.referenceType"
                                        v-model="currentLogWatcher.referenceType"
                                        label="Referenz Typ"
                                    >
                                    </v-autocomplete>
                                    <v-text-field
                                        label="Referenz Wert"
                                        hide-details="auto"
                                        type="string"
                                        :disabled="currentLogWatcher.referenceType == ''"
                                        v-model="currentLogWatcher.referenceValue"
                                    >
                                    </v-text-field>
                                    <v-text-field
                                        v-model="currentLogWatcher.identifier"
                                        label="Log Identifikator"
                                        hide-details="auto"
                                        type="string"
                                    >
                                    </v-text-field>

                                  </v-card-text>
                                </v-card>


                              </v-col>
                              <v-col cols="4">
                                <v-card rounded>
                                  <v-card-text style="height: 300px;" class="p-3">
                                    <v-select
                                        :items="selectData.cronIntervall"
                                        v-model="currentLogWatcher.cronIntervall"
                                        label="Intervall"
                                    >
                                    </v-select>
                                    <v-select
                                        class="mt-3"
                                        :items="selectData.level"
                                        v-model="currentLogWatcher.level"
                                        label="Log Level"
                                        multiple
                                    >
                                    </v-select>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                            </v-row>
            </v-col>
          </v-row>


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
    <v-col cols="auto">
      <v-dialog
          transition="dialog-top-transition"
          max-width="600"
          v-model="deleteLogModalShow"
      >
        <v-card>
          <v-toolbar color="error" class="text-h6" dark>
            Log Watcher {{ currentLogWatcher.watcherName }} löschen
          </v-toolbar>
          <v-card-text>
            <div class="text-h5 pa-5"> Löscht den Logwatcher {{ currentLogWatcher.id }} - {{ currentLogWatcher.watcherName }}<br> </div>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn color="error" @click="deleteLogWatcher();deleteLogModalShow = false">
              <v-icon>
                mdi-delete
              </v-icon>
              Löschen
            </v-btn>
            <v-btn color="primary"  @click="deleteLogModalShow = false">
              Abbrechen
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
  </div>

</template>

<script>
export default {
  name: 'Main',
  data: () =>
      ({
        currentLogWatcher: {
          id: -1,
          watcherName: '',
          level: ['error'],
          integration: '',
          identifier: '',
          referenceType: '',
          referenceValue: '',
          emailTitle: 'Plenty Log Watcher',
          sendTo: '',
          bcc: '',
          cronIntervall: 'alle 15 Minuten'
        },
        deleteLogModalShow: false,
        mainTabs: 0,
        loading: {
          table: false,
          delete: false,
          update: false,
          add: false,
        },
        alert: {
          message: '',
          active: false,
          type: ''
        }
      }),
  computed:
      {
        LogWatcherBody() {
          return this.$store.state.LogWatcherBody;
        },
        routeWatcher() {
          return this.$route.params;
        },
        selectData() {
          return {
            level:
                [
                  'alert',
                  'critical',
                  'error',
                  'info'
                ],
            referenceType: this.$store.state.referenceTypes,
            integration: this.$store.state.integrations,
            cronIntervall: [
              'alle 15 Minuten', 'Stündlich', 'Täglich'
            ]
          }
        }
      },
  mounted() {
    this.setWatcher();
  },
  watch:{
    $route() {
      this.setWatcher()
    }

  },
  methods:
      {
        setWatcher() {

          let routeWatcher = this.routeWatcher;
          let _self = this;


          if (this.routeWatcher.id < 1) {
            this.currentLogWatcher = {
                  id: -1,
                  watcherName: '',
                  level: ['error'],
                  integration: '',
                  identifier: '',
                  referenceType: '',
                  referenceValue: '',
                  emailTitle: 'Plenty Log Watcher',
                  sendTo: '',
                  bcc: '',
                  cronIntervall: 'alle 15 Minuten'
            }

          }
          else{
            for(let i = 0  ; i < this.LogWatcherBody.length ; i++)
            {
              if(this.LogWatcherBody[i].id == routeWatcher.id)
              {
                console.log(this.LogWatcherBody[i])
                this.currentLogWatcher = this.LogWatcherBody[i]
              }
            }
          }
        },
        createLogWatcher() {
          let _self = this;


          if (_self.currentLogWatcher.emailTitle !== '' && _self.currentLogWatcher.sendTo !== '' && _self.currentLogWatcher !== '') {
            _self.loading.add = true;
            let data = {
              watcherName: _self.currentLogWatcher.watcherName,
              integration: _self.currentLogWatcher.integration,
              identifier: _self.currentLogWatcher.identifier,
              referenceType: _self.currentLogWatcher.referenceType,
              referenceValue: _self.currentLogWatcher.referenceValue,
              emailTitle: _self.currentLogWatcher.emailTitle,
              sendTo: _self.currentLogWatcher.sendTo,
              bcc: _self.currentLogWatcher.bcc,
              cronIntervall: _self.currentLogWatcher.cronIntervall,
            }



            data.level = []
            for (let i = 0; i < _self.currentLogWatcher.level.length; i++) {
              data.level.push(_self.currentLogWatcher.level[i])
            }



            _self.$http.post(process.env.VUE_APP_CREATE_WATCHER + process.env.VUE_APP_PLUGIN_SET_PREVIEW, data).then((response) => {
              if (response) {
                let data = response.data;


                if (data.id > 0) {
                  _self.LogWatcherBody.unshift({
                    watcherName: data.watcherName,
                    id: data.id,
                    level: data.level,
                    integration: data.integration,
                    identifier: data.identifier,
                    referenceType: data.referenceType,
                    referenceValue: data.referenceValue,

                    emailTitle: data.emailTitle,
                    sendTo: data.sendTo,
                    bcc: data.bcc,
                    cronIntervall: data.cronIntervall
                  })

                  this.$store.commit('LogWatcherBody', _self.LogWatcherBody);
                  _self.alert.message = 'Der Watcher wurde erfolgreich erstellt'
                  _self.alert.active = true
                  _self.alert.type = "success"

                  setTimeout(function () {
                    _self.loading.add = false;
                    _self.$router.push('/')
                  }, 1000);

                }

              }
            }).catch((error) => {
              _self.loading.add = false;
              console.log("createLogWatcher", error)
            })
          } else {
            _self.alert.message = 'Bitte geben sie einen Email Titel , Namen für den Watcher und Emailadresse hinzu'
            _self.alert.active = true
            _self.alert.type = "error"
          }

        },
        updateLogWatcher() {
          let _self = this;

          if (_self.currentLogWatcher.emailTitle !== '' && _self.currentLogWatcher.sendTo !== '' && _self.currentLogWatcher !== '') {

            _self.loading.update = true;

            let data = {
              watcherName: _self.currentLogWatcher.watcherName,
              id: _self.currentLogWatcher.id,
              level: _self.currentLogWatcher.level,
              integration: _self.currentLogWatcher.integration,
              identifier: _self.currentLogWatcher.identifier,
              referenceType: _self.currentLogWatcher.referenceType,
              referenceValue: _self.currentLogWatcher.referenceValue,
              emailTitle: _self.currentLogWatcher.emailTitle,
              sendTo: _self.currentLogWatcher.sendTo,
              bcc: _self.currentLogWatcher.bcc,
              cronIntervall: _self.currentLogWatcher.cronIntervall,
            }




            data.level = []
            for (let i = 0; i < _self.currentLogWatcher.level.length; i++) {
              data.level.push(_self.currentLogWatcher.level[i])
            }


            _self.$http.post(process.env.VUE_APP_UPDATE_WATCHER + process.env.VUE_APP_PLUGIN_SET_PREVIEW, data).then((response) => {
              if (response) {

                if (response.data.id > 0) {
                  for (let i = 0; i < _self.LogWatcherBody.length; i++) {
                    if (_self.LogWatcherBody[i].id == _self.currentLogWatcher.id) {

                      _self.LogWatcherBody.splice(i, 1, _self.currentLogWatcher)

                      this.$store.commit('LogWatcherBody', _self.LogWatcherBody);

                      _self.alert.message = 'Der Watcher wurde erfolgreich aktualisiert'
                      _self.alert.active = true
                      _self.alert.type = "success"


                      setTimeout(function () {
                        _self.loading.update = false;
                        _self.$router.push('/')
                      }, 1000);
                    }
                  }
                }
              }
            }).catch((error) => {
              _self.loading.update = false;
              console.log("updateLogWatcher", error)
            })
          } else {
            _self.alert.message = 'Bitte geben sie einen Email Titel , Namen für den Watcher und Emailadresse hinzu'
            _self.alert.active = true
            _self.alert.type = "error"
          }
        },
        deleteLogWatcher() {
          let _self = this;

          _self.$http.get(process.env.VUE_APP_DELETE_WATCHER + _self.currentLogWatcher.id + process.env.VUE_APP_PLUGIN_SET_PREVIEW).then((response) => {
            if (response) {
              if (response.data.message == "success") {
                for (let i = 0; i < _self.LogWatcherBody.length; i++) {
                  if (_self.LogWatcherBody[i].id == _self.currentLogWatcher.id) {
                    _self.LogWatcherBody.splice(i, 1)
                  }
                }


                this.$store.commit('spliceWatcher', _self.currentLogWatcher.id);
                this.$store.commit('LogWatcherBody', _self.LogWatcherBody);

                _self.alert.message = 'Der Watcher wurde erfolgreich gelöscht'
                _self.alert.active = true
                _self.alert.type = "success"

                setTimeout(function () {
                  _self.$router.push('/')
                }, 1000);

              }
            }
          }).catch((error) => {
            _self.alert.message = 'Der Watcher konnte nicht gelöscht werden'
            _self.alert.active = true
            _self.alert.type = "error"
          })

        }
      }
}
</script>