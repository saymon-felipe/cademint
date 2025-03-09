<template>
    <div class="exclude-modal-content">
        <div class="exclude-icon">
            <span class="material-icons vermelho font-size-h2">delete</span>
        </div>
        <div class="texts">
            <h2>Tem certeza que deseja excluir?</h2>
            <h3>Essa ação é irreversível</h3>
        </div>
        <loadingResponse :msg="response" :type="responseType" styletype="small" @eraseError="resetResponse(this)" />
        <input type="submit" id="submit-button" v-on:click="deleteItem()" style="display: none;">
    </div>
</template>
<script>
import { globalMethods } from '../js/globalMethods';
import loadingResponse from "./loadingResponse.vue";
import api from '../configs/api.js';

export default {
    name: "excludeModalContent",
    props: ["excludepath"],
    mixins: [globalMethods],
    data() {
        return {
            response: "",
            responseType: ""
        }
    },
    methods: {
        deleteItem: function () {
            let self = this;

            api.delete(self.excludepath).then((response) => {
                self.setResponse(response.data.message, "success");
                self.$emit("excludedContent", true);
            }).catch((error) => {
                self.setResponse(error.response.data, "error");
            }).then(() => {
                setTimeout(() => {
                    self.$emit("excludedContent", true);
                }, 5000)
            })
        }
    },
    components: {
        loadingResponse
    }
}
</script>
<style scoped>

.exclude-modal-content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    height: 100%;
}

.exclude-icon {
    background: var(--red-high);
    width: 80px;
    height: 80px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: var(--space-5);
}
</style>