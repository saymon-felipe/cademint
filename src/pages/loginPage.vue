<template>
    <loginTemplate>
        <loginComponent />
    </loginTemplate>
</template>

<script>
import loginTemplate from "../templates/loginTemplate.vue"
import loginComponent from "../components/login.vue"

export default {
    name: "login",
    components: {
        loginTemplate,
        loginComponent
    }
}
</script>

<style scoped>

</style>