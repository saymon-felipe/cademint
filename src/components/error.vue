<template>
    <p class="font-size-3 text-center" :class="typeClass" v-if="msg != ''">{{ msg }}</p>
</template>
<script>
export default {
    name: "error",
    props: ["msg", "type"],
    computed: {
        typeClass: function () {
            let typeClass = "success";

            if (this.type == "error") {
                typeClass = "error";
            }

            return typeClass;
        }
    },
    mounted: function () {
        setTimeout(() => {
            this.$emit("eraseError");
        }, 5000)
    }
}
</script>