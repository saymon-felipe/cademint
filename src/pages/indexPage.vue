<template>
    <siteTemplate>
        <router-view path="$router.key" />
    </siteTemplate>
</template>

<script>
import siteTemplate from '../templates/siteTemplate.vue';
import { globalMethods } from '../js/globalMethods';

export default {
    name: "indexPage",
    mixins: [globalMethods],
    components: {
        siteTemplate
    },
    mounted() {
        this.checkIfUserIsAuthenticated();
    }
}
</script>

<style scoped>

</style>