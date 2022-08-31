<template>
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
</template>
<script>
import { globalMethods } from '../js/globalMethods';
import api from '../configs/api.js';
import $ from 'jquery';

export default {
    name: "uploadImageModal",
    mixins: [globalMethods],
    props: ['group'],
    data() {
        return {
            loading: false,
            showRemovePhotoButton: true,
            previewPhoto: "",
            response: "",
            fileName: "",
            formData: null
        }
    },
    methods: {
        uploadPhoto: function (formData) {
            let self = this;

            let jwt = "Bearer " + self.getJwtFromLocalStorage();
            let dataTarget = $(".upload").attr("data_target");
            let path = '/usuarios/';
            let target = "upload_photo";

            switch (dataTarget) {
                case 'banner':
                    target = "upload_banner";
                    break;
                case 'group':
                    target = "group_image/" + this.group.group_id;
                    path = "/projects/";
                    break;
            }

            self.response = "";
            self.loading = true;
            self.showRemovePhotoButton = false;

            if (dataTarget == "banner") {
                self.removePhoto(true, true);
            }

            if (dataTarget == "group") {
                self.removePhoto(true, false, true, this.group.group_id);
            }

            if (dataTarget != "group" && dataTarget != "banner") {
                self.removePhoto(true);
            }

            api.patch(path + target, formData, { 
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
                self.response = error.response;
            })
            .then(function () {
                self.loading = false;
            })
        },
        hideSendPhoto: function () {
            let modal = $(".upload");
            modal.css("opacity", 0).css("transform", "translateY(-100px)");
            setTimeout(() => {
                modal.hide();
                this.showSendPhotoContainer = false;
            }, 400);
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
        cancelPhoto: function (id) {
            $(id).val("");
            this.previewPhoto = "";
        }
    }
}
</script>
<style scoped>
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
    z-index: 9999;
    transition: all 0.4s;
    transform: translateY(-100px);
    opacity: 0;
    display: none;
    padding: 1.5rem;
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

.input-file-custom {
    margin: 0 1rem;
    display: block !important;
}

    .input-file-custom > span {
        display: block;
        margin-top: .7rem;
        text-align: center;
    }

.file-name {
    margin: 0 1rem;
    height: 34px;
    align-items: center;
    max-width: 15ch;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: flex;
    align-items: center;
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

.response {
    font-size: 1rem;
}

.photo-preview {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
    height: calc(100% - 185px);
    overflow: hidden;
}

.image-preview {
    width: 100%;
    border: 1px solid var(--gray-high);
    border-radius: 10px;
    object-fit: cover;
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

.loading {
    display: block;
}

input[type='file'] {
    display: none;
}

@media (max-width: 1128px) {
    .upload {
        width: 90vw;
        height: 70vw;
    }
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
</style>