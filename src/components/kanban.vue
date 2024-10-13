<template>
    <section class="kanban">
        <div class="loading-page" v-if="is_loading"></div>
        <joinedGroupModal :joined_group="joined_group" v-if="joined_group" @joined_group="joined_group = false" />
        <div class="kanban-container" v-if="!is_loading">
            <div class="project-header">
                <div class="project-informations">
                    <h3 class="project-name font-size-h3">{{ current_project.group_name }}</h3>
                    <div class="project-status" v-on:click="toggleProjectStatus()">
                        <span>Status do projeto</span>

                        <div class="project-status-container">
                            <div class="status-item on-track" v-on:click="changeProjectStatus(0)">
                                <span>No caminho</span>
                            </div>
                            <div class="status-item at-risk" v-on:click="changeProjectStatus(1)">
                                <span>Em risco</span>
                            </div>
                            <div class="status-item off-track" v-on:click="changeProjectStatus(2)">
                                <span>Suspenso</span>
                            </div>
                            <div class="status-item on-hold" v-on:click="changeProjectStatus(3)">
                                <span>Em espera</span>
                            </div>
                        </div>
                        <!-- 0 No caminho, 1 Em risco, 2 Suspenso, 3 Em espera -->
                    </div>
                    <div class="project-status-wrapper" v-on:click="toggleProjectStatus()"></div>
                </div>
                
                <div class="project-settings">
                    <div>
                        <span class="material-icons history-sprint-button" v-on:click="viewHistoricSprints()">history</span>
                    </div>
                    <div>
                        <span class="material-icons sprint-button" v-on:click="configureProjectSprint()">timeline</span>
                    </div>
                </div>
            </div>
            <div class="kanban-columns">
                <div class="kanban-column" id="column-1">
                    <div class="kanban-column-header">
                        <p class="font-size-5">A fazer</p>
                        <span class="material-icons new-task-icon" v-on:click="createTask(1)">add</span>
                        
                    </div>
                    <div class="kanban-column-body">
                        <Container group-name="kanban" class="task-list" @drag-end="handleDragEnd()" @drag-start="handleDragStart('todo', $event)" @drop="handleDrop('todo', $event)" :get-child-payload="getChildPayload">
                            <newTaskCard :group_users="project.group_members" card_status="1" :user="$root.user" @closeTask="closeNewTask($event)" class="new-card" />
                            <Draggable v-for="task in todoList" :key="task.id_os" class="draggable-card">
                                <card :task="task" />
                                <div class="edit-task-wrapper-container" v-on:click="editTask(task)"></div>
                            </Draggable>
                        </Container>
                    </div>
                </div>
                <div class="kanban-column" id="column-2">
                    <div class="kanban-column-header">
                        <p class="font-size-5">Fazendo</p>
                        <span class="material-icons new-task-icon" v-on:click="createTask(2)">add</span>
                    </div>
                    <div class="kanban-column-body">
                        <Container group-name="kanban" class="task-list" @drag-end="handleDragEnd()" @drag-start="handleDragStart('doing', $event)" @drop="handleDrop('doing', $event)" :get-child-payload="getChildPayload">
                            <newTaskCard :group_users="project.group_members" card_status="2" :user="$root.user" @closeTask="closeNewTask($event)" class="new-card" />
                            <Draggable v-for="task in doingList" :key="task.id_os" class="draggable-card">
                                <card :task="task" />
                                <div class="edit-task-wrapper-container" v-on:click="editTask(task)"></div>
                            </Draggable>
                        </Container>
                    </div>
                </div>
                <div class="kanban-column" id="column-3">
                    <div class="kanban-column-header">
                        <p class="font-size-5">Teste</p>
                    </div>
                    <div class="kanban-column-body">
                        <Container group-name="kanban" class="task-list" @drag-end="handleDragEnd()" @drag-start="handleDragStart('test', $event)" @drop="handleDrop('test', $event)" :get-child-payload="getChildPayload">
                            <newTaskCard :group_users="project.group_members" card_status="3" :user="$root.user" @closeTask="closeNewTask($event)" class="new-card" />
                            <Draggable v-for="task in testList" :key="task.id_os" class="draggable-card">
                                <card :task="task" />
                                <div class="edit-task-wrapper-container" v-on:click="editTask(task)"></div>
                            </Draggable>
                        </Container>
                    </div>
                </div>
                <div class="kanban-column" id="column-4">
                    <div class="kanban-column-header">
                        <p class="font-size-5">Concluído</p>
                    </div>
                    <div class="kanban-column-body">
                        <Container group-name="kanban" class="task-list" @drag-end="handleDragEnd()" @drag-start="handleDragStart('done', $event)" @drop="handleDrop('done', $event)" :get-child-payload="getChildPayload">
                            <newTaskCard :group_users="project.group_members" card_status="4" :user="$root.user" @closeTask="closeNewTask($event)" class="new-card" />
                            <Draggable v-for="task in doneList" :key="task.id_os" class="draggable-card">
                                <card :task="task" />
                                <div class="edit-task-wrapper-container" v-on:click="editTask(task)"></div>
                            </Draggable>
                        </Container>
                    </div>
                </div>
            </div>
            <editTaskModal class="edit-task-container" v-if="show_edit_task" :task="edit_task" :group="project" @closeEditTaskModal="closeEditTask('.edit-task-container', $event)" />
            <div class="edit-task-wrapper" v-if="show_edit_task" v-on:click="closeEditTask('.edit-task-container', true)"></div>
            <modalComponent :modalname="modalName" v-if="showModal" @modalClosed="showModal = false" :saved="saved">
                <sprintModalContent @saved="saved = true" v-if="newSprint"></sprintModalContent>
                <historySprintModalContent @saved="saved = true" v-if="historySprint"></historySprintModalContent>
            </modalComponent>
        </div>
    </section>
</template>

<script>
import {globalMethods} from '../js/globalMethods.js';
import api from '../configs/api.js';
import $ from 'jquery';
import {Container, Draggable} from 'vue-smooth-dnd';
import card from './card.vue';
import joinedGroupModal from './joinedGroupModal.vue';
import newTaskCard from "./newTaskCard.vue";
import editTaskModal from './editTaskModal.vue';
import modalComponent from "./modalComponent.vue";
import sprintModalContent from './sprintModalContent.vue';
import historySprintModalContent from './historySprintModalContent.vue';

export default {
    name: "kanban",
    props: ['change_project'],
    mixins: [globalMethods],
    data() {
        return {
            saved: false,
            in_drag: false,
            task_list: {},
            is_loading: true,
            newSprint: false,
            historySprint: false,
            draggind_card: {
                status: '',
                col: '',
                index: -1,
                cardData: {}
            },
            joined_group: false,
            current_project: null,
            project: {},
            edit_task: {},
            show_edit_task: false,
            temporary_task: {},
            checkAllowDrag: false,
            modalName: "",
            showModal: false
        }
    },
    computed: {
        todoList() {
            return this.task_list.filter(task => task.status_os == 1);
        },
        doingList() {
            return this.task_list.filter(task => task.status_os == 2);
        },
        testList() {
            return this.task_list.filter(task => task.status_os == 3);
        },
        doneList() {
            return this.task_list.filter(task => task.status_os == 4);
        }
    },
    watch: {
        checkAllowDrag: function () {
            this.verifyAllowDrop();
        },
        is_loading: function () {
            setTimeout(() => {
                this.checkAllowDrag = true;
            }, 100);
        }
    },
    methods: {
        resetModalContentVariables: function () {
            this.newSprint = false;
            this.historySprint = false;
        },
        configureProjectSprint: function () {
            this.resetModalContentVariables();

            this.newSprint = true;
            this.showModalFunction();
            this.setModalVariables("Configurar sprint");
        },
        viewHistoricSprints: function () {
            this.resetModalContentVariables();

            this.historySprint = true;
            this.showModalFunction();
            this.setModalVariables("Sprints anteriores");
        },
        changeProjectStatus: function (projectStatus) {
            console.log(projectStatus);
        },
        toggleProjectStatus: function () {
            let wrapper = $(".project-status-wrapper");
            let projectStatusContainer = $(".project-status-container");
            if (projectStatusContainer.is(":visible")) {
                projectStatusContainer.hide();
                wrapper.hide();
                
            } else {
                projectStatusContainer.show();
                wrapper.show();
            }
        },
        editTask: function (task) {
            if ($(".edit-task-container").is(":visible")) {
                this.closeEditTask(".edit-task-container", true);
                return;
            }
            this.edit_task = task;
            this.show_edit_task = true;
            setTimeout(() => {
                this.openEditTask($(".edit-task-container"));
            }, 10);
        },
        openEditTask: function (element) {
            element.css("opacity", 1).css("transform", "translateX(0)");
        },
        closeEditTask: function (class_name, reload_tasks = false) {
            $(class_name).css("opacity", 0).css("transform", "translateX(100px)");
            if (reload_tasks) {
                this.getAllOs(true);
            }
            
            setTimeout(() => {
                this.show_edit_task = false;
                this.edit_task = {};
            }, 400);
        },  
        init: function () {
            setTimeout(() => {
                this.current_project = this.getCurrentProjectInLocalStorage();
                this.getCurrentProject(this.current_project.group_id);
                this.getAllOs();
                let url = new URLSearchParams(window.location.search);
                this.joined_group = url.get("joined_group") != null ? url.get("joined_group") : false;
            }, 300);
        },
        verifyAllowDrop: function () {
            if (window.innerWidth > 720) {
                return true;
            }
            $(".draggable-card").removeClass("smooth-dnd-draggable-wrapper");
            return false;
        },
        handleDragStart: function (col, dragResult) {
            if (!this.verifyAllowDrop()) {
                return;
            }
            const {payload, isSource} = dragResult;
            let status, data, self = this;
            sessionStorage.setItem("in_drag", "true");
            switch (col) {
                case 'todo':
                    status = 1;
                    data = self.todoList;
                    break;
                case 'doing':
                    status = 2;
                    data = self.doingList;
                    break;
                case 'test':
                    status = 3;
                    data = self.testList;
                    break;
                case 'done':
                    status = 4;
                    data = self.doneList;
                    break;
            }
            if (isSource) {
                this.draggind_card = {
                    status,
                    col,
                    index: payload.index - 1,
                    cardData: {
                        ...data[payload.index - 1]
                    }
                }
            }
        },
        handleDragEnd: function () {
            sessionStorage.setItem("in_drag", "false");
        },
        handleDrop: function (col, dropResult) {
            const {removedIndex, addedIndex} = dropResult;
            let self = this, status;
            if (col === this.draggind_card.col || removedIndex === addedIndex) {
                return;
            }

            switch (col) {
                case 'todo':
                    status = 1;
                    break;
                case 'doing':
                    status = 2;
                    break;
                case 'test':
                    status = 3;
                    break;
                case 'done':
                    status = 4;
                    break;
            }

            self.task_list = self.task_list.filter(function(id) { return id !== self.draggind_card.cardData.id; });

            if (addedIndex != null) {
                self.draggind_card.cardData.status_os = status;
                $("#" + self.draggind_card.cardData.id).remove();
                self.task_list.push(self.draggind_card.cardData)
                api.patch("/task/os_status", {
                    id: self.draggind_card.cardData.id,
                    status_os: status
                })
            }
        },
        getChildPayload: function (index) {
            return {
                index,
            }
        },
        getAllOs: function (programatic = false) { // Função recupera a lista de tarefas do banco de dados.
            let self = this;

            if (self.current_project == null) {
                setTimeout(() => {
                    self.getAllOs(true);
                }, 1000);
                return;
            }

            if (!self.in_drag) {
                api.post("/task/return_os_list", {
                    id: self.current_project.group_id
                })
                .then(function(response){
                    self.task_list = response.data.returnObj.os_list;
                    self.is_loading = false;
                    if (!programatic) { // Só vai ter chamada recursiva se a chamada não for feita por outra função
                        setTimeout(self.getAllOs, 60000); // Chamada recursiva da requisição a cada 60 segundos.
                    }
                }).catch(function(){
                    let pathName = window.location.href;
                    if (pathName.indexOf("/login") == -1 && pathName.indexOf("/register") == -1 && pathName.indexOf("/enter-group") == -1) {
                        if (!programatic) { // Só vai ter chamada recursiva se a chamada não for feita por outra função
                            setTimeout(self.getAllOs, 5000);
                        }
                    }
                })
            }
        },
        checkIfProjectChanged: function () {
            let jwt = this.getJwtFromLocalStorage();
            let project = this.getCurrentProjectInLocalStorage();
            
            if (jwt == "" || jwt == undefined || jwt == null) {
                return;
            }

            if (project.group_id != this.project.group_id) {
                this.current_project.group_id = project.group_id;
                this.current_project.group_name = project.group_name;
                this.show_edit_task = false;
                this.getCurrentProject(project.group_id, true);
                this.getAllOs(true);
            }

            setTimeout(() => {
                this.checkIfProjectChanged();
            }, 1000);
        },
        getCurrentProject: function (project_id, programatic = false) {
            let self = this;
            api.post("/projects/return_group", {
                group_id: project_id
            })
            .then(function(response){
                self.project = response.data.returnObj;
                if (!programatic) {
                    self.checkIfProjectChanged();
                }
            }).catch(function(error){
                self.response = error
            })
        },
        createTask: function (column_status) {
            let newTaskCard = $("#column-" + column_status + " .new-card"); 
            let column = $("#column-" + column_status + " .kanban-column-body"); 
            column.animate({
                scrollTop: 0
            }, 500);

            newTaskCard.show();
            setTimeout(() => {
                newTaskCard.css("opacity", 1);
                setTimeout(() => {
                    $("#column-" + column_status + " #task-description").focus();
                }, 400);
            }, 10);                   
        },
        closeNewTask: function (emmit_event) {
            let newTaskCard = $(".new-card"); 
            newTaskCard.css("opacity", 0);
            setTimeout(() => {
                newTaskCard.hide();
                if (emmit_event != undefined) {
                    emmit_event.user_owner_name = this.$root.user.nome;
                    this.editTask(emmit_event);
                }
            }, 400);
        }
    },
    mounted() {
        setTimeout(() => {
            if (window.location.href.indexOf("/home") != -1) {
                this.init();
                if (this.current_project == null) {
                    return;
                }
            }
        }, 10);
    },
    components: {
        Draggable,
        card,
        Container,
        joinedGroupModal,
        newTaskCard,
        editTaskModal,
        modalComponent,
        sprintModalContent,
        historySprintModalContent
    }
}
</script>

<style scoped>

/* HEADER */

.project-header {
    width: 100%;
    padding: 1rem 2rem;
    border-bottom: 1px solid var(--gray-high);
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.project-settings {
    display: flex;
}

    .project-settings span {
        cursor: pointer;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        margin: 0 5px;
    }

        .project-settings span:hover {
            background: var(--gray-high);
        }

.project-informations {
    display: flex;
    align-items: center;
}

.project-status {
    border: 1px solid var(--gray-high);
    margin: 0 1rem;
    padding: 5px 10px 5px 30px;
    border-radius: 10px;
    cursor: pointer;
    position: relative;
}

    .project-status:hover {
        background: var(--gray-high);
    }

    .project-status.on-track::before, .status-item.on-track::before {
        background: var(--green-high);
        border: 1px solid var(--green-high);
    }

    .project-status.at-risk::before, .status-item.at-risk::before {
        background: var(--yellow);
        border: 1px solid var(--yellow);
    }

    .project-status.off-track::before, .status-item.off-track::before {
        background: var(--red);
        border: 1px solid var(--red);
    }

    .project-status.on-hold::before, .status-item.on-hold::before {
        background: var(--blue);
        border: 1px solid var(--blue);
    }

    .project-status::before, .status-item::before {
        content: '';
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 1px solid var(--gray);
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
        left: 10px;
    }

    .project-status-container {
        position: absolute;
        left: 0;
        top: 120%;
        background: var(--white);
        border: 1px solid var(--gray-high);
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        padding: .7rem;
        display: none;
        z-index: 11;
    }

    .project-status-wrapper {
        position: fixed;
        width: 100vw;
        height: 100vh;
        left: 0;
        top: 0;
        z-index: 10;
        cursor: default;
        display: none;
    }

    .status-item {
        padding: 7px 7px 7px 32px;
        cursor: pointer;
        position: relative;
    }

        .status-item:hover {
            background: var(--gray-high);
        }

/* HEADER */

.edit-task-container {
    transition: all 0.4s;
    transform: translateX(100px);
    opacity: 0;
}

.edit-task-wrapper {
    background: var(--black);
    opacity: 0.3;
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 3;
}

.new-card {
    display: none;
    opacity: 0;
    transition: all 0.4s;
}

.kanban {
    height: 100vh;
    overflow: hidden;
    width: 100vw;
    padding-top: 56px;
}

.smooth-dnd-container {
    height: 100%;
}

.kanban-container {
    height: calc(100% - 92px);
    width: 100%;
}

.kanban-columns {
    width: 100%;
    min-width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    padding: 0.5rem 2rem;
    overflow: hidden;
    overflow-x: auto;
}

.kanban-column {
    min-width: 330px;
    max-width: 330px;
    width: 330px;
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 .8rem;
}

.kanban-column:first-child {
    margin-left: 0;
}


.kanban-column-header {
    width: 100%;
    max-width: calc(100vw - 25px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 31px;
    margin-bottom: 10px;
}

    .kanban-column-header p {
        text-transform: uppercase;
        color: var(--gray-low);
    }

.kanban-column-body {
    background: var(--gray-high);
    min-height: 94%;
    width: 100%;
    border-radius: 6px;
    padding: 10px;
    overflow-y: auto;
}

.new-task-icon {
    background: var(--blue-low);
    background-color: var(--blue-high-2);
    border-radius: 4px;
    padding: 3px;
    color: var(--blue-low);
    cursor: pointer;
}

.draggable-card {
    position: relative;
}

.edit-task-wrapper-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 91%;
    cursor: pointer;
}

@media (max-width: 720px) {
    .project-name {
        margin: 1rem .7rem .5rem;
    }

    .kanban-columns {
        flex-direction: column;
        width: 100%;
        padding: 0;
        overflow-y: scroll;
    }

    .kanban-column {
        width: 100%;
        min-width: 100%;
        max-width: 100%;
        min-height: 160px;
        max-height: 280px;
        margin: 1rem 0 2rem;
        align-items: flex-start;
    }

    .task-list {
        display: flex;
    }

    .kanban-column-header {
        margin-left: .7rem;
    }

    .kanban-column-body {
        height: auto;
        width: 100%;
        min-height: 100%;
        overflow-y: hidden;
        overflow-x: scroll;
    }

    .draggable-card {
        min-width: 230px;
    }
}
</style>