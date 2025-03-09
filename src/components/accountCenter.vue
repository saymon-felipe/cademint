<template>
    <div class="account-center-container">
        <div class="account-center-header">
            <div class="form-group">
                <label for="group_name">Buscar</label>
                <input type="text" placeholder="Nome ou email" v-model="searchString" v-on:keyup="filterAccounts()">
            </div>
            <span class="material-icons" v-on:click="addAccount()">add_circle</span>
        </div>
        <div class="account-container">
            <div class="account" v-for="(account, index) in filteredAccounts" :key="index">
                <div class="account-principal-container">
                    <div class="account-principal">
                        <img :src="account.image">
                        <div>
                            <p class="font-size-4 preto">{{ account.type }}: {{ account.name }}</p>
                            <p class="font-size-6 cinza">{{ lastAccess(account.last_access) }}</p>
                        </div>
                    </div>
                    <div class="account-data">
                        <div class="user">
                            <div class="information-field">
                                <p><span class="field-name">Usuário:</span> <span :class="!account.visible ? 'hidden' : ''"><strong>{{ account.user }}</strong></span></p>
                                <span class="material-icons" v-if="account.visible" v-on:click="copyToClipboard(account.user)">content_copy</span>
                            </div>
                            <div class="information-field">
                                <p><span class="field-name">Senha:</span> <span :class="!account.visible ? 'hidden' : ''"><strong>{{ account.password }}</strong></span></p>
                                <span class="material-icons" v-if="account.visible" v-on:click="copyToClipboard(account.password)">content_copy</span>
                            </div>
                        </div>
                    </div>
                </div>
                <span class="material-icons" v-on:click="account.visible = !account.visible">{{ account.visible ? "visibility_off" : "visibility" }}</span>
            </div>
        </div>
    </div>
</template>
<script>
import moment from 'moment';
//import api from '../configs/api.js';

export default {
    name: "accountCenter",
    data() {
        return {
            searchString: "",
            filteredAccounts: [],
            accounts: []
        }
    },
    methods: {
        filterAccounts: function () {
            if (this.searchString.trim() == "") {
                this.filteredAccounts = this.accounts;
                return;
            }

            this.filteredAccounts = this.accounts.filter(account => {
                const search = this.searchString.toLowerCase();
                return (
                    account.type.toLowerCase().includes(search) ||
                    account.name.toLowerCase().includes(search) ||
                    account.user.toLowerCase().includes(search)
                );
            });
        },
        lastAccess: function (date) {
            return moment(date).fromNow();
        },
        copyToClipboard(text) {
            if (!navigator.clipboard) {
                console.error("API Clipboard não suportada no navegador.");
                return;
            }

            navigator.clipboard.writeText(text).then(() => {
                alert("Copiado para a área de transferência!");
            }).catch(err => {
                console.error("Erro ao copiar: ", err);
            });
        },
        getAccounts: function () {
            let self = this;
            let accounts = [
                {
                    id: 0,
                    user: "rabudinhaaa@gmail.com",
                    password: "senharabudinha123",
                    last_access: "2025-02-09 17:49:48",
                    type: "Google",
                    name: "rabudinhaaa",
                    image: "https://agenciapnz.com/wp-content/uploads/Logo-Google-G.png",
                    visible: false
                },
                {
                    id: 1,
                    user: "example@yahoo.com",
                    password: "password123",
                    last_access: "2025-02-10 10:30:00",
                    type: "Yahoo",
                    name: "exampleUser",
                    image: "https://upload.wikimedia.org/wikipedia/commons/2/24/Yahoo%21_icon.svg",
                    visible: false
                }
            ]

            self.accounts = accounts;
                self.filteredAccounts = accounts;

            /*api.get("/users/return_accounts").then((response) => {
                self.accounts = response.data.returnObj;
                self.filteredAccounts = response.data.returnObj;
            });*/
        }
    },
    mounted: function () {
        this.getAccounts();
    }
}
</script>
<style scoped>
.field-name {
    width: 55px;
    display: inline-block;
}

.account-center-container {
    width: 100%;
    margin: auto;
    font-family: Arial, sans-serif;
}

.account-center-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    gap: 5rem;
}

.form-group {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.form-group label {
    font-size: 14px;
    color: var(--black);
    margin-bottom: 4px;
}

.account-container {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 2rem;
}

.account {
    background: var(--white);
    border-radius: 8px;
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    border: 1px solid var(--gray-soft-2);
}

.account-principal-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    flex-wrap: wrap;
    flex: 1;
}

.account-principal {
    display: flex;
    align-items: center;
}

.account-principal img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
}

.account-informations {
    display: flex;
    flex-direction: column;
}

.account-data {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.user {
    display: flex;
    flex-direction: column;
}

.information-field {
    background: var(--gray-soft-2);
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 14px;
    color: var(--gray-text);
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
    height: 36px;
}

.hidden {
    filter: blur(5px);
    user-select: none;
}

.material-icons {
    font-size: 24px;
    cursor: pointer;
    color: var(--gray);
}

.material-icons:hover {
    color: var(--gray-low);
}

.material-icons:active {
    color: var(--black);
}

</style>