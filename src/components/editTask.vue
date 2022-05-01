<template>
    <section class="edit-task">
        <div class="loading-page" v-if="is_loading"></div>
        <div class="edit-task-container" v-if="!is_loading">
            <form class="form-os" @submit.prevent="saveTask()">
                <div class="informations-container">
                    <div class="so-number container-input">
                        <label for="so-number">Id tarefa: </label>
                        <input type="number" id="so-number" disabled placeholder="Automático" v-model="task[0].id">
                    </div>
                    <div class="sponsor container-input">
                        <label for="sponsor">Responsável: </label>
                        <select name="sponsor" id="sponsor" v-model="task[0].sponsor" required>
                            <option value="">-- Nome --</option>
                            <option value="1">Todos</option>
                            <option value="2">Qualquer</option>
                            <option v-for="user in group_members_objects" :key="user.id_usuario" :value="user.id_usuario">{{ user.nome }}</option>
                        </select>
                    </div>
                    <div class="priority-input container-input">
                        <label for="priority">Prioridade: </label>
                        <select name="priority" id="priority" v-model="task[0].priority" required>
                            <option value="">-- Prioridade --</option>
                            <option value="1">Normal</option>
                            <option value="2">Prioritário</option>
                        </select>
                    </div>
                    <div class="status container-input">
                        <label for="status">Status: </label>
                        <select name="status_os" id="status" v-model="task[0].status_os" required>
                            <option value="">-- Status --</option>
                            <option value="1">A fazer</option>
                            <option value="2">Fazendo</option>
                            <option value="3">Teste</option>
                            <option value="4">Concluído</option>
                        </select>
                    </div>
                    <div class="owner container-input">
                        <label for="owner">Aberto por: </label>
                        <select name="user_owner" id="owner" v-model="task[0].user_owner" required>
                            <option value="">-- Nome --</option>
                            <option v-for="user in group_members_objects" :key="user.id_usuario" :value="user.id_usuario">{{ user.nome }}</option>
                        </select>
                    </div>
                    <div class="os-size container-input">
                        <label for="size">Tamanho: </label>
                        <select name="size" id="size" v-model="task[0].size" required>
                            <option value="">-- Tamanho --</option>
                            <option value="P">P</option>
                            <option value="M">M</option>
                            <option value="G">G</option>
                        </select>
                    </div>
                </div>
                <div class="description">
                    <label for="description">Descrição: </label>
                    <textarea name="desc_os" id="description" cols="2000" rows="10" v-model="task[0].desc_os" required></textarea>
                </div>
                <div class="feedback-text">
                    <h6 class="characters-response">Número máximo de caracteres atingidos</h6>
                    <h6 class="count-characters"></h6>
                </div>
                <div class="response">{{ response }}</div>
                <div class="form-buttons">
                    <button type="submit" id="save-os">Salvar</button>
                    <button type="button" id="exclude-os" v-on:click="excludeTask()">Excluir</button>
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
            task: {},
            group_members_objects: {},
            response: ""
        }
    },
    methods: {
        checkCurrentTask: function () {
            let self = this, jwt = "Bearer " + self.getJwtFromLocalStorage();
            let current_project = self.getCurrentProjectInSessionStorage();
            api.post("/os/check_permission", {
                id: self.task[0].id,
                group_id: current_project.group_id
            }, {
                headers: {
                    Authorization: jwt
                }
            })
            .then(function(response){
                if (response.status == 401) {
                    self.$router.push("/not-allowed");
                }
            }).catch(function(error){
                console.log(error)
            })
        },
        sortElements: function (elementParent, elementChild) { // Função re-ordena os elementos da lista de países.
            let sortElements = $(elementParent + " " + elementChild);
            sortElements.sort((a, b) => {
                return ($(a).val() > $(b).val()) ? 1 : (($(b).val() > $(a).val()) ? -1 : 0);
            });
            $(elementParent).html(sortElements);
        },
        getProjectMembers: function () {
            let self = this;
            let current_project = self.getCurrentProjectInSessionStorage();
            api.post("/projects/return_group", {
                group_id: current_project.group_id
            })
            .then(function(response){
                self.group_members_objects = response.data.response.group_members_objects;
                self.sortElements("#sponsor", "option");
                self.sortElements("#owner", "option");
                self.is_loading = false;
            }).catch(function(){
                self.removeCurrentProjectInSessionStorage();
            })
        },
        getCurrentTask: function () {
            let self = this, id = self.$route.params.id;

            api.post("/os/find", {
                id_os: id
            })
            .then(function(response){
                if (response.data.response.current_task.length == 0) {
                    self.$router.push("/not-found");
                } else {
                    self.task = response.data.response.current_task;
                    self.getProjectMembers();
                    self.checkCurrentTask();
                }
            }).catch(function(error){
                self.response = error
            })
        },
        saveTask: function () {
            let self = this, jwt = "Bearer " + self.getJwtFromLocalStorage(), empty;
            let data = $(".form-os").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                obj[item.name] = item.value;
                return obj;
            }, {});

            for (let [key, value] of Object.entries(data)) { // Verifica se algum campo está vazio.
                if (key != null && value == "") {
                    empty = 1;
                }
            }
            data['id'] = self.task[0].id;
            if (empty != 1) {
                api.patch("/os", data, { // Requisição que atualiza a tarefa com os novos dados.
                    headers: {
                        Authorization: jwt
                    }
                })
                .then(function(){
                    self.$router.push("/home");
                }).catch(function(error){
                    console.log(error)
                })
            } else {
                self.response = "Não foi possível salvar a tarefa, campos vazios."
            }
        },
        excludeTask: function () {
            let self = this, jwt = "Bearer " + self.getJwtFromLocalStorage();
            api.delete("/os/delete_os", { data: {id_os: self.task[0].id}, headers: {Authorization: jwt}})
            .then(function(){
                self.$router.push("/home");
            }).catch(function(error){
                console.log(error)
            })
        }
    },
    mounted() {
        this.getCurrentTask();
        $("#description").focus();
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
            background: var(--red);
            color: var(--white);
        }

            .form-buttons button:nth-child(2):hover {
                background: var(--red-low);
            }

        .form-buttons button:nth-child(3) {
            background: var(--gray-high);
            color: var(--white);
        }

            .form-buttons button:nth-child(3):hover {
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