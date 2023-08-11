<template>
    <div class="d-flex plenty-input-search">
        <v-btn plain small icon tile @click="plainSubmit()">
            <v-icon small>
                mdi-magnify
            </v-icon>
        </v-btn>
        <input type="text" v-model="searchText" @click="open"  >
        <v-list dense style="max-width:440px;z-index: 999999" elevation="1" class="plentySearchList" v-if="showSub" v-click-outside="close">
            <v-list-item
                    v-for="(item, index) in listSearch"
                    :key="index"
                    link
                    @click="submitSearch(item)">
                <v-list-item-title>{{ item.name }} {{ searchText }}</v-list-item-title>
            </v-list-item>
        </v-list>
        <v-menu offset-y :close-on-content-click="false" v-model="showMenu">
            <template v-slot:activator="{ on, attrs }">
                <v-btn plain small icon tile v-bind="attrs" v-on="on">
                    <v-icon small>
                        mdi-tune
                    </v-icon>
                </v-btn>
            </template>
            <v-card style="min-width:500px; max-width:500px;">
                <v-card-text>
                    <div class="d-flex flex-wrap">
                        <div v-for="(filter,index) in listFilter" :key="index" class="flex-fill px-1" :class="[filter.full ? 'w-100' : 'w-50']">
                            <template v-if="filter.type=='switch'">
                                    <v-switch
                                            class="mt-0"
                                            v-model.number="filter.value"
                                            inset
                                            dense
                                            :label="filter.name"
                                    ></v-switch>
                            </template>
                            <template v-if="filter.type=='input'">
                                <v-text-field
                                        v-model="filter.value"
                                        :items="filter.items"
                                        :label="filter.name"
                                        dense>
                                </v-text-field>
                            </template>
                            <template v-if="filter.type == 'select'">
                                <v-select
                                        v-model="filter.value"
                                        :items="filter.items"
                                        :label="filter.name"
                                ></v-select>
                            </template>
                            <template v-if="filter.type=='date'">
                                <v-menu
                                        :nudge-right="40"
                                        transition="scale-transition"
                                        offset-y
                                        min-width="auto">
                                    <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                                v-model="filter.value"
                                                :label="filter.name"
                                                append-icon="mdi-calendar"
                                                v-bind="attrs"
                                                v-on="on"
                                                dense

                                        ></v-text-field>
                                    </template>
                                    <v-date-picker
                                            v-model="filter.value"
                                            @input="menu2 = false"
                                            no-title
                                            #flat
                                    ></v-date-picker>
                                </v-menu>

                            </template>
                        </div>
                    </div>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            text
                            depressed
                            tile
                            @click="resetFilter()"
                    >
                        Zurücksetzen
                    </v-btn>

                    <v-btn
                            color="primary"
                            depressed
                            tile
                            @click="submitFilter()"
                    >
                        Suchen
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-menu>
    </div>
</template>

<script>
    export default {
        name: "plentyInputSearch",
        props:["filter","search","actions"],
        data: () => (
        {
            showMenu:false,
            ownfilter:[],
            ownsearch:[],
            searchOverlay:true,
            searchText:'',
            closeSearch:false,
        }),
        created()
        {
            this.ownfilter = JSON.parse(JSON.stringify(this.filter));
            this.ownsearch = JSON.parse(JSON.stringify(this.search));
        },
        methods:
        {
            open()
            {
                this.closeSearch = false;
            },
            close()
            {
              this.closeSearch = true;
            },
            plainSubmit()
            {
                if(this.searchText=="")
                {
                    this.$emit('filterupdate',this.ownfilter);
                }
            },
            submitSearch(item)
            {
                item.value = this.searchText;
                this.$emit('searchselect',item);
                this.closeSearch = true;
            },
            resetFilter()
            {
                this.ownfilter = JSON.parse(JSON.stringify(this.filter));
                this.ownsearch = JSON.parse(JSON.stringify(this.search));
                this.$emit('filterupdate',this.ownfilter);
                this.showMenu = false;

            },
            submitFilter()
            {
                this.$emit('filterupdate',this.ownfilter);
                this.showMenu = false;
            }
        },

        watch:
        {

            filter(now)
            {
              this.ownfilter = JSON.parse(JSON.stringify(this.filter));
            },

            searchText(now,before)
            {
                if(now.length == 0 && before.length > 0)
                {
                    this.resetFilter()
                }
            }
        },
        computed:
        {
            listFilter()
            {
               return this.ownfilter;
            },
            listSearch()
            {
                return this.ownsearch;
            },
            showSub()
            {
                if(this.searchText!='' && this.closeSearch == false)
                {
                    return true
                }
                else
                {
                    return false;
                }
            }
        }
    }
</script>

<style scoped>

</style>