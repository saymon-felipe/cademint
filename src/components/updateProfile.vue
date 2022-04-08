<template>
    <section class="update-profile-container">
        <div class="update-profile">
            <div class="update-profile-header">
                <h1>Alterar o perfil</h1>
                <div class="profile-more-options">
                    <span class="material-icons" v-on:click="showProfileMoreOptions = !showProfileMoreOptions">more_vert</span>
                    <div class="account-options-container">
                        <div class="account-options">
                            <ul>
                                <li v-on:click="showExcludeAccountModal">Excluir conta</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="informations-container">
                <div class="user-image">
                    <div class="user-image-container">
                        <img :src="user.profile_photo" class="profile-avatar">
                        <div class="change-photo" v-on:click="togglePhotoDetails()" :style="showPhotoDetails ? 'background: var(--gray-high-2)' : ''">
                            <span class="material-icons">photo_camera</span>
                            <div class="photo-details" v-if="showPhotoDetails">
                                <ul>
                                    <li v-if="user.profile_photo != default_user_image" v-on:click="showPhoto">Ver foto</li>
                                    <li v-on:click="removePhoto()" v-if="user.profile_photo != default_user_image">Excluir foto</li>
                                    <li v-on:click="showSendPhoto">Enviar foto</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="delete-user-confirmation-modal">
                    <h4>Tem certeza que deseja excluir a sua conta?</h4>
                    <div class="exclude-account-buttons">
                        <button id="exclude-account-confirmation-button" v-on:click="excludeAccount">Sim, excluir</button>
                        <button id="skip-exclude-confirmation" v-on:click="hideExcludeAccountModal">Não, cancelar</button>
                    </div>
                    <div class="exclude-account-warning" v-if="!isDeleting">
                        <h6><span><strong>ATENÇÃO</strong></span>, essa ação é <span><strong>irreversível</strong></span>!</h6>
                        <p>
                            Ao excluir sua conta, todas as suas informações pessoais são apagadas. <br>
                            Qualquer dúvida entre em contato pelo nosso email: 
                            <a href="mailto:contato.scrumcademint@gmail.com">contato.scrumcademint@gmail.com</a>
                        </p>
                    </div>
                    <div class="deleting-message" v-if="isDeleting">
                        <h6>Apagando usuário...</h6>
                        <div class="loading"></div>
                    </div>
                </div>

                <div class="modal-expanded-photo">
                    <img :src="user.profile_photo" :alt="'Foto de ' + user.nome">
                </div>


                <div class="overlay" v-on:click="hidePhoto(); hideSendPhoto(); hideExcludeAccountModal();" v-if="showExpandedPhoto || showSendPhotoContainer || showExcludeAccount"></div>
                <div class="upload">
                    <div class="send">
                        <form class="send-photo" method="post" enctype="multipart/form-data" @submit.prevent="uploadPhoto(formData)">
                            <div class="input-file-custom">
                                <label for="photo" id="upload-button">
                                    <span class="material-icons">cloud_upload</span>
                                    Upload
                                </label>
                                <span>JPG, PNG</span>
                            </div>
                            <h6 class="file-name" v-if="previewPhoto != ''">{{ fileName }}</h6>
                            <input type="file" name="photo" id="photo" @change.prevent="preSendPhoto($event)" title="Envie uma foto nos formatos PNG ou JPG">
                            <button type="submit" id="send-photo-button" class="save-button" v-if="previewPhoto != ''">Enviar foto</button>
                        </form>
                    </div>
                    <div class="response">{{ response }}</div>
                    <div class="photo-preview" v-if="previewPhoto != ''">
                        <img class="image-preview" :src="previewPhoto" alt="Pré-visualização da foto">
                    </div>
                    <button v-if="previewPhoto != '' && showRemovePhotoButton" v-on:click="cancelPhoto('#photo')" class="remove-photo">Remover foto</button>
                    <div class="loading" v-if="loading"></div>
                </div>

                <div class="profile-form-container">
                    <form @submit.prevent="updateProfile" id="profile-form">
                        <label for="name-input">Nome</label>
                        <input type="text" name="nome" id="name-input" v-model="user.nome" v-on:keyup="showSubmit = true">
                        <button type="submit" v-if="showSubmit">Alterar perfil</button>
                    </form>
                    <div class="response">{{ response }}</div>
                </div>
            </div>
            <div class="update-profile-footer">
                <div class="my-groups-list">
                    <h1>Meus grupos</h1>
                    <div class="user-groups-list">
                        <div class="group" v-for="(group, index) in my_groups" :key="index">
                            <img :src="group_image">
                            <h4>{{ group.group_name }}</h4>
                        </div>
                    </div>
                </div>
                <div class="other-groups-list">
                    <h1>Grupos que participo</h1>
                    <div class="user-groups-list">
                        <div class="group" v-for="(group, index) in groups_i_participate" :key="index">
                            <img :src="group_image">
                            <h4>{{ group.group_name }}</h4>
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </section>
</template>
<script>
import { globalMethods } from '../js/globalMethods';
import api from '../configs/api.js';
import $ from 'jquery';

export default {
    name: "updateProfile",
    mixins: [globalMethods],
    data() {
        return {
            user: {},
            group_image: api.defaults.baseURL + "/public/cademint-group.png",
            default_user_image: api.defaults.baseURL + "/public/default-user-image.png",
            showSubmit: false,
            response: "",
            showPhotoDetails: false,
            showExpandedPhoto: false,
            showSendPhotoContainer: false,
            previewPhoto: "",
            fileName: "",
            formData: null,
            loading: false,
            showRemovePhotoButton: true,
            my_groups: {},
            groups_i_participate: {},
            showProfileMoreOptions: false,
            showExcludeAccount: false,
            isDeleting: false
        }
    },
    watch: {
        user: function () {
            this.my_groups = this.getMyGroups();
            this.groups_i_participate = this.getGroupsIParticipate();
        },
        showProfileMoreOptions: function () {
            let self = this;
            if (self.showProfileMoreOptions) {
                $(".account-options").show();
                setTimeout(() => {
                    $(".account-options").css("opacity", 1);
                }, 10);
            } else {
                $(".account-options").css("opacity", 0);
                setTimeout(() => {
                    $(".account-options").hide();
                }, 400);
            }
        }
    },
    methods: {
        getMyGroups: function () {
            let self = this, groups = self.user.user_groups, my_groups = [];
            for (let i = 0; i < groups.length; i++) {
                if (groups[i].group_owner == self.user.id_usuario) {
                    my_groups.push(groups[i]);
                }
            }
            return my_groups;
        },
        getGroupsIParticipate: function () {
            let self = this, groups = self.user.user_groups, groups_i_participate = [];
            for (let i = 0; i < groups.length; i++) {
                if (groups[i].group_owner != self.user.id_usuario) {
                    groups_i_participate.push(groups[i]);
                }
            }
            return groups_i_participate;
        },
        cancelPhoto: function (id) {
            $(id).val("");
            this.previewPhoto = "";
        },
        preSendPhoto: function (event) {
            let filePath = $("#photo").val(); // Busca o nome o nome do arquivo e o exibe.
            let fileSplited = filePath.split('\\');
            let fileName = fileSplited[fileSplited.length - 1];
            let file = event.target.files.item(0);
            let self = this;

            self.formData = new FormData;
            self.previewPhoto = "";
            self.response = "";
            self.fileName = fileName;

            if (file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png") { // Se o arquivo tiver um desses formatos (PNG, JPG E JPEG), a imagem é exibida no modal e é permitida a requisição para o servidor, se não aparece a mensagem (arquivo não suportado).
                let adress = new FileReader();

                self.formData.set("user_imagem", file);
                adress.readAsDataURL(file);
                adress.onloadend = () => {
                    self.previewPhoto = adress.result;
                };
            } else {
                self.previewPhoto = "";
                self.response = "Tipo de arquivo não suportado";
            }
        },
        uploadPhoto: function (formData) {
            let self = this, jwt = "Bearer " + self.getJwtFromLocalStorage();

            self.response = "";
            self.loading = true;
            self.showRemovePhotoButton = false;
            self.removePhoto(true);

            api.patch("/usuarios/upload_photo", formData, { 
                headers: {
                    Authorization: jwt
                }
            })
            .then(function () { 
                self.hideSendPhoto();
                self.previewPhoto = "";
                location.reload();
            })
            .catch(function (error) {
                self.loading = false;
                $(".response").addClass("error");
                self.response = error.response.data.error;
            })
            .then(function () {
                self.loading = false;
            })
        },
        removePhoto: function (from_upload = false) {
            let self = this, jwt = "Bearer " + self.getJwtFromLocalStorage();

            api.patch("/usuarios/exclude_photo", "", {
                headers: {
                        Authorization: jwt
                    }
            })
            .then(function(response){
                if (!from_upload) {
                    location.reload();
                    self.response = response.data.response.action;
                }
            })
        },
        showSendPhoto: function () {
            let modal = $(".upload");
            modal.show();
            this.showSendPhotoContainer = true;
            setTimeout(() => {
                modal.css("opacity", 1).css("transform", "translateY(0)");
            }, 10);
        },
        hideSendPhoto: function () {
            let modal = $(".upload");
            modal.css("opacity", 0).css("transform", "translateY(-100px)");
            setTimeout(() => {
                modal.hide();
                this.showSendPhotoContainer = false;
            }, 400);
        },
        showPhoto: function () {
            let modal = $(".modal-expanded-photo");
            modal.show();
            this.showExpandedPhoto = true;
            setTimeout(() => {
                modal.css("opacity", 1).css("transform", "translateY(0)");
            }, 10);
        },
        hidePhoto: function () {
            let modal = $(".modal-expanded-photo");
            modal.css("opacity", 0).css("transform", "translateY(-100px)");
            setTimeout(() => {
                modal.hide();
                this.showExpandedPhoto = false;
            }, 400);
        },
        hideExcludeAccountModal: function () {
            let container = $(".delete-user-confirmation-modal"), self = this;

            container.css("opacity", 0).css("transform", "translateY(-100px)");
            setTimeout(() => {
                container.hide();
                self.showExcludeAccount = false;
            }, 400);
        },
        showExcludeAccountModal: function () {
            let container = $(".delete-user-confirmation-modal"), self = this;

            container.show();
            setTimeout(() => {
                container.css("opacity", 1).css("transform", "translateY(0)");
                self.showExcludeAccount = true;
            }, 10);
        },
        excludeAccount: function () {
            let self = this, jwt = "Bearer " + self.getJwtFromLocalStorage();
            self.isDeleting = true;

            api.post("/usuarios/exclude_user", "", {
                headers: {
                    Authorization: jwt
                }
            })
            .then(function () { 
                self.logoutUser(true);
                self.$router.push("/login");
            })
            .catch(function () {
                $(".response").addClass("error");
                self.response = "Ocorreu um erro";
            })
        },
        togglePhotoDetails: function () {
            let self = this;
            self.showPhotoDetails = !self.showPhotoDetails;
        },
        updateProfile: function () {
            let self = this, empty = 0, data = $("#profile-form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                obj[item.name] = item.value;
                return obj;
            }, {});

            if (data["nome"] == self.user.nome) {
                self.showSubmit = false;
                return;
            }

            $(".response").removeClass("error");
            $(".response").removeClass("success");
            self.response = "";

            for (let [key, value] of Object.entries(data)) { // Verifica se algum campo está vazio.
                if (key != null && value == "") {
                    empty = 1;
                }
            }
            if (empty == 1) {
                $(".response").addClass("error");
                self.response = "Campos inválidos";
            }
            let jwt = "Bearer " + self.getJwtFromLocalStorage();
            api.post("/usuarios/update_name", data, {
                headers: {
                    Authorization: jwt
                }
            })
            .then(function (response) { 
                $(".response").addClass("success");
                self.response = response.data.response.message;
                location.reload();
            })
            .catch(function () {
                $(".response").addClass("error");
                self.response = "Ocorreu um erro";
            })
        }
    },
    mounted() {
        this.requireUser();
    }
}
</script>
<style scoped>
.delete-user-confirmation-modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    max-width: 800px;
    max-height: 500px;
    width: 90vw;
    height: 40vh;
    background: var(--white);
    box-shadow: 0 0 5px rgba(0,0,0,0.3);
    border-radius: 10px;
    padding: 1rem;
    transition: all 0.4s;
    transform: translateY(-100px);
    opacity: 0;
    display: none;
    z-index: 999;
    text-align: center;
}

    .delete-user-confirmation-modal h4 {
        font-size: 1.7rem;
        margin: 1rem 0;
    }

.exclude-account-buttons {
    margin: .7rem 0 2rem;
}

    .exclude-account-buttons button {
        font-size: 1.3rem;
        padding: 10px 15px;
        border-radius: 10px;
        border: none;
        cursor: pointer;
        margin: 5px;
        transition: all 0.4s;
    }

    .exclude-account-buttons button:nth-child(1):hover {
        background: var(--gray-high-2);
    }

    .exclude-account-buttons button:nth-child(2) {
        background: var(--blue);
        color: var(--white);
    }

        .exclude-account-buttons button:nth-child(2):hover {
            background: var(--blue-low);
        }

    .exclude-account-warning span {
        text-transform: uppercase;
        color: var(--red);
    }

    .exclude-account-warning a {
        color: var(--blue);
    }

        .exclude-account-warning a:hover {
            text-decoration: underline;
        }

.deleting-message h6 {
    font-size: 1.3rem;
}

.overlay, .loading {
    display: block;
}

.update-profile-container {
   width: 100%;
   height: calc(100vh - 66px); 
   position: absolute;
   bottom: 0;
   display: flex;
   justify-content: center;
}

.modal-expanded-photo {
    background: white;
    border-radius: 10px;
    width: 80vw;
    height: 80vh;
    max-height: 800px;
    max-width: 800px;
    min-height: 200px;
    min-width: 200px;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
    padding: 25px;
    position: fixed;
    display: none;
    transition: all 0.4s;
    transform: translateY(-100px);
    opacity: 0;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    z-index: 999;
}

    .modal-expanded-photo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

.update-profile {
    background: white;
    border-radius: 10px;
    width: 60vw;
    height: 80vh;
    max-height: 800px;
    max-width: 1000px;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
    padding: 25px;
    margin: 2rem 0;
    position: relative;
}

@media (max-width: 1040px) {
    .update-profile {
        width: 70vw;
    }
}

@media (max-width: 720px) {
    .update-profile {
        width: 90%;
        padding: 1rem 2rem;
        margin-top: 15vh;
    }
    .modal-expanded-photo {
        width: 95vw;
        padding: .5rem;
        height: 70vh;
    }
}

.profile-more-options {
    position: absolute;
    right: 10px;
    top: 10px;
    padding: 7px;
    cursor: pointer;
}

    .profile-more-options .material-icons {
        font-size: 2rem;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        transition: all 0.4s;
        display: flex;
        align-items: center;
        justify-content: center;
    }

        .profile-more-options .material-icons:hover {
            background: var(--gray-high-2);
        }

.account-options-container {
    position: relative;
}

.account-options {
    opacity: 0;
    display: none;
    position: absolute;
    top: -32px;
    right: 50px;
    background: var(--white);
    box-shadow: 0 0 5px rgba(0,0,0,0.3);
    padding: .5rem;
    min-width: 150px;
    border-radius: 10px;
    transition: all 0.4s;
    z-index: 3;
}

    .account-options ul {
        list-style: none;
        text-align: center;
    }

    .account-options li {
        padding: .5rem;
    }

        .account-options li:hover {
            background: var(--gray-high-2);
        }

.update-profile-header h1 {
    font-size: 1.8rem;
}

.profile-avatar {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    box-shadow: 0 0 0 7px var(--blue);
}

.informations-container {
    margin-top: 3rem;
    display: grid;
    grid-template-columns: 50% 50%;
}

.informations-container div:nth-child(1) {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 1rem;
}

.update-profile-footer {
    display: grid;
    grid-template-columns: 50% 50%;
    height: 250px;
    overflow: hidden;
    margin-top: 2rem;
}

.update-profile-footer .other-groups-list, .update-profile-footer .my-groups-list {
    display: flex;
    flex-direction: column;
    align-items: center;
}

@media (max-width: 792px) {
    .update-profile-footer {
        display: block;
        height: auto;
    }
    .my-groups-list {
        margin-bottom: 2rem;
    }
    .update-profile {
        height: auto;
    }
    .user-groups-list {
        max-height: 150px;
    }
}

@media (max-width: 580px) {
    .profile-avatar {
        width: 150px;
        height: 150px;
    }

    .informations-container {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
    }

    .profile-form-container {
        flex-direction: column !important;
        align-items: center;
        width: 80%;
        margin: auto;
    }

        .profile-form-container form {
            margin-top: 1rem;
        }

    .profile-more-options .material-icons {
        font-size: 1.3rem;
    }

    .update-profile-header h1, .update-profile-footer h1 {
        font-size: 1.4rem;
    }

    .profile-form-container form input, .profile-form-container form button {
        height: 35px !important;
        font-size: 1rem !important;
    }

    .update-profile-footer {
        margin-top: 1rem !important;
    }

    .group {
        margin: .7rem 0;
    }

    .update-profile {
        height: 720px;
    }

    .update-profile-container {
        overflow-y: scroll;
    }
}

.response {
    font-size: 1rem;
}

.profile-form-container label {
    font-size: 1.2rem;
    font-weight: 600;
}

.profile-form-container form {
    display: flex;
    flex-direction: column;
}

.profile-form-container form input, .profile-form-container form button {
    width: 100%;
    margin: .5rem 0;
    height: 40px;
    border-radius: 10px;
    border: none;
    font-size: 1.2rem;
}

.profile-form-container form input {
    border: 1px solid var(--gray-high);
    padding: 8px;
}

.profile-form-container form button {
    background: var(--blue);
    color: var(--white);
    cursor: pointer;
    transition: all 0.4s;
}

    .profile-form-container form button:hover {
        background: var(--blue-low);
    }

.other-groups-list, .my-groups-list {
    height: 100%;
    overflow-y: scroll;
}

.user-groups-list {
    margin-top: 1rem;
    padding-left: 1rem;
    overflow-y: scroll;
    width: 100%;
}

.group {
    margin: 1rem 0;
    display: flex;
    align-items: center;
}

    .group img {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        box-shadow: 0 0 0 4px var(--blue);
        margin-right: 2rem;
    }

.user-image-container {
    position: relative;
}

.photo-details {
    background: var(--white);
    border-radius: 10px;
    padding: .4rem;
    box-shadow: 0 0 15px rgba(0,0,0,0.3);
    position: absolute;
    bottom: 0;
    right: -120px;
}

@media (max-width: 470px) {
    .photo-details {
        bottom: -120px;
        right: 0;
        width: 300%;
    }
}

    .photo-details ul {
        list-style: none;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

        .photo-details ul li {
            padding: .5rem;
            width: 100%;
            text-align: center;
        }

            .photo-details ul li:hover {
                background: var(--gray-high-2);
            }

.change-photo {
    background: var(--white);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: absolute;
    box-shadow: 0 0 15px rgba(0,0,0,0.3);
    bottom: 0;
    right: 0;
}

    .change-photo:hover {
        background: var(--gray-high-2);
    }

.upload {
    background: white;
    border-radius: 20px;
    margin: auto;
    width: 100vw;
    height: 80vh;
    max-width: 50rem;
    max-height: 50rem;
    min-width: 200px;
    min-height: 500px;
    box-shadow: 0 0 10px rgba(0,0,0,0.3);
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 6;
    transition: all 0.4s;
    transform: translateY(-100px);
    opacity: 0;
    display: none;
    padding: 1.5rem;
}

@media (max-width: 1128px) {
    .upload {
        width: 90vw;
        height: 70vw;
    }
}

@media (max-width: 472px) {
    #send-photo-button {
        margin-top: 0.5rem;
    }
}

@media (max-width: 458px) {
    .upload {
        width: 90vw;
        min-height: 450px;
    }
}

.send {
    display: flex;
    justify-content: center;
}

.send-photo {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: center;
}

.remove-photo {
    background: var(--red);
    color: var(--white);
    padding: 6px 15px;
    border-radius: 10px;
    border: none;
    position: absolute;
    bottom: 2rem;
    left: 0;
    right: 0;
    margin: auto;
    width: 7rem;
    cursor: pointer;
    transition: all 0.4s;
}

    .remove-photo:hover {
        background: var(--red-low);
    }

.input-file-custom {
    margin: 0 1rem;
    display: block !important;
}

    .input-file-custom > span {
        display: block;
        margin-top: .7rem;
        text-align: center;
    }

@media (max-width: 550px) {
    #send-photo-button {
        height: 25px;
        font-size: .8rem;
        padding: 0 10px;
    }

    .input-file-custom, .file-name {
        font-size: .8rem;
    }
}

.save-button, #upload-button {
    height: 30px;
}

#upload-button {
    background: #00A2E8;
    color: white;
    border-radius: 5px;
    padding: 6.5px 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
}

    #upload-button:hover {
        background: #0090ce;
    }

    #upload-button > span {
        margin-right: 10px;
    }

.file-name {
    margin: 0 1rem .5rem;
    height: 34px;
    align-items: center;
    max-width: 15ch;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    align-items: center;
}

.photo-preview {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
    height: calc(100% - 130px);
    overflow: hidden;
}

.image-preview {
    width: 100%;
    border: 1px solid var(--gray-high);
    border-radius: 10px;
}

.save-button {
    padding: 5px 15px;
    margin-top: -6px;
    text-align: center;
    background: #56b335;
    color: white;
    text-transform: uppercase;
    font-weight: 500;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

    .save-button:hover {
        background: #4d9e2f;
    }

.update-profile input[type='file'] {
    display: none;
}
</style>