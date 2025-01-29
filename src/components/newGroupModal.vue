<template>
    <div class="new-group-container">
        <div class="new-project-modal">
            <div class="modal-header">
                <h1>Criar grupo</h1>
                <span class="material-icons" v-on:click="hideModal">close</span>
            </div>
            <div class="modal-body">
                <form id="form_create_group" @submit.prevent="createNewProject($event)" autocomplete="off">
                    <div class="form-group">
                        <label for="group_name">Nome do grupo</label>
                        <input type="text" id="group_name" placeholder="Nome" name="group_name" maxlength="50" title="Insira o nome do grupo" required>
                    </div>
                    <div class="form-group">
                        <label for="add_members">Adicionar membro</label>
                        <div class="add-users-container">
                            <div class="selected-user" :style="selected_user.id_usuario != undefined ? 'display: block;' : ''">
                                {{ selected_user.nome }}
                                <span class="material-icons" v-on:click="clearInvite()">clear</span>
                            </div>
                            <input type="text" id="add_members" placeholder="Email ou usuario" maxlength="50" title="Pesquise e adicione um membro para o grupo" v-on:focusout="validateEmailInput($event)" v-model="searchParam" v-on:keyup="fillSearchParam($event)">
                            <autoComplete :search-param="searchParam" v-if="searchParam != '' && !empty_search" @selectUser="selectUser($event)" @emptySearch="empty_search = true"></autoComplete>
                        </div>
                    </div>
                    <input type="submit" value="" style="display: none;" id="submit-form">
                </form>
                <div class="image-container">
                    <form enctype="multipart/form-data" @submit.prevent="uploadPhoto(formData)">
                        <img :src="groupImage" class="group-image">
                        <div class="image-buttons">
                            <label class="change-group-image" for="photo">Adicionar foto do grupo</label>
                            <input type="file" name="photo" id="photo" @change.prevent="preSendPhoto($event)" title="Envie uma foto nos formatos PNG ou JPG">
                        </div>
                        <input type="submit" value="" style="display: none;" id="submit-image-form">
                    </form>
                </div>
                <div class="loading"></div>
                <div class="response">{{ response }}</div>
            </div>
            <div class="modal-footer">
                <button class="create-button" v-on:click="submitForm()">Criar</button>
                <button class="cancelate-button" v-on:click="hideModal">Cancelar</button>
            </div>
        </div>
        <div class="overlay" v-if="showNewGroup" v-on:click="hideModal"></div>
    </div>
</template>
<script>
import $ from 'jquery';
import { globalMethods } from '../js/globalMethods';
import api from '../configs/api.js';
import autoComplete from './autoComplete.vue';

export default {
    name:  'newGroupModal',
    props: ['showNewGroup'],
    mixins: [globalMethods],
    data() {
        return {
            response: "",
            searchParam: "",
            selected_user: {},
            empty_search: false,
            group_default_image: api.defaults.baseURL + "/public/cademint-group.png",
            groupImage: "",
            created_group: {}
        }
    },
    watch: {
        searchParam: function () {
            if (this.searchParam == "") {
                this.empty_search = false;
            }
        }
    },
    methods: {
        fillSearchParam: function (event) {
            this.searchParam = event.target.value;
        },
        uploadPhoto: function (formData) {
            let self = this;
            self.response = "";

            api.patch("/projects/group_image/" + self.created_group.group_id, formData)
            .then(function () { 
                setTimeout(() => {
                    self.hideModal();
                    $(".loading").hide();
                    setTimeout(() => {
                        self.$router.go();
                    }, 400);
                }, 1000);
            })
            .catch(function (error) {
                $(".response").addClass("error");
                self.response = error.response;
            })
        },
        clearInvite: function () {
            let response = $(".response");
            let input = $("#add_members");
            this.selected_user = {};
            input.attr("placeholder", "Email ou usuario");
            input.val("");
            setTimeout(() => {
                if (response.hasClass("success")) {
                    response.removeClass("success");
                }
            }, 5 * 1000);
        },
        selectUser: function (event) {
            let input = $("#add_members");
            input.attr("placeholder", "");
            input.val("");
            input.removeClass("invalid-value");
            this.selected_user = event;
            this.searchParam = "";
        },
        validateEmailInput: function (event) {
            let target = $("#" + event.target.id);
            let emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

            if (this.selected_user.id_usuario != undefined || target.val() == "") {
                return;
            }

            if (!emailRegex.test(target.val())) {
                target.addClass("invalid-value");
            } else {
                target.removeClass("invalid-value");
            }
        },
        submitForm: function () {
            $("#submit-form").click();
        },
        createNewProject: function (event) {
            let self = this;
            let user_input = $("#" + event.srcElement[1].id);
            let name_input = $("#" + event.srcElement[0].id);
            let invited_user = self.selected_user;

            $(".loading").show();

            if (self.selected_user.id_usuario == undefined) {
                invited_user = {
                    email: user_input.val()
                }
            }
            
            let data = {
                group_name: name_input.val(),
                group_members: self.$root.user.id_usuario,
                group_owner: self.$root.user.id_usuario,
                id_usuario: self.$root.user.id_usuario,
                pending_users: invited_user.email
            }
            
            if (name_input.val().length <= 0) {
                name_input.addClass("invalid-value");
                self.response = "Nome de grupo inválido";
            } else {
                name_input.removeClass("invalid-value");

                api.post("/projects", data)
                .then(function(response){
                    self.created_group = {
                        group_id: response.data.returnObj.group_id,
                        group_name: response.data.returnObj.group_name
                    }

                    self.setCurrentProjectInLocalStorage(self.created_group.group_id);
                    
                    $(".response").addClass("success");
                    self.response = "Grupo criado com sucesso";

                    if ($("#photo").val() != "") {
                        $("#submit-image-form").click();
                    } else {
                        self.$router.go();
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
                .then(function () {
                    self.hideModal();
                })
            }
        },
        showModal: function () {
            let container = $(".new-project-modal"), overlay = $(".new-group-container .overlay");
            container.show();
            overlay.show();
            setTimeout(() => {
                container.css("opacity", 1).css("transform", "translateY(0)");
            }, 10);
        },
        hideModal: function () {
            let container = $(".new-project-modal"), overlay = $(".new-group-container  .overlay");
            container.css("transform", "translateY(-100px)").css("opacity", 0);
            setTimeout(() => {
                container.hide();
                overlay.hide();
                this.closeModal();
            }, 400);
        },
        closeModal: function () {
            this.$emit("showNewGroup");
        },
        preSendPhoto: function (event) {
            let file = event.target.files.item(0);
            let self = this;

            self.formData = new FormData;
            self.groupImage = self.group_default_image;
            self.response = "";

            if (file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png") { // Se o arquivo tiver um desses formatos (PNG, JPG E JPEG), a imagem é exibida no modal e é permitida a requisição para o servidor, se não aparece a mensagem (arquivo não suportado).
                let adress = new FileReader();

                self.formData.set("user_imagem", file);
                adress.readAsDataURL(file);
                adress.onloadend = () => {
                    self.groupImage = adress.result;
                };
            } else {
                self.groupImage = self.group_default_image;
                self.response = "Tipo de arquivo não suportado";
            }
        }
    },
    mounted() {
        this.showModal();
        this.groupImage = this.group_default_image;
        setTimeout(() => {
            $("#group_name").focus();
        }, 100);
    },
    components: {
        autoComplete
    }
}
</script>
<style scoped>
input[type='file'] {
    display: none;
}

.image-container form {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

.group-image {
    width: 130px;
    height: 130px;
    border-radius: 50%;
    box-shadow: 0 0 0 4px var(--blue);
    margin: 0 2rem 2rem 0;
    object-fit: cover;
}

.change-group-image {
    background: var(--blue);
    color: var(--white);
    border-radius: 6px;
    border: none;
    padding: 10px 15px;
    cursor: pointer;
    margin: 5px 0;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 1px;
    transition: all 0.4s;
}

    .change-group-image:hover {
        background: var(--blue-low);
    }

.invalid-value {
    border: 1px solid var(--red) !important;
}

.overlay, .response {
    display: block;
}

.new-project-modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 70%;
    max-width: 800px;
    max-height: 600px;
    height: fit-content;
    background: var(--white);
    border-radius: 10px;
    transition: all 0.4s;
    transform: translateY(-100px); 
    opacity: 0;
    z-index: 9999;
    overflow: hidden;
}

    .new-project-modal .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        border-bottom: 1px solid var(--gray-high);
    }

        .new-project-modal .modal-header h1 {
            font-size: 1.2rem;
            margin: 0;
        }

        .new-project-modal .modal-header .material-icons {
            font-size: 1.2rem;
            color: black!important;
            cursor: pointer;
            line-height: 1rem;
        }

.new-project-modal .modal-body {
    height: calc(100% - 123px);
    min-height: 450px;
    position: relative;
    padding: 15px;
    overflow-y: scroll;
}

    .new-project-modal .modal-body #form_create_group {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

        .new-project-modal .modal-body form input {
            width: 80%;
            border-radius: 6px;
            border: 1px solid var(--gray);
            padding: 7px 13px;
            margin: .5rem 0;
        }

.add-users-container {
    position: relative;
}

.add-users-container .selected-user {
    position: absolute;
    left: 5px;
    top: 12px;
    width: fit-content;
    height: fit-content;
    display: none;
    background: var(--gray-soft);
    padding: 3px 8px;
    border-radius: 6px;
}

    .add-users-container .selected-user span {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        opacity: 0;
        background: var(--white);
        cursor: pointer;
        backdrop-filter: blur(2px);
    }

        .add-users-container .selected-user span:hover {
            opacity: 0.7;
        }

.new-project-modal .modal-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 1rem;
    text-align: end;
    border-top: 1px solid var(--gray-high);
    background: var(--white);
}

    .new-project-modal .modal-footer button {
        border: none;
        padding: 5px 15px;
        margin: .5rem;
        border-radius: 5px;
        font-size: 1rem;
        cursor: pointer;
    }

    .new-project-modal .modal-footer .create-button {
        background: var(--blue);
        color: white;
    }

        .new-project-modal .modal-footer .create-button:hover {
            background: var(--blue-low);
        }

    .new-project-modal .modal-footer .cancelate-button {
        background: var(--gray);
        color: var(--white);
    }

        .new-project-modal .modal-footer .cancelate-button:hover {
            background: var(--gray-low);
        }

@media (max-width: 976px) {
    .new-project-modal {
        width: 75%;
        height: 65vh;
    }
}

@media (max-width: 600px) {
    .new-project-modal {
        width: 98%;
    }

        .new-project-modal .modal-footer button {
            font-size: .9rem;
        }

        .new-project-modal .modal-header h1, .new-project-modal .modal-header .material-icons {
            font-size: 1rem;
        }
}

@media (max-width: 437px) {
    .new-project-modal .modal-body {
        min-height: initial;
    }
}
</style>