<template>
    <div class="page-content">
        <div class="group-header">
            <p class="font-size-3-bold">{{ havePermission ? 'Editar grupo (' + group.nome + ')' : 'Ver grupo (' + group.nome + ')' }}</p>
            <div class="delete-group" v-on:click="excludeGroupModal(group.group_id)" v-if="$root.user.user_groups.length > 1 && group.group_owner == $root.user.id_usuario && havePermission">
                <span class="material-icons">delete</span>
                <p class="font-size-4">Excluir grupo</p>
            </div>
            <div class="leave-group" v-on:click="leaveGroupModal(group.group_id)" v-if="$root.user.user_groups.length > 1 && group.group_owner != $root.user.id_usuario">
                <span class="material-icons">delete</span>
                <p class="font-size-4">Sair do grupo</p>
            </div>
            <excludeGroupModal :group="group" :exclude="exclude_group" v-if="exclude_group && $root.user.user_groups.length > 1 && havePermission" @closeModal="exclude_group = false"></excludeGroupModal>
            <leaveGroupModal :group="group" :exclude="leave_group" v-if="leave_group && $root.user.user_groups.length > 1" @closeModal="leave_group = false"></leaveGroupModal>
        </div>
        
        <div class="group-informations">
            <div class="image-container">
                <div class="group-image background-image" :style="`background-image: url('${group.image}')`"></div>
                <div class="image-buttons" v-if="havePermission">
                    <button type="button" class="change-group-image" v-on:click="editGroupImage()">Editar foto do grupo</button>
                    <button type="button" class="exclude-group-image" v-if="group.image != group_default_image" v-on:click="removePhoto(false, false, true, group.group_id)">Excluir foto</button>
                </div>
            </div>
            <div class="group-inputs">
                <div class="group-input">
                    <label class="font-size-5" for="group-name">Nome do grupo</label>
                    <input type="text" id="group-name" v-model="group.nome" maxlength="50" v-on:focusout="changeGroupName(group.group_id, $event)">
                </div>
                <div class="group-input">
                    <label class="font-size-5" for="group_description">Descrição</label>
                    <textarea name="group_description" id="group_description" cols="30" rows="10" v-model="group_description" v-on:keyup="countCharacters()" v-on:focusout="changeGroupDescription(group.group_id, $event)" maxlength="500"></textarea>
                    <p class="font-size-5 description_counter">0 / 500</p>
                </div>
                <div class="invite-users" v-if="havePermission">
                    <p class="font-size-3-bold">Convidar pessoas</p>
                    <div class="invite-users-container">
                        <form autocomplete="off">
                            <input type="text" name="invite_users" id="invite_users" placeholder="Email ou usuario" v-on:focusout="validateEmailInput($event)" v-model="searchParam" v-on:keyup="fillSearchParam($event)">
                        </form>
                        <div class="selected-user" :style="selected_user.id_usuario != undefined ? 'display: block;' : ''">
                            {{ selected_user.nome }}
                            <span class="material-icons" v-on:click="clearInvite()">clear</span>
                        </div>
                        <button type="button" id="send-user" v-on:click="inviteUser('#invite_users', selected_user.email, group_name)">Enviar</button>
                        <autoComplete :search-param="searchParam" v-if="searchParam != '' && !empty_search" @selectUser="selectUser($event)" @emptySearch="empty_search = true"></autoComplete>
                    </div>
                    <p class="font-size-4 response">{{ inviteResponse }}</p>
                </div>
                <div class="group-users">
                    <p class="font-size-3-bold">Membros</p>
                    <div class="user" v-for="user in group_users" :key="user.id_usuario">
                        <div class="user-container" v-if="user.id_usuario != 1 && user.id_usuario != 2">
                            <div class="principal">
                                <div class="avatar-p background-image" :style="`background-image: url('${user.profile_photo}')`"></div>
                                <span class="font-size-3">{{ user.nome }}</span>
                            </div>
                            <span class="admin" v-if="user.id_usuario == group.group_owner">Admin</span>
                            <span class="material-icons exclude-user" v-if="user.id_usuario != group.group_owner && havePermission" v-on:click="excludeUser(group.group_id, user.id_usuario)">clear</span>
                        </div>
                    </div>
                    <div v-for="(member, index) in group.pending_users" :key="member.id_usuario" class="user" :id="'invited-member-' + index">
                        <div class="user-container" v-if="member != ''">
                            <div class="principal">
                                <img :src="default_user_image" class="avatar-p" :alt="'Imagem de ' + member">
                                <span class="font-size-3">{{ member.pending_user_email }}</span>
                            </div>
                            <span class="material-icons hourglass-icon">hourglass_top</span>
                            <span class="material-icons delete-invitation" v-on:click="excludeInvitation(group.group_id, member.pending_user_email, index)" v-if="havePermission">clear</span>
                        </div>
                    </div>
                </div>
                <p class="font-size-4 response">{{ response }}</p>
            </div>
        </div>

        <modal v-if="showModal" :modaltitle="modalTitle" :modalbutton1="modalButton1" :modalbutton2="modalButton2" @closeModal="closeModalFunction(); hideGroupImage();">
            <uploadModal :group="group" :data_target="data_target" v-if="showSendPhotoContainer" @savedContent="closeModalFunction(); hideGroupImage();"></uploadModal>
        </modal>
    </div>
</template>
<script>
import { globalMethods } from '../js/globalMethods';
import $ from 'jquery';
import api from '../configs/api.js';
import uploadModal from './uploadImageModal.vue';
import autoComplete from './autoComplete.vue';
import excludeGroupModal from './excludeGroupModal.vue';
import leaveGroupModal from './leaveGroupModal.vue';
import modal from "./modal.vue";

export default {
    name: "editGroups",
    mixins: [globalMethods],
    data() {
        return {
            data_target: "group",
            user: {
                user_groups: []
            },
            group: {},
            group_users: [],
            response: "",
            inviteResponse: "",
            group_description: "",
            group_name: "",
            showSendPhotoContainer: false,
            searchParam: "",
            selected_user: {},
            exclude_group: false,
            leave_group: false,
            empty_search: false,
            havePermission: false
        }
    },
    watch: {
        group: function () {
            this.group_users = this.group.group_members;
            this.group_description = this.group.group_description;
            this.group_name = this.group.nome;
            setTimeout(() => {
                this.initiateHourglassAnimation();
                this.countCharacters();
            }, 10);
        },
        response: function () {
            setTimeout(() => {
                this.response = "";
            }, 5 * 1000);
        },
        inviteResponse: function () {
            setTimeout(() => {
                this.inviteResponse = "";
            }, 5 * 1000);
        },
        searchParam: function () {
            if (this.searchParam == "") {
                this.empty_search = false;
            }
        }
    },
    mounted: function () {
        this.checkPermission();
    },
    methods: {
        fillSearchParam: function (event) {
            this.searchParam = event.target.value;
        },
        excludeInvitation: function (group_id, email, index) {
            let data = {
                group_id: group_id,
                email: email.trim()
            }
            api.post("/projects/remove_invitation", data)
            .then(function () {
                $("#invited-member-" + index).remove();
            })
        },
        initiateHourglassAnimation: function (stop = false) {
            let icon = $(".hourglass-icon");
            let self = this;
            if (!stop) {
                self.interval = setInterval(() => {
                    if (icon.html() == "hourglass_top") {
                        icon.html("hourglass_bottom");
                    } else {
                        icon.html("hourglass_top");
                    }
                }, 1000);
            } else {
                clearInterval(self.interval);
            }
        },
        leaveGroupModal: function () {
            let self = this;
            self.leave_group = true;
        },
        excludeGroupModal: function () {
            let self = this;
            self.exclude_group = true;
        },
        blockFields: function () {
            $("#group-name").attr("disabled", "disabled");
            $("#group_description").attr("disabled", "disabled");
        },
        checkPermission: function () {
            let self = this;
            let idParam = this.$route.params.id;
            let data = {
                group_id: idParam
            }
            api.post("/projects/check_permission", data)
            .then(function () {
                self.havePermission = true;
            })
            .catch(function () {
                self.blockFields();
            })
            .then(function () {
                self.requireGroup(idParam).then((results) => {
                    self.group = results;
                }).catch(() => {
                    self.$router.push("/home/update-profile");
                })
            })
        },
        clearInvite: function () {
            let response = $(".response");
            let input = $("#invite_users");

            this.selected_user = {};
            input.attr("placeholder", "Email ou usuario");
            input.val("");
            setTimeout(() => {
                if (response.hasClass("success")) {
                    response.removeClass("success");
                }
            }, 5 * 1000);
        },
        validateEmailInput: function (event) {
            let target = $("#" + event.target.id);
            let emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;

            if (this.selected_user.id_usuario != undefined) {
                return;
            }

            if (!emailRegex.test(target.val())) {
                target.addClass("invalid-value");
            } else {
                target.removeClass("invalid-value");
            }
        },
        inviteUser: function (input_id, user_email = "", group_name) { // Função envia email de solicitação para o endereço informado, e ao final da requisição esconde o input.
            let self = this;
            let input = $(input_id);
            let idParam = self.$route.params.id;

            if (user_email == "") {
                user_email = input.val();
            }

            if (user_email == "" && input.val().trim().length == 0) {
                self.inviteResponse = "Campo vazio";
                return;
            }

            if (input.hasClass("invalid-value")) {
                self.inviteResponse = "Email inválido";
                return;
            }

            if (user_email == self.$root.user.email) {
                self.inviteResponse = "Você não pode entrar em um grupo que já faz parte.";
                input.val("");
                self.clearInvite();
                return;
            }
            
            self.inviteResponse = "";
            let data = {
                user_email: user_email,
                group_name: group_name,
                group_id: self.group.group_id
            }

            $(".send-user").attr("disabled", "disabled");
            api.post("/projects/request_user_to_group", data)
            .then(function(response){
                $(".response").addClass("success");
                self.inviteResponse = response.data.message;
                self.initiateHourglassAnimation(true);
                self.requireGroup(idParam).then((results) => {
                    self.group = results;
                })
                self.clearInvite();
                setTimeout(() => {
                    self.inviteResponse = "";
                }, 5 * 1000);
            }).catch(function (error){
                self.inviteResponse = error.response.data.message;
                self.clearInvite();
            })
        },
        selectUser: function (event) {
            let input = $("#invite_users");
            input.attr("placeholder", "");
            input.val("");
            input.removeClass("invalid-value");
            this.selected_user = event;
            this.searchParam = "";
        },
        editGroupImage: function () {
            this.showModalFunction("Alterar foto", "Salvar", "Cancelar");
            this.showSendPhotoContainer = true;
        },
        hideGroupImage: function () {
            this.showSendPhotoContainer = false;
        },
        countCharacters: function () {
            let counter = $(".description_counter");
            let value = $("#group_description").val();
            counter.html(value.length + " / 500");
        },
        excludeUser: function (project_id, id_usuario) { // Exclui o usuário do grupo.
                let self = this;
                api.post("/projects/exclude_user", {
                    group_id: project_id,
                    user_id: id_usuario
                })
                .then(function(){
                    self.group_users = self.group_users.filter(user => {return user.id_usuario != id_usuario});
                    self.response = "Usuario excluido!";
                })
        },
        changeGroupName: function (group_id, event) {
            let value = event.target.value;
            let self = this;
            
            if (value == "" || value.length < 3) {
                self.group_name = self.group.nome;
                setTimeout(() => {
                    self.countCharacters();
                }, 10);
                return;
            }

            let data = {
                group_id: group_id,
                group_name: value,
                group_description: self.group.group_description
            }

            api.patch('/projects/edit_group', data)
            .then(function () {
                self.group_name = value;
                self.requireUser(true);
            })
            .catch(function (error) {
                console.log(error)
            })
        },
        changeGroupDescription: function (group_id, event) {
            let value = event.target.value;
            let self = this;
            
            if (value == "" || value.length < 3) {
                self.group_description = self.group.group_description;
                setTimeout(() => {
                    self.countCharacters();
                }, 10);
                return;
            }

            let data = {
                group_id: group_id,
                group_name: self.group.nome,
                group_description: value
            }

            api.patch('/projects/edit_group', data)
            .then(function () {
                self.group_description = value;
                self.requireUser(true);
            })
            .catch(function (error) {
                console.log(error)
            })
        }
    },
    components: {
        uploadModal,
        autoComplete,
        excludeGroupModal,
        leaveGroupModal,
        modal
    }
}
</script>
<style scoped>
    .delete-invitation {
        cursor: pointer;
        color: var(--red);
        transition: all 0.4s;
    }

        .delete-invitation:hover {
            color: var(--red-low);
        }

    .response {
        text-transform: inherit;
        text-align: left;
        margin-top: 0;
    }

    .overlay {
        display: block;
    }

    .group-informations {
        margin: 2rem 0 1rem;
    }

        .group-informations .group-image {
            width: 130px;
            height: 130px;
            border-radius: 50%;
            box-shadow: 0 0 0 4px var(--blue);
            margin-right: 2rem;
            object-fit: cover;
        }

    .group-inputs {
        margin: 1.5rem 0;
    }

    .group-input {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        margin: .7rem 0;
    }

        .group-input:nth-child(2) {
            margin-top: 20px;
        }

        .group-input label {
            color: var(--gray-low);
        }

        .group-input input, .group-input textarea {
            color: var(--black);
            margin-top: 10px;
            border-radius: 6px;
            padding: 7px 13px;
            border: 1px solid var(--gray-low);
            width: 100%;
            max-width: 400px;
        }

        .group-input textarea {
            height: 150px;
            resize: none;
        }

    .user {
        margin: 15px 0;
    }
    
    .user-container {
        width: 100%;
        max-width: 200px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .principal {
        display: flex;
        align-items: center;
    }

        .principal span {
            margin-left: .7rem;
        }

    .group-users {
        margin: 2rem 0;
    }

    .admin {
        background: var(--red);
        color: var(--white);
        padding: 2px 7px;
        border-radius: 10px;
    }

    .exclude-user {
        color: var(--red);
        cursor: pointer;
    }

    .exclude-user {
        color: var(--red);
    }

    .invite-users-container {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        position: relative;
    }

    .invite-users-container form {
        width: 100%;
        max-width: 400px;
        margin-right: 10px;
    }

    @media (max-width: 520px) {
        .invite-users-container form {
            margin-right: 0;
        }
    }

        .invite-users-container button {
            margin: .5rem 0;
        }

        .invite-users p {
            margin-bottom: 1rem;
        }

        .invite-users input {
            border-radius: 6px;
            border: 1px solid var(--gray-low);
            padding: 7px 10px;
            width: 100%;
            margin: 8px 0;
        }

        .invite-users .selected-user {
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

            .invite-users .selected-user span {
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

                .invite-users .selected-user span:hover {
                    opacity: 0.7;
                }

        .invite-users button {
            border-radius: 4px;
            background: var(--blue);
            color: var(--white);
            border: none;
            cursor: pointer;
            padding: 8px 20px;
            margin-right: 10px;
            transition: all 0.4s;
        }

            .invite-users button:hover {
                background: var(--blue-low);
            }

    .image-container {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
    }

        .image-container .image-buttons {
            margin: 1rem 0;
            display: flex;
            flex-direction: column;
        }

    .change-group-image, .exclude-group-image {
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

    .change-group-image {
        background: var(--blue);
        color: var(--white);
    }

        .change-group-image:hover {
            background: var(--blue-low);
        }

    .exclude-group-image:hover {
        background: var(--gray-soft);
    }

.group-header, .delete-group, .leave-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.group-header p:first-child {
    margin-right: 10px;
}

.delete-group, .leave-group {
    border-radius: 7px;
    padding: 10px;
    background: var(--red-high);
    transition: all 0.4s;
    cursor: pointer;
    color: var(--red-low);
}

    .delete-group:hover, .leave-group:hover {
        background: var(--red);
        color: var(--white);
    }

    .delete-group span, .leave-group span {
        margin-right: 10px;
    }

@media (max-width: 480px) {
    .invite-users .selected-user {
        padding-right: 30px;
    }
    
    .invite-users .selected-user span {
        opacity: 0.8 !important;
    }
}
</style>