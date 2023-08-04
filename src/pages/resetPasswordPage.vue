<template>
    <div class="reset-password-page">
        <div class="reset-header">
            <router-link to="/login" class="back">
                <span class="material-icons">arrow_back</span>
                <p class="font-size-4">Voltar para o login</p>
            </router-link>
            <img src="../assets/img/logo-cademint-v2-reduced.png">
        </div>
        <div class="reset-password-container">
            <div class="enter-email" v-if="getEmail">
                <div class="logo">
                    <span class="material-icons">lock</span>
                </div>
                <p class="font-size-2-bold">Esqueci a senha</p>
                <p class="font-size-5">Insira seu email para recuperar sua senha</p>
                <form action="get_user_email" @submit.prevent="sendResetPasswordEmail($event)"  autocomplete="off">
                    <div class="form-input">
                        <label for="email" class="font-size-4-bold">Email</label>
                        <input type="email" name="email" id="email" placeholder="Insira seu email" required v-on:focusout="validateEmailInput($event)">
                    </div>
                    <button type="submit">Recuperar senha</button>
                </form>
            </div>
            <div class="check-email" v-if="checkEmail">
                <div class="logo">
                    <span class="material-icons">email</span>
                </div>
                <p class="font-size-2-bold">Verifique seu email</p>
                <p class="font-size-5">Nós enviamos um link de recuperação de senha com validade de 30 minutos para o email abaixo:</p>
                <a :href="'mailto:' + userEmail" class="font-size-3-bold">{{ userEmail }}</a>
            </div>
            <div class="invalid-token" v-if="invalidToken">
                <div class="logo danger">
                    <span class="material-icons">clear</span>
                </div>
                <p class="font-size-2-bold">Token inválido</p>
                <p class="font-size-5">O token informado é inválido ou está expirado, solicite uma nova mudança de senha</p>
            </div>
            <div class="create-new-password" v-if="createNewPassword">
                <div class="logo">
                    <span class="material-icons">lock</span>
                </div>
                <p class="font-size-2-bold">Crie uma nova senha</p>
                <p class="font-size-5">Sua nova senha deverá ser diferente da anterior</p>
                <form action="reset_password" @submit.prevent="changePassword('#new-password', '#repeat-password')" autocomplete="off">
                    <div class="form-input">
                        <label for="new-password" class="font-size-4-bold">Nova senha</label>
                        <input type="password" name="new_password" id="new-password" placeholder="Insira a nova senha" required>
                    </div>
                    <div class="form-input">
                        <label for="repeat-password" class="font-size-4-bold">Repetir senha</label>
                        <input type="password" id="repeat-password" placeholder="Repita a nova senha" required>
                    </div>
                    <button type="submit">Criar nova senha</button>
                </form>
            </div>
            <div class="password-changed" v-if="passwordChanged">
                <div class="logo success">
                    <span class="material-icons">done</span>
                </div>
                <p class="font-size-2-bold">Tudo certo!</p>
                <p class="font-size-5">Você será redirecionado para o login</p>
            </div>
            <p class="response">{{ response }}</p>
        </div>
        <div class="footer">
            <div class="copyright">
                <p class="font-size-5">Copyright © 2022 Cademint</p>
            </div>
            <div class="footer-links">
                <router-link to="/help" class="redirect">Ajuda</router-link> -
                <router-link to="/privacy-policy" class="redirect">Privacidade</router-link> -
                <router-link to="/terms-of-use" class="redirect">Termos de uso</router-link>
            </div>
        </div>
    </div>
</template>
<script>
import { globalMethods } from '../js/globalMethods';
import api from '../configs/api.js';
import $ from 'jquery';

export default {
    name: "resetPasswordPage",
    mixins: [globalMethods],
    data() {
        return {
            getEmail: true,
            userEmail: "",
            checkEmail: false,
            createNewPassword: false,
            invalidToken: false,
            passwordChanged: false,
            token: null,
            response: ""
        }
    },
    watch: {
        token: function () {
            if (this.token != null && this.token != undefined) {
                this.validateToken(this.token);
            }
        },
        invalidToken: function () {
            setTimeout(() => {
                this.$router.push("/login");
            }, 5 * 1000);
        }
    },
    methods: {
        changePassword: function (input_id, confirm_input_id) {
            let input = $(input_id);
            let confirmInput = $(confirm_input_id);
            let self = this;

            

            if (confirmInput.val() != input.val()) {
                self.response = "As senhas não coincidem";
                confirmInput.val("");
                return;
            }

            let data = {
                senha: input.val(),
                token: self.token
            }

            self.response = "";

            api.patch("/usuarios/change_password", data)
            .then(function (response) {
                $(".response").addClass("success");
                self.response = response.data.mensagem;
                self.removeJwtFromLocalStorage();
                self.passwordChangedFunction();
                setTimeout(() => {
                    self.$router.push("/login");
                }, 1500);
            })
            .catch(function (error) {
                if ($(".response").hasClass("success")) {
                    $(".response").removeClass("success");
                }
                self.response = error.response.data.error;
            })
        },
        validateEmailInput: function (event) {
            let target = $("#" + event.target.id);
            let emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

            if (!emailRegex.test(target.val())) {
                target.addClass("invalid-value");
            } else {
                target.removeClass("invalid-value");
            }
        },
        resetVariables: function () {
            this.getEmail = false;
            this.checkEmail = false;
            this.createNewPassword = false;
            this.invalidToken = false;
        },
        getRouteParams: function () {
            let urlParams = new URLSearchParams(window.location.href.split("?")[1]);
            this.token = urlParams.get("reset_token");
        },
        validateToken: function () {
            let self = this;
            let data = {
                token: self.token
            }

            self.resetVariables();

            api.post("/usuarios/validate_reset_password_token", data)
            .then(function () {
                self.createNewPassword = true;
            })
            .catch(function () {
                self.invalidToken = true;
            })
        },
        sendResetPasswordEmail: function (event) {
            let input = $("" + event.target.localName + " input");
            let self = this;
            
            self.response = "";

            if (input.hasClass("invalid-value")) {
                self.response = "Email inválido";
                return;
            }

            self.userEmail = input.val();

            let data = {
                email: input.val()
            }

            api.post("/usuarios/forgot_password", data)
            .then(function () {
                self.emailSent();
            })
            .catch(function (error) {
                self.response = error.response.data.error;
            })
        },
        passwordChangedFunction: function () {
            let password_change = $(".create-new-password");
            password_change.css("transform", "translateX(-100px)").css("opacity", 0);
            this.response = "";
            setTimeout(() => {
                this.createNewPassword = false;
                setTimeout(() => {
                    this.passwordChanged = true;
                    setTimeout(() => {
                        let password_changed_container = $(".password-changed");
                        password_changed_container.css("transform", "translateX(0)").css("opacity", 1);
                    }, 10);
                }, 10);
            }, 400);
        },
        emailSent: function () {
            let get_email = $(".enter-email");
            get_email.css("transform", "translateX(-100px)").css("opacity", 0);
            setTimeout(() => {
                this.getEmail = false;
                setTimeout(() => {
                    this.checkEmail = true;
                    setTimeout(() => {
                        let verify_email = $(".check-email");
                        verify_email.css("transform", "translateX(0)").css("opacity", 1);
                    }, 10);
                }, 10);
            }, 400);
        }
    },
    mounted: function () {
        this.getRouteParams();
    }
}
</script>
<style scoped>
.response {
    font-size: 18px;
    text-transform: initial;
    margin-top: -1rem;
}

p {
    margin-top: .5rem;
}

form {
    margin: 2rem 0;
    display: flex;
    flex-direction: column;
    width: 100%;
}

    form label {
        text-align: left;
    }

    form button {
        padding: 7px;
        border-radius: 7px;
        border: none;
        background: var(--blue);
        color: var(--white);
        transition: all .4s;
        cursor: pointer;
    }

        form button:hover {
            background: var(--blue-low);
        }

.reset-password-page {
    width: 100%;
    height: 100vh;
}

.reset-password-page::after {
    content: "";
    position: absolute;
    top: 0;
    z-index: 1;
    background: var(--yellow);
    height: 300px;
    width: 100%;
}

.reset-header {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    position: relative;
    height: 50px;
    border-bottom: 1px solid var(--gray);
    background: var(--white);
    z-index: 2;
}

    .reset-header img {
        width: 100%;
        max-width: 200px;
    }

    .reset-header a p {
        margin: 0;
    }

.back {
    display: flex;
    align-items: center;
    position: absolute;
    left: 1rem;
    color: var(--blue);
}

    .back span {
        margin-right: 1rem;
    }

.reset-password-container {
    background: var(--white);
    z-index: 2;
    width: 95%;
    height: fit-content;
    min-height: 350px;
    max-width: 350px;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    border-radius: 6px;
    border: 1px solid var(--gray);
    padding: 20px;
    overflow: hidden;
}

.check-email, .create-new-password, .invalid-token, .password-changed {
    display: flex;
    flex-direction: column;
    align-items: center;
}

    .check-email a {
        margin-top: 2rem;
    }

.logo {
    background: var(--blue-high-2);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    color: var(--blue-low);
    display: flex;
    align-items: center;
    justify-content: center;
}

.danger {
    background: var(--red-high);
    color: var(--red-low);
}

.button-success {
    background: var(--green-high-2);
    color: var(--green-low);
}

.enter-email {
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: all 0.4s;
}

.form-input {
    display: flex;
    flex-direction: column;
}

    .form-input input {
        margin: 10px 0;
        padding: 7px 15px;
        border-radius: 7px;
        border: 1px solid var(--gray);
    }

.footer {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    padding: .7rem 2rem;
    justify-content: space-between;
    background: var(--white);
    z-index: 3;
}

.footer-links {
    margin-left: 10px;
}

.copyright {
    margin-right: 10px;
}

.copyright, .footer-links {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

.copyright p {
    color: var(--gray-low);
    margin: 0;
}

.footer-links a {
    color: var(--blue);
    margin: 0 5px;
}

    .footer-links a:hover {
        text-decoration: underline;
    }

@media (max-width: 645px) {
    .footer-links {
        justify-content: flex-end;
    }

    .reset-header a p {
        display: none;
    }
}

@media (max-width: 336px) {
    .reset-header a {
        display: none;
    }
}
 
</style>