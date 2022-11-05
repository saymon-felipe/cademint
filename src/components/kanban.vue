<template>
    <section class="kanban">
        <div class="loading-page" v-if="is_loading"></div>
        <joinedGroupModal :joined_group="joined_group" v-if="joined_group" @joined_group="joined_group = false" />
        <div class="kanban-container" v-if="!is_loading">
            <h3 class="project-name font-size-h3">{{ current_project.group_name }}</h3>
            <div class="kanban-columns">
                <div class="kanban-column" id="column-1">
                    <div class="kanban-column-header">
                        <p class="font-size-5">A fazer</p>
                        <span class="material-icons new-task-icon" v-on:click="createTask(1)">add</span>
                        
                    </div>
                    <div class="kanban-column-body">
                        <Container group-name="kanban" class="task-list" @drag-end="handleDragEnd()" @drag-start="handleDragStart('todo', $event)" @drop="handleDrop('todo', $event)" :get-child-payload="getChildPayload">
                            <newTaskCard :group_users="project.group_members_objects" card_status="1" :user="user" @closeTask="closeNewTask($event)" class="new-card" />
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
                            <newTaskCard :group_users="project.group_members_objects" card_status="2" :user="user" @closeTask="closeNewTask($event)" class="new-card" />
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
                            <newTaskCard :group_users="project.group_members_objects" card_status="3" :user="user" @closeTask="closeNewTask($event)" class="new-card" />
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
                            <newTaskCard :group_users="project.group_members_objects" card_status="4" :user="user" @closeTask="closeNewTask($event)" class="new-card" />
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

export default {
    name: "kanban",
    props: ['change_project'],
    mixins: [globalMethods],
    data() {
        return {
            in_drag: false,
            user: {},
            task_list: {},
            is_loading: true,
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
            checkAllowDrag: false
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
                this.getCurrentProject(this.current_project.group_id);
                this.getAllOs();
                this.joined_group = window.location.href.indexOf("?") != -1 ? window.location.href.split("?")[1].replace("joined_group=", "") : false;
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
                let jwt = "Bearer " + self.getJwtFromLocalStorage();
                api.patch("/os/os_status", {
                    id: self.draggind_card.cardData.id,
                    status_os: status
                }, {
                    headers: {
                        Authorization: jwt
                    }
                })
            }
        },
        getChildPayload: function (index) {
            return {
                index,
            }
        },
        getAllOs: function (programatic = false) { // Função recupera a lista de tarefas do banco de dados.
            let self = this
            let jwt = "Bearer " + self.getJwtFromLocalStorage();

            if (self.current_project == null) {
                setTimeout(() => {
                    self.getAllOs(true);
                }, 1000);
                return;
            }

            if (!self.in_drag) {
                api.post("/os/return_os_list", {
                    id: self.current_project.group_id
                },
                {
                    headers: {
                        Authorization: jwt
                    }
                })
                .then(function(response){
                    self.task_list = response.data.response.os_list;
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
                self.project = response.data.response;
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
                    emmit_event.user_owner_name = this.user.nome;
                    this.editTask(emmit_event);
                }
            }, 400);
        }
    },
    mounted() {
        
        setTimeout(() => {
            if (window.location.href.indexOf("/home") != -1) {
                this.current_project = this.getCurrentProjectInLocalStorage();
                this.requireUser();
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
        editTaskModal
    }
}
</script>

<style scoped>

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

/* NEW TASK */

.kanban {
    height: 100vh;
    justify-content: center;
    overflow-y: hidden;
    overflow-x: scroll;
    width: 100%;
    padding-top: 56px;
}

/* INÍCIO ALTERAÇÃO VISUAL */

.smooth-dnd-container {
    height: 100%;
}

.kanban-container {
    height: 100%;
    width: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.kanban-columns {
    height: 100%;
    display: flex;
    justify-content: flex-start;
    padding: .5rem 2rem;
    overflow: hidden;
}

.project-name {
    margin: 1rem 2rem .5rem;
}

.kanban-column {
    width: 350px;
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

/* FIM ALTERAÇÃO VISUAL */

/*.os-list-container {
    width: 100%;
    height: 100%;
}

.smooth-dnd-container.vertical > .smooth-dnd-draggable-wrapper, .draggable-card {
    overflow: initial;
    width: 90%;
}

@media (max-width: 865px) {
    .smooth-dnd-container.vertical > .smooth-dnd-draggable-wrapper, .draggable-card {
        width: auto !important;
    }
}



@media (max-width: 865px) {
    .kanban-container {
        overflow-y: scroll;
        overflow-x: hidden;
    }
}

@media (max-width: 646px) {
    .kanban-container {
        margin-top: 3.3rem;
    }
}

.kanban-title-container {
    width: 100vw;
    display: flex;
    align-items: center;
    background: white;
    z-index: 3;
}

.kanban-title {
    width: 25%;
    position: relative;
    border-right: 1px solid #dee2e6;
}

.kanban-title:last-child {
    border-right: none;
}

.kanban-title:nth-child(2) {
    width: calc(25% + 1px);
}

.kanban-title, .kanban-title-responsive {
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #dee2e6;
}

.kanban-title h5 {
    font-size: 1.25rem;
    font-weight: 500;
    margin: 0.4rem 0;
}

.kanban-title-responsive {
    display: none;
    width: 100%;
    border: 1px solid #dee2e6;
}

.new-os-container {
    position: absolute;
    top: 2.5rem;
    width: 97%;
    height: 155%;
    z-index: 3;
    background: var(--white);
    border-radius: 10px;
}

.new-os {
    background: white;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 85%;
    margin: .5rem auto -.7rem;
    cursor: pointer;
    border-radius: 10px;
    padding: .6rem 0;
    color: var(--black);
    transition: all 0.3s;
}

    .new-os:hover {
        background:var(--gray-high-3);
    }

    .new-os h6 {
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 2px;
        line-height: 1.2;
        font-weight: 500;
        font-size: 1rem;
    }

    .new-os .material-icons {
        margin-right: .6rem;
        font-size: 28px;
    }

.kanban-column {
    min-height: calc(100vh - 100px);
    width: 100vw;
    display: flex;
}

.col-scrum {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: calc(100vh - 115px);
    padding: 3.5rem 7px 0;
    width: 25%!important;
}

.col-scrum:nth-child(1), .col-scrum:nth-child(2), .col-scrum:nth-child(3) {
    border-right: 1px solid var(--gray-high)!important;
}

.kanban-title-responsive {
    display: none;
    width: 100%;
    border: 1px solid #dee2e6;
}

.os-list {
    list-style: none;
    width: 100%;
    height: 100%;
    margin: .5rem 0;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.os-list-overlay {
    background: rgba(0, 162, 232, 0.268);
}



@media (min-width: 866px) {
    .kanban-column .new-os {
        display: none;
    }
}

@media (max-width: 865px) {
    .kanban-title-container {
        display: none;
    }

    .kanban-title {
        width: 100%;
        border-top: 1px solid #dee2e6!important;
    }

    .kanban-title-container {
        display: none;
    }

    .kanban-title-responsive {
        display: flex;
    }

    .new-os {
        position: absolute;
        right: .5rem;
        top: 0;
        bottom: -2.4rem;
        margin: auto;
        width: 3rem;
        height: 3rem;
    }

        .new-os .material-icons {
            margin: 0;
        }

        .new-os h6 {
            display: none;
        }

    .responsive-kanban-column {
        flex-direction: column;
        overflow: hidden;
        width: 100vw;
        height: auto;
        margin: 0;
    }

    .kanban-title-responsive {
        display: flex;
    }

    .os-list {
        flex-direction: row;
    }

    .responsive-kanban {
        display: flex;
        align-items: center;
        width: 100vw!important;
        height: auto;
        border: none!important;
        position: relative;
        padding: 0;
    }

        .responsive-kanban h5 {
            font-size: 1.25rem;
            font-weight: 500;
            line-height: 1.2;
        }

        .responsive-kanban .os-list {
            display: flex;
            overflow-x: scroll;
            min-height: 3rem;
        }

    .with-new {
        width: calc(100vw - 60px);
    }

    .card-link {
        margin: 0 .8rem!important;
        display: flex;
        align-items: center;
    }
}*/
</style>