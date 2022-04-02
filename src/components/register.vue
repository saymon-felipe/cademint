<template>
    <div>
        <h4 class="header-text">Registre-se:</h4>
        <form id="register-form" method="POST" @submit.prevent="register()">
            <input class="form-input" type="text" name="nome" id="name" maxlength="9" placeholder="Nome" required>
            <input class="form-input" type="email" name="email" id="user" placeholder="Email" required>
            <input class="form-input password" type="password" name="senha" id="password" placeholder="Senha" v-on:keydown="showPassword()" required>
            <div class="show-password" v-on:click="showPasswordToggleClass('.show-password i', 'fa-eye-slash', 'fa-eye')">
                <i class="fas fa-eye-slash"></i>
            </div>
            <input class="form-input password" type="password" id="confirm_password" placeholder="Confirme a senha" required>
            
            <button type="submit">Registrar</button>
            <div class="response">{{ response }}</div>
            <div class="loading" v-if="loading"></div>
        </form>
        <div class="login-actions">
            <h6 class="register">Ja é cadastrado? <router-link to="/login"><strong>Faça login</strong></router-link></h6>
        </div>
    </div>
</template>

<script>
import { globalMethods } from '../js/globalMethods.js';
import api from '../configs/api.js';
import $ from 'jquery';

export default {
    name: "registerComponent",
    mixins: [globalMethods],
    data() {
        return {
            joined_group: false,
            email: "",
            response: "",
            tk: "",
            gid: "",
            beta_hash: "",
            loading: false
        }
    },
    methods: {
        fillEmail: function (email) { // Pega o valor do parâmetro e preenche o campo email do formulário de login.
            $("#register-form").find("#user").val(email);
        },
        showPassword: function () { // Função exibe botão de mostrar senha quando existe algum valor no input de password.
            setTimeout(() => {
                if (!$("#password").val() == "") {
                    $(".show-password").show();
                } else {
                    $(".show-password").hide();
                }
            }, 10);
        },
        loadRegisterPage: function () {
            let self = this, url = new URLSearchParams(window.location.search);
            self.joined_group = url.get("joined_group");
            self.email = url.get("email");
            self.gid = url.get("gid");
            self.tk = url.get("tk");
            self.beta_hash = url.get("beta_hash") == null ? '' : url.get("beta_hash");

            if (self.email != null) {
                self.fillEmail(self.email);
            }
        },
        createNewProjectFromRegister: function (user_id, user_name) { // Cria um novo projeto quando um usuário se registra, o projeto é criado como: "Projeto de {nome do usuário}".
            let data = {
                group_name: "Projeto de " + user_name,
                group_members: user_id,
                group_owner: user_id,
                id_usuario: user_id
            }, self = this; 

            api.post("/projects", data)
            .then(function(response){
                self.updateUserGroup(response.data.response.grupo_criado.groups_id, user_id);
            })
        },
        updateUserGroup: function (groups_id, user_id) {
            api.post("/usuarios/update_groups", {
                user_groups: groups_id,
                id: user_id
            })
        },
        register: function () { // Função acontece quando dá submit do formulário de registro.
            let self = this;
            self.response = "";
            self.loading = true;

            if ($("#password").val() !=$("#confirm_password").val()) {  // Se entrar significa as senhas não estão iguais
                self.response = "As senhas não correspondem";
                return;
            }
            
            let data = $("#register-form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                obj[item.name] = item.value;
                return obj;
            }, {});

            data["beta_hash"] = self.beta_hash;

            $("#register-form").find(".form-input").attr("disabled", "disabled");
            $("#submit-button").attr("disabled", "disabled");

            if ($("#password").attr("type") != "password") { // Antes de dar submit, o input é forçado a ficar do tipo password mesmo que o usuário tenha clicado para mostrar a senha.
                self.showPasswordToggleClass(".show-password i", "fa-eye-slash", "fa-eye");
            }
            api.get("/system")
            .then(function(response){
                if (!response.data.response.in_maintenance) {
                    api.post("/usuarios/cadastro", data)
                    .then(function(response2){
                        $("#register-form").find(".loading").hide();
                        $("#register-form").find('.response').addClass("success");
                        self.response = response2.data.mensagem;
                        self.createNewProjectFromRegister(response2.data.response.usuario_criado.id_usuario, response2.data.response.usuario_criado.nome); // Cria um novo projeto com base no nome do usuário cadastrado.
                        self.setTemporaryEmail(response2.data.response.usuario_criado.email);
                        self.logoutUser(true);
                        setTimeout(() => {
                            if (self.joined_group) { // Se vier o parametro joined_group na url, o registro redireciona para o login e passa esse parâmetro.
                                self.updateUserGroup(self.gid, response2.data.response.usuario_criado.id_usuario);
                                self.$router.push("/login?joined_group=true");
                            } else {
                                self.$router.push("/login");
                            }
                        }, 200);
                    }).catch((error) => {
                        let xhr;
                        if (error.response != undefined) {
                            xhr = error.response.data.mensagem
                        } else {
                            xhr = "Erro ao registrar!";
                        }

                        self.response = xhr;
                    }).then(function () {
                        $("#register-form").find('.form-input').attr('disabled', false);
                        $("#register-form").find(".loading").hide();
                        $("#submit-button").attr("disabled", false);
                    })
                } else {
                    self.loading = false;
                    $(".response").addClass("error");
                    self.response = "O sistema está em manutenção, usuário não será registrado";
                    setTimeout(() => {
                        self.$router.push("/maintenance");
                    }, 5000);
                }
            })
        },
        setEmailInLocalStorage: function (email) { // Se não existir um email em local storage ele armazena o que foi passado no parâmetro, se não ele sobrescreve o que já existia.
            localStorage.setItem("e-mail", email);
        },
        getEmailInLocalStorage: function () { // Recupera o email de local storage.
            let email = localStorage.getItem('e-mail');
            if (email == undefined) { return ""; }
            return email;
        },
        getTemporaryEmail: function () { // Recupera o email temporário de session storage.
            return sessionStorage.getItem("temp_email"); 
        },
        showPasswordToggleClass: function (element, older_class, new_class) { // Mostra ou esconde a senha.
            if ($(element).hasClass(older_class)) {
                $(element).removeClass(older_class);
                $(element).addClass(new_class);

                $(".password").attr("type", "text");
            } else if ($(element).hasClass(new_class)) {
                $(element).removeClass(new_class);
                $(element).addClass(older_class);

                $(".password").attr("type", "password");
            }
        },
        showRemember: function (email1, email2) {
            if (email1 == email2) { return; }
            $(".remember").css("display", "flex");
            return;
        },
        removeTemporaryEmail: function () {
            sessionStorage.removeItem("temp_email");
        }
    },
    mounted () {
        this.loadRegisterPage();
    }
}
</script>

<style scoped>
    .response {
        display: block !important;
    }

    .header-text {
        align-self: center;
        font-size: 1.7rem;
        font-weight: inherit;
        text-align: center;
        margin-bottom: 2rem;
    }

    form {
        margin: 20px 0;
        text-align: center;
        position: relative;
        font-size: 1.1rem;
    }

    .form-input, button {
        display: block;
        height: 40px;
        padding: 5px 30px;
        width: 100%;
        font-size: inherit;
    }

    button {
        background: var(--blue);
        border: none;
        border-radius: 10px;
        color: var(--white);
        cursor: pointer;
    }

    button:active {
        background: var(--blue-low);
    }

    input {
        border: 1px solid var(--gray-high-2);
        background: var(--cademint-white);
        border-radius: 10px;
        margin: 10px 0;
    }

    .show-password {
        display: none;
        position: absolute;
        background: transparent;
        padding: .2rem .5rem;
        cursor: pointer;
        right: 1.5rem;
        top: 109px;
    }

    #remember {
        margin: 0 5px;
    }

    .remember {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        display: none;
    }

        .remember label, .remember input {
            cursor: pointer;
        }

    .response {
        display: none;
        margin-top: 1rem;
        text-align: center!important;
        font-size: 1rem!important;
        text-transform: uppercase!important;
        font-weight: 600!important;
    }

    .login-actions {
        display: flex;
        justify-content: space-around;
        align-items: center;
        text-align: center;
        width: 100%;
    }

        .login-actions h6 {
            font-size: .9rem;
            font-weight: inherit;
        }

            .login-actions h6 a {
                text-decoration: none;
                color: var(--black);
            }

            .login-actions h6 a:hover {
                text-decoration: underline!important;
            }

    @media(max-width: 420px) {
        .header-text {
            font-size: 1.3rem;
        }

        form {
            font-size: 1rem;
        }

        .login-actions h6, .login-actions h6 a {
            font-size: .8rem;
        }
    }
</style>