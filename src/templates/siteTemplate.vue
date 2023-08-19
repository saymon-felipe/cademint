<template>
    <div v-if="initApp">
        <headerComponent />
        <slot />
    </div>
</template>

<script>
import headerComponent from '../components/header.vue';
import { globalMethods } from '../js/globalMethods';

export default {
    name: "siteTemplate",
    mixins: [globalMethods],
    components: {
        headerComponent
    },
    data() {
        return {
            initApp: false
        }
    },
    mounted: function () {
        let self = this;
        this.checkIfUserIsAuthenticated().then(() => {
            self.requireUser().then(() => {
                if (self.$root.user != undefined) {
                    this.loadSystemVersion(true);
                    self.initApp = true;
                }
            });
        }).catch(() => {})
    }
}
</script>