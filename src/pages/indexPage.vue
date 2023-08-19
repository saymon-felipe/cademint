<template>
    <siteTemplate>
        <router-view path="$router.key" />
    </siteTemplate>
</template>

<script>
import siteTemplate from '../templates/siteTemplate.vue';

export default {
    name: "indexPage",
    components: {
        siteTemplate
    }
}
</script>

<style scoped>

</style>