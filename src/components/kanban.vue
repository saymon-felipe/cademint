<template>
    <section class="kanban">
        <div class="loading-page" v-if="is_loading"></div>
        <joinedGroupModal :joined_group="joined_group" v-if="joined_group" @joined_group="joined_group = false" />
        <div class="kanban-container" v-if="!is_loading">
            <div class="project-header">
                <div class="project-informations">
                    <h3 class="project-name font-size-h3">{{ current_project.group_name }}</h3>
                    <div style="position: relative;">
                        <div class="project-status" :class="chooseProjectStatus(projectStatus)">
                            <span v-on:click="toggleProjectStatus()">{{ chooseProjectStatus(projectStatus, true) }}</span>
                        </div>
                        <div class="project-status-container">
                            <div class="status-item on-track" v-on:click="changeProjectStatus(1)">
                                <span>Em andamento</span>
                            </div>
                            <div class="status-item at-risk" v-on:click="changeProjectStatus(2)">
                                <span>Em risco</span>
                            </div>
                            <div class="status-item off-track" v-on:click="changeProjectStatus(3)">
                                <span>Suspenso</span>
                            </div>
                            <div class="status-item on-hold" v-on:click="changeProjectStatus(4)">
                                <span>Em espera</span>
                            </div>
                        </div>
                    </div>
                    <div class="project-status-wrapper" v-on:click="toggleProjectStatus()"></div>
                </div>
                
                <div class="project-settings" v-if="false">
                    <div>
                        <span class="material-icons history-sprint-button" v-on:click="viewHistoricSprints()">history</span>
                    </div>
                    <div>
                        <span class="material-icons sprint-button" v-on:click="configureProjectSprint()">timeline</span>
                    </div>
                </div>
            </div>
            <div class="kanban-columns">
                <Container class="smooth-dnd-container horizontal" orientation="horizontal" @drop="handleColumnsUpdate" drag-handle-selector=".column-drag-handle" :get-child-payload="getChildPayload" @drag-start="handleColumnsDragStart($event)" :lock-axis="'x'">
                    <KanbanColumn
                        v-for="column in sortedColumns"
                        :key="column.id"
                        :column="column"
                        :groupMembers="project.group_members || []"
                        :user="$root.user"
                        :projectId="current_project.group_id"
                        :isResponsive="isResponsive"
                        @drag-start="handleDragStart"
                        @drop="handleDrop"
                        @drag-end="handleDragEnd"
                        @edit-task="editTask"
                        @rename-column="handleRenameColumn"
                        @exclude-column="handleExcludeColumn"
                        @create-task="createTask"
                        @show-wrapper="showWrapper"
                        @hide-more-options="hideMoreOptions"
                    />
                </Container>
                <div class="wrapper-container" v-on:click="hideMoreOptions()"></div>
                <div class="create-new-column" v-on:click="createNewColumn()">
                    <span class="material-icons">add</span>
                    <span>{{ kanbanColumns.length == 0 ? "Adicione uma coluna" : "Adicione outra coluna" }}</span>
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
import {Container} from 'vue-smooth-dnd';
import joinedGroupModal from './joinedGroupModal.vue';
import editTaskModal from './editTaskModal.vue';
import modalComponent from "./modalComponent.vue";
import sprintModalContent from './sprintModalContent.vue';
import historySprintModalContent from './historySprintModalContent.vue';
import KanbanColumn from './kanbanColumn.vue';

export default {
    name: "kanban",
    props: ['change_project'],
    mixins: [globalMethods],
    components: {
        Container,
        joinedGroupModal,
        editTaskModal,
        modalComponent,
        sprintModalContent,
        historySprintModalContent,
        KanbanColumn
    },
    data() {
        return {
            saved: false,
            in_drag: false,
            task_list: {},
            is_loading: true,
            newSprint: false,
            historySprint: false,
            dragging_card: {
                status: '',
                col: '',
                index: -1,
                cardData: {}
            },
            dragging_col: {
                id: null
            },
            joined_group: false,
            current_project: null,
            project: {},
            edit_task: {},
            show_edit_task: false,
            temporary_task: {},
            checkAllowDrag: false,
            modalName: "",
            showModal: false,
            kanbanColumns: [],
            sortedColumns: [],
            projectStatus: 1,
            searchInputs: []
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
        },
    },
    computed: {
        isResponsive() {
            return window.innerWidth <= 720;
        }
    },
    methods: {
        handleRenameColumn: function (data) {
            let self = this;
            api.post("/projects/columns/rename", data).then(() => {
                self.returnColumns(false, false);
                $(".rename-column-input").val("");
            });
        },
        handleExcludeColumn: function (data) {
            let self = this;

            if (!confirm("Tem certeza que deseja excluir a coluna? \n\n Todas as tarefas pertencentes à essa coluna serão apagadas.")) {
                return;
            }

            api.post("/projects/columns/delete", data)
            .then(() => {
                self.returnColumns(false, false);
            });
        },
        showWrapper: function () {
            $(".wrapper-container").show();
        },
        filterKanbanCards: function () {
            for (let i = 0; i < this.sortedColumns.length; i++) {
                let currentColumn = this.sortedColumns[i];

                currentColumn.tasks = [];
                currentColumn.filteredTasks = [];

                for (let j = 0; j < this.task_list.length; j++) {
                    let currentTask = this.task_list[j];

                    if (currentTask.status_os == currentColumn.id) {
                        currentColumn.filteredTasks.push(currentTask);
                        currentColumn.tasks.push(currentTask);
                    }
                }

                currentColumn.tasks = currentColumn.tasks.sort((a, b) => a.task_index - b.task_index);
                currentColumn.filteredTasks = currentColumn.filteredTasks.sort((a, b) => a.task_index - b.task_index);
            }

            this.is_loading = false;
        },
        createNewColumn: function () {
            let self = this;

            api.post("/projects/columns/create", {
                project_id: self.current_project.group_id
            })
            .then(() => {
                self.returnColumns(false, false).then(() => {
                    $(".smooth-dnd-container.horizontal").animate({
                        scrollTop: 999999
                    }, 800);
                });
            });
        },
        returnColumns: function (initial = false, returnTasks = true) {
            return new Promise((resolve) => {
                let self = this;

                api.post("/projects/columns", {
                    project_id: self.current_project.group_id
                })
                .then((response) => {
                    self.kanbanColumns = response.data.returnObj;
                    self.sortedColumns = [...self.kanbanColumns].sort((a, b) => a.order - b.order);
                    self.filterKanbanCards();

                    if (returnTasks) {
                        self.returnProjectStatus();
                        self.getAllOs(!initial);
                    }

                    resolve();
                });
            })
        },
        resetModalContentVariables: function () {
            this.newSprint = false;
            this.historySprint = false;
        },
        configureProjectSprint: function () {
            this.resetModalContentVariables();

            this.newSprint = true;
            this.setModalVariables("Configurar sprint");
        },
        viewHistoricSprints: function () {
            this.resetModalContentVariables();

            this.historySprint = true;
            this.setModalVariables("Sprints anteriores");
        },
        returnProjectStatus: function () {
            let self = this;

            api.post("/projects/status", {
                project_id: self.current_project.group_id
            }).then((response) => {
                self.projectStatus = response.data.returnObj[0].status;
            });
        },
        changeProjectStatus: function (projectStatus) {
            this.toggleProjectStatus();

            let self = this;

            api.post("/projects/status/change", {
                project_id: self.current_project.group_id,
                status: projectStatus
            }).then(() => {
                self.returnProjectStatus();
                self.requireUser(true);
            });
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

                if (this.current_project == null) {
                    return;
                }

                this.getCurrentProject(this.current_project.group_id);
                this.returnColumns();

                let url = new URLSearchParams(window.location.search);
                this.joined_group = url.get("joined_group") != null ? url.get("joined_group") : false;
            }, 300);
        },
        verifyAllowDrop: function () {
            if (!this.isResponsive) {
                return true;
            }

            $(".draggable-card").removeClass("smooth-dnd-draggable-wrapper");
            $(".kanban-column").removeClass("smooth-dnd-draggable-wrapper");

            return false;
        },
        handleDragStart: function (col, dragResult) {
            if (!this.verifyAllowDrop()) {
                return;
            }
            
            const {payload, isSource} = dragResult;

            sessionStorage.setItem("in_drag", "true");

            if (isSource) {
                for (let i = 0; i < this.kanbanColumns.length; i++) {
                    let currentColumn = this.kanbanColumns[i];

                    if (currentColumn.id == col) {
                        this.dragging_card = {
                            col,
                            index: payload.index,
                            cardData: currentColumn.tasks[payload.index - 1]
                        }
                    }
                }
            }
        },
        handleColumnsDragStart: function (dragResult) {
            const {payload, isSource} = dragResult;

            if (!this.verifyAllowDrop()) {
                return;
            }

            sessionStorage.setItem("in_drag", "true");

            if (isSource) {
                this.dragging_col = {
                    ...JSON.parse(JSON.stringify(this.sortedColumns[payload.index]))
                }
            }
        },
        handleColumnsUpdate: function (dropResult) {
            const { removedIndex, addedIndex } = dropResult;

            if (removedIndex === addedIndex) {
                return;
            }

            //let self = this;

            let reorderedColumns = this.reorderColumns(addedIndex);

            if (addedIndex != null) {
                this.kanbanColumns = reorderedColumns;

                api.patch("/projects/columns/order", {
                    reorderedColumns: reorderedColumns
                })
                .then(() => {
                    //self.returnColumns(false, true);
                    sessionStorage.setItem("in_drag", "false");
                });
            }
        },
        handleDragEnd: function () {
            sessionStorage.setItem("in_drag", "false");
        },
        reorderColumns: function (addedIndex) {
            let array = this.sortedColumns;

            let currentIndex; 

            for (let i = 0; i < array.length; i++) {
                if (array[i].id == this.dragging_col.id) {
                    currentIndex = i;
                }
            }

            if (currentIndex == undefined) return [];

            const [movedObject] = array.splice(currentIndex, 1);
            array.splice(addedIndex, 0, movedObject);

            return array;
        },
        reorderTasks: function (addedIndex, col, lastCol) {
            let array, lastArray;

            for (let i = 0; i < this.sortedColumns.length; i++) {
                let currentColumn = this.sortedColumns[i];

                if (currentColumn.id == col) {
                    array = currentColumn.filteredTasks;
                }

                if (currentColumn.id == lastCol) {
                    lastArray = currentColumn.filteredTasks;
                }
            }

            let currentIndex; 

            for (let i = 0; i < lastArray.length; i++) {
                if (lastArray[i].id == this.dragging_card.cardData.id) {
                    currentIndex = i;
                }
            }

            if (currentIndex == undefined) return [];

            const [movedObject] = lastArray.splice(currentIndex, 1);
            array.splice(addedIndex, 0, movedObject);

            return array;
        },
        handleDrop: function (col, dropResult) {
            const { removedIndex, addedIndex } = dropResult;

            let self = this;

            if (removedIndex === addedIndex) {
                return;
            }

            let reorderedColumn = this.reorderTasks(addedIndex - 1, col, self.dragging_card.col);

            if (addedIndex != null) {
                self.dragging_card.cardData.status_os = col;
                self.task_list.push(self.dragging_card.cardData); 

                api.patch("/task/os_status", {
                    id: self.dragging_card.cardData.id,
                    status_os: col,
                    reorderedColumn: reorderedColumn
                })
                .then(() => {
                    self.getAllOs(true);
                });
            }
        },
        getChildPayload: function (index) {
            return {
                index,
            };
        },
        getAllOs: function (programatic = false) {
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

                    self.filterKanbanCards();

                    if (!programatic) {
                        setTimeout(self.getAllOs, 60000);
                    }
                }).catch(function(){
                    let pathName = window.location.href;
                    if (pathName.indexOf("/login") == -1 && pathName.indexOf("/register") == -1 && pathName.indexOf("/enter-group") == -1) {
                        if (!programatic) {
                            setTimeout(self.getAllOs, 5000);
                        }
                    }
                });
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
                this.returnColumns(false, true);
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
                self.response = error;
            });
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
        hideMoreOptions: function () {
            $(".more-options").hide();
            $(".wrapper-container").hide();
        },
        setModalVariables: function (modalName) {
            this.modalName = modalName;
            this.showModal = true;
        }
    },
    mounted() {
        setTimeout(() => {
            if (window.location.href.indexOf("/home") != -1) {
                this.init();
            }
        }, 10);
    }
};
</script>

<style scoped>
.smooth-dnd-container.horizontal {
    border-spacing: 1.5rem 0;
}

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
    flex-wrap: wrap;
    gap: 10px
}

.project-status {
    border: 1px solid var(--gray-high);
    padding: 5px 10px 5px 30px;
    border-radius: 10px;
    cursor: pointer;
    position: relative;
}

    .project-status:hover {
        background: var(--gray-high);
    }

    .project-status::before {
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
        left: 16px;
        top: 120%;
        background: var(--white);
        border: 1px solid var(--gray-high);
        box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
        border-radius: 10px;
        display: none;
        z-index: 11;
        white-space: nowrap;
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

.kanban {
    height: 100vh;
    overflow: hidden;
    width: 100vw;
    padding-top: 56px;
}

.smooth-dnd-container {
    height: calc(100% - 10px);
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
    overflow: hidden;
    overflow-x: auto;
}

.kanban-columns-container {
    display: flex;
    justify-content: flex-start;
    min-width: fit-content;
}

.create-new-column {
    display: flex;
    align-items: center;
    gap: 7px;
    cursor: pointer;
    background: var(--gray-high);
    padding: 1.3rem;
    height: 20px;
    border-radius: 6px;
    min-width: 330px;
    margin: 0 .8rem;

    &:hover {
        background: var(--gray-soft);
    }
}

.wrapper-container {
    position: absolute;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    z-index: 1;
    cursor: default;
    display: none;
}

@media (max-width: 720px) {
    .project-name {
        margin: 1rem .7rem .5rem;
    }

    .kanban-columns, .smooth-dnd-container.horizontal {
        display: flex !important;
        flex-direction: column;
        width: 100%;
        padding: 0 .5rem;
        overflow-y: scroll;
        overflow-x: hidden;
        height: 95%;
        gap: 1rem;
    }

    .kanban-columns {
        overflow: hidden;
        gap: 0;
    }

    .create-new-column {
        margin-top: 1rem;
        margin-bottom: 2rem;
        margin-left: 0.5rem;
    }
}
</style>