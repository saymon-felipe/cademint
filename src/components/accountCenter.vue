<template>
    <div class="account-center-container">
        <div class="account-center-header">
            <div class="form-group">
                <label for="group_name">Buscar</label>
                <input type="text" placeholder="Nome ou email" v-model="searchString" @keyup="filterAccounts()">
            </div>
            <span class="material-icons" @click="addAccount()">add_circle</span>
        </div>
        <div class="account-container">
            <loading :loading="loading" v-if="loading" />
            <div class="empty-accounts" v-if="filteredAccounts.length == 0 && !loading">
                <h4 class="cinza text-center">Você ainda não cadastrou nenhuma conta</h4>
            </div>
            <div class="account" v-for="account in filteredAccounts" :key="account.id">
                <div class="account-principal-container">
                    <div class="account-principal">
                        <img :src="account.image">
                        <div>
                            <p class="font-size-4 preto type-name">{{ account.type }}: {{ account.name }}</p>
                            <p class="font-size-6 cinza">{{ lastAccess(account.last_access) }}</p>
                        </div>
                    </div>
                    <div class="account-data">
                        <div class="user">
                            <div class="information-field">
                                <p>
                                    <span class="field-name">Usuário:</span> 
                                    <span :class="{'hidden': !userVisible[account.id]}"> <strong>{{ account["user"] }}</strong>
                                    </span>
                                </p>
                                <span 
                                    class="material-icons" 
                                    v-if="userVisible[account.id]" @click="copyToClipboard(account.id, 'user')"
                                >
                                    content_copy
                                </span>
                            </div>
                            <div class="information-field">
                                <p>
                                    <span class="field-name">Senha:</span> 
                                    <span 
                                        :class="{'hidden': !passwordVisible[account.id]}" 
                                        v-if="revealing[account.id]"
                                    >
                                        <strong>Carregando...</strong>
                                    </span>
                                    <span 
                                        :class="{'hidden': !passwordVisible[account.id]}" 
                                        v-else-if="revealedPassword[account.id]"
                                    >
                                        <strong>{{ revealedPassword[account.id] }}</strong>
                                    </span>
                                    <span :class="{'hidden': !passwordVisible[account.id]}" v-else>
                                        <strong>*********</strong>
                                    </span>
                                </p>
                                <span 
                                    class="material-icons" 
                                    v-if="revealedPassword[account.id] && passwordVisible[account.id]" 
                                    @click="copyToClipboard(account.id, 'password')"
                                >
                                    content_copy
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="account-actions">
                    <span 
                        class="material-icons" 
                        @click="toggleVisibility(account.id)" >
                        {{ (userVisible[account.id] || passwordVisible[account.id]) ? "visibility" : "visibility_off" }}
                    </span>
                    <span class="material-icons" @click="editAccount(account)">settings</span>
                    <span class="material-icons" @click="deleteAccount(account)">delete</span>
                </div>
                <p v-if="error[account.id]" class="error-message">{{ error[account.id] }}</p>
            </div>
        </div>
        <modal v-if="showModal" :modaltitle="modalTitle" :modalbutton1="modalButton1" excludepath="/users/delete_account/" :modalbutton2="modalButton2" @closeModal="getAccounts(); closeModalFunction();">
            <createAccountModalContent @savedContent="closeModalFunction(); getAccounts();" /> 
        </modal>
    </div>
</template>

<script>
import moment from 'moment';
import { globalMethods } from '../js/globalMethods';
import api from '../configs/api.js';
import createAccountModalContent from "./createAccountModalContent.vue";
import modal from "./modal.vue";
import loading from "./loading.vue";

export default {
    name: "accountCenter",
    mixins: [globalMethods],
    data() {
        return {
            searchString: "",
            filteredAccounts: [],
            accounts: [],
            loading: true,
            revealing: {},
            revealedPassword: {},
            passwordVisible: {},
            userVisible: {},
            error: {},
            sessionData: {}
        };
    },
    async created() {
        this.getAccounts();
    },
    methods: {
        deleteAccount: function (account) {
            this.showModalFunction("Excluir conta", "Excluir", "Cancelar", account);
        },
        editAccount: function (account) {
            this.showModalFunction("Editar conta", "Salvar", "Cancelar", account);
        },
        addAccount: function () {
            this.showModalFunction("Criar uma conta", "Criar", "Cancelar");
        },
        filterAccounts: function () {
            if (this.searchString.trim() === "") {
                this.filteredAccounts = this.accounts;
                return;
            }

            const search = this.searchString.toLowerCase();
            this.filteredAccounts = this.accounts.filter(account => {
                return (
                    (account.type && account.type.toLowerCase().includes(search)) ||
                    (account.name && account.name.toLowerCase().includes(search)) ||
                    (account.user && account.user.toLowerCase().includes(search))
                );
            });
        },
        lastAccess: function (date) {
            return moment(date).fromNow();
        },
        async toggleVisibility(accountId) {
            const isPasswordVisible = this.passwordVisible[accountId];
            const isUserVisible = this.userVisible[accountId];

            if (isPasswordVisible || isUserVisible) {
                this.hideAll(accountId);
                return;
            }

            this.$set(this.userVisible, accountId, true);
            await this.revealSecurePassword(accountId); 
        },

        async revealSecurePassword(accountId) {
            this.$set(this.revealing, accountId, true);
            this.$set(this.error, accountId, null);
            this.$set(this.revealedPassword, accountId, null);
            this.$set(this.passwordVisible, accountId, false); 

            try {
                const startResponse = await api.post('/users/access_account/reveal/start');
                const { publicKey, sessionId } = startResponse.data.returnObj; 

                this.$set(this.sessionData, accountId, { sessionId });

                const rsaPublicKeyBuffer = this.pemToArrayBuffer(publicKey);
                const importedRsaPublicKey = await window.crypto.subtle.importKey(
                    "spki", // Formato SubjectPublicKeyInfo (PEM)
                    rsaPublicKeyBuffer,
                    { name: "RSA-OAEP", hash: "SHA-256" },
                    false, // Não é exportável, pois não precisamos exportá-la
                    ["encrypt"]
                );

                const aesKey = await window.crypto.subtle.generateKey(
                    { name: "AES-CBC", length: 256 },
                    true, // Precisa ser exportável para ser criptografada e enviada
                    ["encrypt", "decrypt"]
                );

                this.$set(this.sessionData[accountId], 'aesKey', aesKey);

                const exportedAesKey = await window.crypto.subtle.exportKey("raw", aesKey);

                const encryptedAesKey = await window.crypto.subtle.encrypt(
                    { name: "RSA-OAEP" },
                    importedRsaPublicKey,
                    exportedAesKey
                );

                const encryptedAesKeyBase64 = btoa(String.fromCharCode(...new Uint8Array(encryptedAesKey)));

                const revealResponse = await api.post('/users/access_account/reveal/complete', {
                    accountId: accountId,
                    encryptedAesKey: encryptedAesKeyBase64,
                    sessionId: sessionId 
                });

                const { encryptedPassword, iv } = revealResponse.data.returnObj; 

                const encryptedPasswordBuffer = Uint8Array.from(atob(encryptedPassword), c => c.charCodeAt(0));
                const ivBuffer = Uint8Array.from(atob(iv), c => c.charCodeAt(0));

                const decryptedPasswordBuffer = await window.crypto.subtle.decrypt(
                    { name: "AES-CBC", iv: ivBuffer },
                    aesKey,
                    encryptedPasswordBuffer
                );

                const decryptedPassword = new TextDecoder().decode(decryptedPasswordBuffer);
                this.$set(this.revealedPassword, accountId, decryptedPassword);
                this.$set(this.passwordVisible, accountId, true);

                // Configura um timer para ocultar TUDO (usuário e senha) após 60 segundos
                setTimeout(() => this.hideAll(accountId), 60 * 1000);

            } catch (err) {
                console.error("Erro ao revelar senha:", err.response || err);
                const errorMessage = err.response && err.response.data && err.response.data.message 
                                   ? err.response.data.message 
                                   : "Erro ao carregar senha. Tente novamente.";
                this.$set(this.error, accountId, errorMessage);
                this.$set(this.passwordVisible, accountId, false); // Garante que não fique visível em caso de erro
                this.$set(this.userVisible, accountId, false); // Oculta o usuário também em caso de erro
            } finally {
                this.$set(this.revealing, accountId, false);
                // Limpe os dados temporários da sessão (chaves AES e session ID)
                if (this.sessionData[accountId]) {
                    delete this.sessionData[accountId].aesKey;
                    delete this.sessionData[accountId].sessionId;
                }
            }
        },
        pemToArrayBuffer(pem) {
            const base64 = pem
                .replace(/-----BEGIN PUBLIC KEY-----/, '')
                .replace(/-----END PUBLIC KEY-----/, '')
                .replace(/\s/g, '');
            
            const raw = window.atob(base64);
            const rawLength = raw.length;
            const array = new Uint8Array(new ArrayBuffer(rawLength));

            for (let i = 0; i < rawLength; i++) {
                array[i] = raw.charCodeAt(i);
            }
            return array;
        },
        async copyToClipboard(accountId, type) {
            let textToCopy = '';
            if (type === 'password') {
                textToCopy = this.revealedPassword[accountId];
            } else if (type === 'user') {
                const account = this.accounts.find(acc => acc.id === accountId);
                textToCopy = account ? account.user : '';
            }

            if (!textToCopy) {
                console.warn(`Não há ${type} para copiar para a conta ${accountId}.`);
                return;
            }

            try {
                await navigator.clipboard.writeText(textToCopy);
                console.log(`${type === 'password' ? 'Senha' : 'Usuário'} copiado para a área de transferência!`);
            } catch (err) {
                console.error("Erro ao copiar: ", err);
                console.log(`Falha ao copiar o ${type}. Por favor, copie manualmente.`);
            } finally {
                this.hideAll(accountId); 
            }
        },
        hideAll(accountId) {
            this.$set(this.userVisible, accountId, false); 
            this.$delete(this.revealedPassword, accountId);
            this.$delete(this.passwordVisible, accountId);  

            if (this.sessionData[accountId]) {
                delete this.sessionData[accountId].aesKey;
                delete this.sessionData[accountId].sessionId;
            }
        },
        hidePassword(accountId) {
            this.$delete(this.revealedPassword, accountId);
            this.$delete(this.passwordVisible, accountId);
            if (this.sessionData[accountId]) {
                delete this.sessionData[accountId].aesKey;
                delete this.sessionData[accountId].sessionId;
            }
        },
        async getAccounts() {
            this.loading = true;
            this.accountsError = null;
            try {
                const response = await api.get("/users/return_accounts");
                this.accounts = response.data.returnObj.map(account => ({
                    ...account,
                    userVisible: false,
                    passwordVisible: false
                }));
                this.filteredAccounts = this.accounts;
            } catch (error) {
                console.error("Erro ao buscar contas:", error);
                this.accountsError = "Não foi possível carregar as contas. Verifique sua conexão.";
            } finally {
                this.loading = false;
            }
        }
    },
    mounted: function () {
        this.getAccounts();
    },
    components: {
        createAccountModalContent,
        modal,
        loading
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
    display: grid;
    grid-template-columns: 1fr 2fr;
    flex: 1;
}

.account-principal {
    display: flex;
    align-items: center;
}

.account-principal img {
    width: 40px;
    height: 40px;
    min-width: 40px;
    min-height: 40px;
    max-width: 40px;
    max-height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    object-fit: cover;
}

.type-name {
    text-transform: capitalize;
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
    gap: var(--space-3);
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

.account-actions {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
}

.material-icons:hover {
    color: var(--gray-low);
}

.material-icons:active {
    color: var(--black);
}

.error-message {
    color: #dc3545;
    font-size: 0.9em;
    margin-top: 5px;
}

.success-message {
    color: #28a745;
    font-size: 0.9em;
    margin-top: 5px;
}

@media (max-width: 768px) {
    .account-principal-container {
        grid-template-columns: 1fr;
        gap: var(--space-5);
    }
}
</style>