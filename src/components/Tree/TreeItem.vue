<template>
    <div>
        <li :class="{'open':open}">
            <div class="d-flex">
                <div class="d-flex flex-fill" @click="openOrGoTo(items,items.cart_hash)">
                    <v-icon class="tree-icon" small>
                        mdi-{{ items.icon }}
                    </v-icon>
                    <span class="flex-fill">{{ items.name }}</span>
                </div>
                <template v-if="items.hasOwnProperty('children')">
                    <v-icon class="tree-icon nomini" @click="closeTree(items)">
                        mdi-chevron-left
                    </v-icon>
                </template>
            </div>
            <template v-if="items.hasOwnProperty('children')">
                <ul>
                    <TreeItem
                            v-for="(child,index) in items.children"
                            :key="index"
                            :items="child">
                    </TreeItem>
                </ul>
            </template>
        </li>
    </div>
</template>
<script>
    export default {
        name: "TreeItem",
        props:['items'],
        data: () => (
            {
                open:false
            }),
        methods:
        {

            closeTree:function()
            {
                if(this.open == true)
                {
                    this.open = false
                }
            },
            openOrGoTo:function(that,hash)
            {
                if(that.url && (this.$router.currentRoute.path != that.url))
                {
                    this.$router.push(that.url)
                }
                if(hash && (this.$router.currentRoute.path != '/cart/'+hash ))
                {
                   this.$router.push({ path: '/cart/'+hash });
                }
                if(this.open == false)
                {
                    this.open = true
                }
            }
        }
    }
</script>
