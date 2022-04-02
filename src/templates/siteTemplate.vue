<template>
    <div>
        <headerComponent />
        <slot />
    </div>
</template>

<script>
import headerComponent from '../components/header.vue';


export default {
    name: "siteTemplate",
    components: {
        headerComponent
    }
}
</script>