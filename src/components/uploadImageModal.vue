<template>
    <div class="upload">
        <div class="send">
            <form class="send-photo" method="post" id="informations-form" enctype="multipart/form-data" @submit.prevent="uploadPhoto(formData)">
                <div class="input-file-custom">
                    <span>JPG, PNG</span>
                    <label for="photo" id="upload-button">
                        <span class="material-icons">cloud_upload</span>
                        Upload
                    </label>
                </div>
                <h6 class="file-name" v-if="previewPhoto != ''">{{ fileName }}</h6>
                <input type="file" name="photo" id="photo" accept="image/*" @change.prevent="preSendPhoto($event)" title="Envie uma foto nos formatos PNG ou JPG" style="display: none;">
                <button type="submit" id="submit-button" style="display: none;"></button>
            </form>
        </div>
        <div class="response">{{ response }}</div>
        <div class="photo-preview" v-if="previewPhoto != ''">
            <button v-if="previewPhoto != '' && showRemovePhotoButton" v-on:click="cancelPhoto('#photo')" class="remove-photo">
                <span class="material-icons">close</span>
            </button>
            <img class="image-preview" :src="previewPhoto" alt="Pré-visualização da foto">
            <div class="loading" v-if="loading"></div>
        </div>
    </div>
</template>
<script>
import { globalMethods } from '../js/globalMethods';
import api from '../configs/api.js';
import $ from 'jquery';

export default {
    name: "uploadImageModal",
    mixins: [globalMethods],
    props: ['group', "data_target"],
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

            if (this.previewPhoto == "") {
                $(".response").addClass("error");
                self.response = "Selecione uma imagem";
                $("#modal-submit-button").removeAttr("disabled").removeClass("btn-loading");
                return;
            }

            let path = '/users/';
            let target = "upload_photo";

            switch (this.data_target) {
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

            if (this.data_target == "banner") {
                self.removePhoto(true, true);
            }

            if (this.data_target != "group" && this.data_target != "banner") {
                self.removePhoto(true);
            }

            api.patch(path + target, formData)
            .then(function () { 
                self.previewPhoto = "";
                location.reload();
                self.$emit("savedContent");
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
#upload-button {
    height: 30px;
}

#upload-button {
    background: var(--blue);
    color: white;
    border-radius: 5px;
    padding: 6.5px 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
}

    #upload-button:hover {
        background: var(--blue-low);
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
    flex-direction: column;
    align-items: center;
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

.response {
    font-size: 1rem;
}

.photo-preview {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
    overflow: hidden;
    position: relative;
}

.image-preview {
    width: 100%;
    border: 1px solid var(--gray-high);
    border-radius: 10px;
    object-fit: contain;
    height: 312px;
}

.remove-photo {
    background: var(--red);
    color: var(--white);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    border: none;
    position: absolute;
    top: 1rem;
    right: 1rem;
    cursor: pointer;
    transition: all 0.4s;
    z-index: 2;
}

    .remove-photo:hover {
        background: var(--red-low);
    }

.loading {
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 1rem;
    margin: auto;
}

input[type='file'] {
    display: none;
}

@media (max-width: 550px) {
    #submit-button {
        height: 25px;
        font-size: .8rem;
        padding: 0 10px;
    }

    .input-file-custom, .file-name {
        font-size: .8rem;
    }
}

@media (max-width: 472px) {
    #submit-button {
        margin-top: 0.5rem;
    }
}
</style>