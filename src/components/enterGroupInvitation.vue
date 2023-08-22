<template>
    <section class="enter-group-invitation">
        <div class="enter-group-container">
            <h1>Você foi convidado para entrar um grupo!</h1>
            <h4>Para entrar no grupo basta clicar no botão abaixo, caso não seja cadastrado você será redirecionado para a página de cadastro!</h4>
            <button id="enter-group" v-on:click="enterGroup()">ENTRAR NO GRUPO</button>
            <div class="response">{{ response }}</div>
        </div>
    </section>
</template>
<script>
import api from '../configs/api.js';
import { globalMethods } from '../js/globalMethods';
import $ from 'jquery';

export default {
    name: "enterGroupInvitation",
    mixins: [globalMethods],
    data() {
        return {
            response: null
        } 
    },
    methods: {
        enterGroup: function () {
            let self = this;
            let url = new URLSearchParams(window.location.search);
            let tokenParam = url.get("tk"); // Armazena cada parametro da URL em variáveis.
            let emailParam = decodeURIComponent(url.get("email")); 
            let groupIdParam = url.get("gid");
            let groupNameParam = url.get("gname");
            
            api.post("/usuarios/return_user_by_email", {
                email: emailParam
            })
            .then(function(response){
                let user = response.data.returnObj;
                let user_groups = user.user_groups;
                self.logoutUser(true);
                if (user_groups.some(obj => obj.groups_id != groupIdParam)) { // Se não existir o grupo solicitado na lista de grupos do usuário, o mesmo é adicionado no grupo, caso contrario aparece uma mensagem informativa e depois de 5 segundos é redirecionado para o login.
                    self.addUserToGroup(groupIdParam, tokenParam, user.id_usuario, emailParam).then(() => {
                        self.response = "Você entrou no grupo com sucesso!";
                        $(".response").addClass("success");
                        self.setTemporaryEmail(emailParam);
                        setTimeout(() => {
                            self.$router.push("/login?joined_group=true&gid=" + groupIdParam + "&gname=" + groupNameParam);
                            return;
                        }, 1000);
                    }).catch(() => {
                        self.response = "Erro ao entrar no grupo";
                        $(".response").addClass("error");
                    })
                } else {
                    self.response = "Você já faz parte desse grupo!";
                }
                setTimeout(() => {
                    self.$router.push("/login");
                }, 5000);
            }).catch(function () {
                self.$router.push(`/register?joined_group=true&email=${emailParam}&gid=${groupIdParam}&tk=${tokenParam}`);
            })
        }
    }
}
</script>
<style scoped>
.response {
    display: block;
}

.enter-group-invitation {
    position: absolute;
    width: 100%;
    height: 100%;
    background: var(--yellow);
}

.enter-group-container {
    background: white;
    border-radius: 20px;
    width: 80vw;
    height: 75vh;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    max-width: 70rem;
    max-height: 40rem;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
    position: absolute;
    padding: 1.5rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
}

    .enter-group-container h1 {
        margin-bottom: 2rem;
    }
     
    .enter-group-container h4 {
        margin-bottom: 7rem;
    }

    .enter-group-container button {
        background: var(--blue);
        color: var(--white);
        border: none;
        border-radius: 10px;
        font-size: 1.5rem;
        padding: 1rem 2rem;
        cursor: pointer;
    }

        .enter-group-container button:hover {
            background: var(--blue-low);
        }
</style>