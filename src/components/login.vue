<template>
    <div>
        <h4 class="header-text">Login:</h4>
        <form id="login-form" method="POST" @submit.prevent="login()">
            <input class="form-input" type="text" name="email" id="user" placeholder="Email" required>
            <input class="form-input" type="password" name="senha" id="password" placeholder="Senha" required>
            <div class="show-password" v-on:click="showPasswordToggleClass('.show-password .material-icons')">
                <span class="material-icons">visibility_off</span>
            </div>
            <div class="remember">
                <input type="checkbox" name="remember" id="remember">
                <label for="remember">Lembrar meu e-mail</label>
            </div>
            
            <button type="submit" id="submit-button" >Login</button>
            <div class="response">{{ response }}</div>
            <div class="loading" v-if="loading"></div>
        </form>
        <div class="login-actions">
            <h6 class="register">Não tem uma conta? <router-link to="/register" id="register"><strong>Cadastre-se</strong></router-link></h6>
            <h6><a href="#">Esqueci minha senha</a></h6>
        </div>
    </div>
</template>

<script>
import { globalMethods } from '../js/globalMethods.js';
import api from '../configs/api.js';
import $ from 'jquery';

export default {
    name: "loginComponent",
    mixins: [globalMethods],
    data() {
        return {
            joined_group: false,
            msg: "",
            response: "",
            loading: false,
            passwordVisible: false
        }
    },
    methods: {
        loadLoginPage: function () {
            let self = this, url = new URLSearchParams(window.location.search);
            self.msg = url.get("msg");
            self.joined_group = url.get("joined_group");

            if (self.msg != null) { // Se tiver o parametro msg na url mostrará uma mensagem.
                self.response = "Você foi desconectado";
            }
            
            let email = self.getEmailInLocalStorage(); //Pega o email que foi guardado em local storage se existir.
            let temp_email = self.getTemporaryEmail();
            if (temp_email != null) { // Se existir um email temporário, significa que o usuário está vindo da tela de cadastro, e mesmo que exista email no local storage para ser lembrado, o email vindo do registro tem prioridade.
                self.fillEmail(temp_email);
            } else {
                if (email != null) {
                    self.fillEmail(email);
                }
            }
            self.removeTemporaryEmail(); // Após preencher o input, o email temporário é deletado.

            $("#user").on("keyup", () => { // Se o email no input não for igual ao que está em local storage, a opção de lembrar email é exibida.
                let currentEmail = $("#user").val();
                self.showRemember(email, currentEmail);
            });

            $("#password").on("keydown", () => { // Função exibe botão de mostrar senha quando existe algum valor no input de password.
                setTimeout(() => {
                    if (!$("#password").val() == "") {
                        $(".show-password").show();
                    } else {
                        $(".show-password").hide();
                    }
                }, 10);
            });
        },
        login: function () { // Função acontece quando dá submit do formulário de login.
            let self = this;
            self.loading = true;
            self.response = "";

            let data = $("#login-form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                obj[item.name] = item.value;
                return obj;
            }, {});

            if (data['remember'] == 'on') { self.setEmailInLocalStorage(data['email']); } // Se o usuário marcou a opção de lembrar o email, pega o email do input e armazena em local storage.

            $("#login-form").find(".form-input").attr("disabled", "disabled");
            $("#submit-button").attr("disabled", "disabled");

            if ($("#password").attr("type") != "password") { // Antes de dar submit, o input é forçado a ficar do tipo password mesmo que o usuário tenha clicado para mostrar a senha.
                self.showPasswordToggleClass(".show-password .material-icons");
            }

            api.get("/system")
            .then(function(response){
                if (!response.data.response.in_maintenance) {
                    api.post("/usuarios/login", data)
                    .then(function(response2){
                        self.setJwtInLocalStorage(response2.data.token);
                        self.response = response2.data.mensagem;
                        $('.response').addClass("success");
                        self.loading = false;
                        if (self.joined_group != null) { // Se vier o parametro joined_group do registro, o login redireciona para a index e passa esse parâmetro para a exibição do modal.
                            self.$router.push("/home?joined_group=true");
                        } else {
                            self.$router.push("/home");
                        }
                    }).catch(error => {
                        let xhr;
                        if (error.response.data.mensagem != undefined) {
                            xhr = error.response.data.mensagem
                        } else {
                            xhr = "Erro ao fazer login!";
                        }

                        self.response = xhr;
                        self.loading = false;
                    }).then(function () {
                        $("#login-form").find('.form-input').attr('disabled', false);
                        self.loading = false;
                        $("#submit-button").attr("disabled", false);
                    })
                } else {
                    self.loading = false;
                    $(".response").addClass("error");
                    self.response = "O sistema está em manutenção, o login não será feito";
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
        showPasswordToggleClass: function (element) { // Mostra ou esconde a senha.
            let self = this;
            if (self.passwordVisible) {
                $(element).html("visibility_off");
                $("#password").attr("type", "password");
                self.passwordVisible = false;
                return;
            }

            $("#password").attr("type", "text");
            $(element).html("visibility");
            self.passwordVisible = true;
        },
        fillEmail: function (email) {
            $("#login-form").find("#user").val(email);
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
        this.loadLoginPage();
        this.checkIfUserIsAuthenticated(true);
    }
}
</script>

<style scoped>
    .loading {
        display: block;
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
        border: 1px solid var(--gray-high);
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
        top: 59px;
    }

        .show-password .material-icons {
            margin-top: -3px;
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