<template>
    <div class="create-account">
        <form @submit.prevent="createAccount()">
            <div class="form-group">
                <label for="type">Tipo de conta, ex: Google, Facebook, etc.</label>
                <input type="text" id="type" v-model="accountType" required>
            </div>
            <div class="form-group">
                <img :src="accountType == '' ? require('@/assets/img/account-default.png') : 'https://logo.clearbit.com/' + accountType + '.com'" @load="accountTypeImage = 'https://logo.clearbit.com/' + accountType + '.com'" @error="accountTypeImage = require('@/assets/img/account-default.png')" alt="" class="account-type-image">
            </div>
            <div class="form-group">
                <label for="name">Nome</label>
                <input type="text" id="name" v-model="accountName" required>
            </div>
            <div class="form-group">
                <label for="user">Usuário ou email</label>
                <input type="text" id="user" v-model="accountUser" required>
            </div>
            <div class="form-group">
                <label for="password">Senha</label>
                <input type="text" id="password" v-model="accountPassword" required>
            </div>
            <button type="submit" id="submit-button" style="display: none;"></button>
        </form>
    </div>
</template>
<script>
import { reactive } from 'vue';
import api from '../configs/api.js';
import { globalMethods } from '../js/globalMethods';

export default {
    name: "createAccountModalContent",
    mixins: [globalMethods],
    data() {
        return {
            accountType: "",
            accountName: "",
            accountUser: "",
            accountPassword: "",
            accountTypeImage: ""
        }
    },  
    computed: {
        editAccount: function () {
            return this.$root.contentObject ? reactive(this.$root.contentObject) : { id: 0 };
        }
    },
    mounted: function () {
        if (this.editAccount.id) {
            this.accountType = this.$root.contentObject.type;
            this.accountName = this.$root.contentObject.name;
            this.accountUser = this.$root.contentObject.user;
            this.accountPassword = this.$root.contentObject.password;
            this.accountTypeImage = this.$root.contentObject.image;
        }
    },
    methods: {
        createAccount: function () {
            let self = this;
            let account = {
                type: this.accountType,
                name: this.accountName,
                user: this.accountUser,
                password: this.accountPassword,
                image: this.accountTypeImage
            }

            if (this.editAccount.id != 0) {
                api.patch("/users/update_account/" + this.editAccount.id, account).then((response) => {
                    self.setResponse(response.data.message, "success");
                    self.$emit("savedContent");
                }).catch((error) => {
                    self.setResponse(error.response.data, "error");
                })
            } else {
                api.post("/users/create_account", account).then((response) => {
                    self.setResponse(response.data.message, "success");
                    self.$emit("savedContent");
                }).catch((error) => {
                    self.setResponse(error.response.data, "error");
                })
            }
        }
    }
}
</script>
<style scoped>
.account-type-image {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    border: 1px solid var(--gray-soft-2);
    padding: 5px;
    object-fit: cover;
}
</style>