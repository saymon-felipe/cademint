<template>
    <div class="new-group-container">
        <div class="new-project-modal">
            <div class="modal-header">
                <h1>Novo projeto</h1>
                <span class="material-icons" v-on:click="hideModal">close</span>
            </div>
            <div class="modal-body">
                <form action="create_group" id="form_create_group">
                    <input type="text" id="group_name" placeholder="Nome do projeto" maxlength="50" title="Insira o nome do grupo" v-on:keyup="showCreateButton($event)">
                    <!-- <input type="email" placeholder="Adicionar membros (email)" title="Adicione membros informando seu email e separando por vírgula"> -->
                </form>
                <div class="response">{{ response }}</div>
            </div>
            <div class="modal-footer">
                <button class="create-button" v-if="showSubmitButton" v-on:click="createNewProject('#group_name')">Criar</button>
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

export default {
    name:  'newGroupModal',
    props: ['showNewGroup', 'user'],
    mixins: [globalMethods],
    data() {
        return {
            showSubmitButton: false,
            response: ""
        }
    },
    methods: {
        createNewProject: function (input_id) {
            let self = this, jwt = "Bearer " + self.getJwtFromLocalStorage(), input = $(input_id), inputVal = input.val();
            let data = {
                group_name: inputVal,
                group_members: self.user.id_usuario,
                group_owner: self.user.id_usuario,
                id_usuario: self.user.id_usuario
            }
            if (inputVal.length <= 0) {
                input.addClass("invalid-value");
                self.response = "Nome de grupo inválido";
            } else {
                input.removeClass("invalid-value");
                api.post("/projects", data, {
                    headers: {
                        Authorization: jwt
                    }
                })
                .then(function(response){
                    self.setCurrentProjectIdInSessionStorage(response.data.response.grupo_criado.groups_id);
                    $(".response").addClass("success");
                    self.response = "Grupo criado com sucesso";
                    setTimeout(() => {
                        self.hideModal();
                        setTimeout(() => {
                            location.reload();
                        }, 2100);
                    }, 2000);
                })
            }
        },
        showCreateButton: function (event) {
            let input = $("#" + event.target.id), inputVal = input.val();
            if (inputVal.length > 0) {
                this.showSubmitButton = true;
            } else {
                this.showSubmitButton = false;
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
        }
    },
    mounted() {
        this.showModal();
        setTimeout(() => {
            $("#group_name").focus();
        }, 100);
    }
}
</script>
<style scoped>
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
    height: 60vh;
    background: var(--white);
    border-radius: 1rem;
    transition: all 0.4s;
    transform: translateY(-100px); 
    opacity: 0;
    z-index: 5;
}

    .new-project-modal .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem;
        border-bottom: 1px solid var(--gray-high-2);
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
    position: relative;
    padding: .5rem 1rem;
}

    .new-project-modal .modal-body .response {
        margin-top: -3rem;
    }

    .new-project-modal .modal-body form {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

        .new-project-modal .modal-body form input {
            width: 80%;
            border-radius: 10px;
            border: 1px solid var(--gray-high);
            padding: .7rem;
            min-height: 2.5rem;
            margin: .5rem 0;
        }

.new-project-modal .modal-footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 1rem;
    text-align: end;
    border-top: 1px solid var(--gray-high-2);
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
        background: var(--gray-high);
        color: white;
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

    .modal-body {
        padding: .4rem!important;
    }
}

</style>