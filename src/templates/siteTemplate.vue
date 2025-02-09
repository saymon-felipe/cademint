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
            let interval = setInterval(() => {
                if (self.$root.jwtLoaded) {
                    self.requireUser().then(() => {
                        if (self.$root.user != undefined) {
                            self.loadSystemVersion(true);
                            self.initApp = true;
                        }
                    });
                    clearInterval(interval);
                }
            }, 100)
        }).catch(() => {})
    }
}
</script>