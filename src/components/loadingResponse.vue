<template>
    <div class="loading-response" :style="styletype == 'small' ? 'margin: 5px !important;' : 'margin: var(--space-7) 0;'">
        <error v-if="!loading" :msg="msg" :type="type" @eraseError="$emit('eraseError')" />
        <loading :loading="loading" v-if="loading" />
    </div>
</template>
<script>
import error from "./error.vue";
import loading from "./loading.vue";

export default {
    name: "loadingResponse",
    props: ["msg", "type", "loading", "styletype"],
    components: {
        error,
        loading
    }
}
</script>
<style scoped>
.loading-response {
    height: 40px;
    width: 100%;
}
</style>