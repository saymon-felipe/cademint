<template>
    <section class="edit-task">
        <div class="loading-page" v-if="is_loading"></div>
        <div class="edit-task-container" v-if="!is_loading">
            <form class="form-os" @submit.prevent="checkCurrentProject()">
                <div class="informations-container">
                    <div class="so-number container-input">
                        <label for="so-number">Id tarefa: </label>
                        <input type="number" id="so-number" disabled placeholder="Automático">
                    </div>
                    <div class="sponsor container-input">
                        <label for="sponsor">Responsável: </label>
                        <select name="sponsor" id="sponsor" required>
                            <option value="">-- Nome --</option>
                            <option value="1">Todos</option>
                            <option value="2">Qualquer</option>
                            <option v-for="user in group_members_objects" :key="user.id_usuario" :value="user.id_usuario">{{ user.nome }}</option>
                        </select>
                    </div>
                    <div class="priority-input container-input">
                        <label for="priority">Prioridade: </label>
                        <select name="priority" id="priority" required>
                            <option value="">-- Prioridade --</option>
                            <option value="1">Normal</option>
                            <option value="2">Prioritário</option>
                        </select>
                    </div>
                    <div class="status container-input">
                        <label for="status">Status: </label>
                        <select name="status_os" id="status" v-model="previows_status" required>
                            <option value="">-- Status --</option>
                            <option value="1">A fazer</option>
                            <option value="2">Fazendo</option>
                            <option value="3">Teste</option>
                            <option value="4">Concluído</option>
                        </select>
                    </div>
                    <div class="owner container-input">
                        <label for="owner">Aberto por: </label>
                        <select name="user_owner" id="owner" required>
                            <option value="">-- Nome --</option>
                            <option v-for="user in group_members_objects" :key="user.id_usuario" :value="user.id_usuario">{{ user.nome }}</option>
                        </select>
                    </div>
                    <div class="os-size container-input">
                        <label for="size">Tamanho: </label>
                        <select name="size" id="size" required>
                            <option value="">-- Tamanho --</option>
                            <option value="P">P</option>
                            <option value="M">M</option>
                            <option value="G">G</option>
                        </select>
                    </div>
                </div>
                <div class="description">
                    <label for="description">Descrição: </label>
                    <textarea name="desc_os" id="description" cols="2000" rows="10" required></textarea>
                </div>
                <div class="feedback-text">
                    <h6 class="characters-response">Número máximo de caracteres atingidos</h6>
                    <h6 class="count-characters"></h6>
                </div>
                <div class="response">{{ response }}</div>
                <div class="form-buttons">
                    <button type="submit" id="save-os">Salvar</button>
                    <button type="button" id="cancel-operation" v-on:click="$router.push('/home')">Cancelar</button>
                </div>
            </form>
            
        </div>
    </section>
</template>
<script>
import $ from 'jquery';
import api from '../configs/api.js';
import {globalMethods} from '../js/globalMethods.js';

export default {
    name: 'editTask',
    mixins: [globalMethods],
    data() {
        return {
            is_loading: true,
            group_members_objects: {},
            response: "",
            previows_status: "",
            correct_project: null
        }
    },
    watch: {
        correct_project: function () {
            if (this.correct_project) {
                this.newTask();
            }
        }
    },
    methods: {
        sortElements: function (elementParent, elementChild) { // Função re-ordena os elementos da lista de países.
            let sortElements = $(elementParent + " " + elementChild);
            sortElements.sort((a, b) => {
                return ($(a).val() > $(b).val()) ? 1 : (($(b).val() > $(a).val()) ? -1 : 0);
            });
            $(elementParent).html(sortElements);
        },
        getProjectMembers: function () {
            let self = this;
            api.post("/projects/return_group", {
                group_id: self.getCurrentProjectIdInSessionStorage()
            })
            .then(function(response){
                self.group_members_objects = response.data.response.group_members_objects;
                self.sortElements("#sponsor", "option");
                self.sortElements("#owner", "option");
                self.is_loading = false;
            }).catch(function(){
                self.removeCurrentProjectIdInSessionStorage();
            })
        },
        newTask: function () {
            let self = this, jwt = "Bearer " + self.getJwtFromLocalStorage(), empty = 0;
            self.response = "";
            let data = $(".form-os").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                obj[item.name] = item.value;
                return obj;
            }, {});
            for (let [key, value] of Object.entries(data)) { // Verifica se algum campo está vazio.
                if (key != null && value == "") {
                    empty = 1;
                }
            }
            if (empty != 1) {
                data["group_id"] = self.getCurrentProjectIdInSessionStorage();
                
                api.post("/os", data, { // Requisição cria nova tarefa com os dados do formulário.
                    headers: {
                        Authorization: jwt
                    }
                })
                .then(function(response){
                    self.fillIdComplete(response.data.os_criada.id_os);
                }).catch(function(error){
                    console.log(error)
                })
            } else {
                self.response = "Não foi possível salvar a tarefa, campos vazios."
            }
        },
        fillIdComplete: function (id_raw) { // Função cria o ID completo conforme o ID da OS retornada do banco e faz UPDATE da respectiva linha na tabela.
            let self = this, jwt = "Bearer " + self.getJwtFromLocalStorage();

            api.patch("/os/id_complete", {
                id_complete: self.generateNumberOs(id_raw),
                id_raw: id_raw
            }, {
                headers: {
                    Authorization: jwt
                }
            })
            .then(function(){
                self.$router.push("/home");
            }).catch(function(error){
                console.log(error)
            })
        },
        generateNumberOs: function (number) { // Função para gerar número completo da OS com base no ano e no mês atual, além do próprio id da OS em banco.
            let date = new Date(), year = date.getFullYear().toString().slice(-2), month = date.getMonth() + 1, numberOs = "";

            if (number > 99) {
                let numberDivision = Math.round(number / 100);
                let finalNumber = number - (numberDivision + "00");

                if (finalNumber < 10) {
                    finalNumber = "0" + finalNumber;
                }

                month += numberDivision;
                numberOs = finalNumber;
            } else {
                numberOs = number;
            }
            if (month > 99) {
                let numberDivision = Math.round(month / 100);
                let finalNumber = month - (numberDivision + "0");

                year += numberDivision;
                numberOs = finalNumber;
            }
            if (month < 10) {
                month = "0" + month;
            }
            if (number < 10) {
                numberOs = `0${number}`;
            } 

            return parseInt(`${year}${month}${numberOs}`);
        },
        fillCurrentStatus: function () {
            let self = this;
            switch (self.$route.params.status) {
                case "todo":
                    self.previows_status = 1;
                    break;
                case "doing":
                    self.previows_status = 2;
                    break;
            }
        },
        checkCurrentProject: function () {
            let self = this, project_id = self.getCurrentProjectIdInSessionStorage(), jwt = "Bearer " + self.getJwtFromLocalStorage();
            self.correct_project = false;
            "return_user_by_jwt"
            api.get("/usuarios/return_user_by_jwt", {
                headers: {
                    Authorization: jwt
                }
            })
            .then(function(response){
                if (response.data.response.user_groups.indexOf(project_id) == -1) {
                    self.$router.push("/not-allowed");
                    self.correct_project = false;
                }
                self.correct_project = true;
            }).catch(function(error){
                console.log(error)
            })
        }
    },
    mounted() {
        this.getProjectMembers();
        this.fillCurrentStatus();
        setTimeout(() => {
            $("#description").focus();
        }, 700);
    }
}
</script>
<style scoped>
    * {
        font-size: 1.1rem;
    }

    .edit-task {
        position: absolute;
        top: 66px;
        left: 0;
        right: 0;
        min-height: 100vh;
        width: 95vw;
        max-width: 2000px;
        overflow-y: scroll;
        height: 100%;
        margin: auto;
        padding: 1rem 1rem 5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    @media (max-width: 400px) {
        .edit-task {
            justify-content: flex-start;
        }
    }

    .form-os {
        width: 100%;
    }

    .informations-container {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: space-around;
        width: 100%;
    }

    .container-input {
        margin: .5rem .7rem;
        font-weight: 600;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }

        .container-input label {
        margin-right: .5rem;
    }

    .description {
        margin-top: 2rem;
        font-weight: 600;
    }

        .description label {
            margin-right: .5rem;
        }

        .description textarea {
            width: 100%!important;
            resize: none;
            padding: .5rem;
            border-radius: 5px;
        }

    .feedback-text {
        position: relative;
        padding-left: 5.1rem;
    }

    .characters-response {
        position: absolute;
        left: 5.1rem;
        display: none;
        color: var(--red);
    }

    .count-characters {
        position: absolute;
        right: 0;
        text-align: end;
    }

    input {
        padding-left: .5rem;
    }

    input, select {
        background: rgb(248, 248, 248);
        border: 1px solid gray;
        border-radius: 5px;
        padding: 3px;
        cursor: pointer;
        width: 150px;
    }

    #so-number {
        cursor: text;
    }

    .form-buttons {
        margin-top: 1rem;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
    }

        .form-buttons button {
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            margin: .2rem .5rem;
            cursor: pointer;
            transition: all 0.4s;
        }

        .form-buttons button:nth-child(1) {
            background: var(--blue);
            color: var(--white);
        }

            .form-buttons button:nth-child(1):hover {
                background: var(--blue-low);
            }

        .form-buttons button:nth-child(2) {
            background: var(--gray-high);
            color: var(--white);
        }

            .form-buttons button:nth-child(2):hover {
                background: var(--gray-low);
            }

    @media (max-width: 527px) {
        .informations-container {
            justify-content: center;
        }
    }

    @media (max-width: 390px) {
        .container-input {
            width: 100%;
        }
            .container-input input, .container-input select {
                width: 100%!important;
                height: 2rem;
            }

        .description {
            flex-direction: column;
            justify-content: center;
        }
        .description label {
            margin: 0!important;
            text-align: center;
        }
    }
</style>