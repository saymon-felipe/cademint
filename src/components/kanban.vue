<template>
    <section class="kanban">
        <div class="loading-page" v-if="is_loading"></div>
        <joinedGroupModal :joined_group="joined_group" v-if="joined_group" @joined_group="joined_group = false" />
        <div class="kanban-container" v-if="!is_loading">
            <div class="kanban-title-container">
                <div class="kanban-title">
                    <h5>A fazer</h5>
                    <div class="new-os-container">
                        <router-link to="/home/new/todo" class="new-os">
                            <!--<i class="fas fa-plus-circle"></i>-->
                            <span class="material-icons">add_circle</span>
                            <h6>Novo</h6>
                        </router-link>
                    </div>
                </div>
                <div class="kanban-title">
                    <h5>Fazendo</h5>
                    <div class="new-os-container">
                        <router-link to="/home/new/doing" class="new-os">
                            <!--<i class="fas fa-plus-circle"></i>-->
                            <span class="material-icons md-24">add_circle</span>
                            <h6>Novo</h6>
                        </router-link>
                    </div>
                </div>
                <div class="kanban-title">
                    <h5>Teste</h5>
                </div>
                <div class="kanban-title">
                    <h5>Concluído</h5>
                </div>
            </div>
            <div class="responsive-kanban-column kanban-column">
                <div class="responsive-kanban col-scrum" id="col-to-do">
                    <div class="kanban-title-responsive">
                        <h5>A fazer</h5>
                        <router-link to="/home/new/todo" class="new-os">
                            <!--<i class="fas fa-plus-circle"></i>-->
                            <span class="material-icons md-24">add_circle</span>
                            <h6>Novo</h6>
                        </router-link>
                    </div>
                    <div class="os-list-container">
                        <Container group-name="kanban" class="os-list with-new" @drag-start="handleDragStart('todo', $event)" @drop="handleDrop('todo', $event)" :get-child-payload="getChildPayload" :should-accept-drop="verifyAllowDrop">
                            <Draggable v-for="task in todoList" :key="task.id_os" class="draggable-card">
                                <card :task="task" />
                            </Draggable>
                        </Container>
                    </div>
                    
                </div>
                <div class="responsive-kanban col-scrum" id="col-doing">
                    <div class="kanban-title-responsive">
                        <h5>Fazendo</h5>
                    </div>
                    <router-link to="/home/new/doing" class="new-os">
                        <!--<i class="fas fa-plus-circle"></i>-->
                        <span class="material-icons">add_circle</span>
                        <h6>Novo</h6>
                    </router-link>
                    <div class="os-list-container">
                        <Container group-name="kanban" class="os-list with-new" @drag-start="handleDragStart('doing', $event)" @drop="handleDrop('doing', $event)" :get-child-payload="getChildPayload" :should-accept-drop="verifyAllowDrop">
                            <Draggable v-for="task in doingList" :key="task.id_os" class="draggable-card">
                                <card :task="task" />
                            </Draggable>
                        </Container>
                    </div>
                </div>
                <div class="responsive-kanban col-scrum" id="col-test">
                    <div class="kanban-title-responsive">
                        <h5>Teste</h5>
                    </div>
                    <div class="os-list-container">
                        <Container group-name="kanban" class="os-list" @drag-end="handleDragEnd()" @drag-start="handleDragStart('test', $event)" @drop="handleDrop('test', $event)" :get-child-payload="getChildPayload" :should-accept-drop="verifyAllowDrop">
                            <Draggable v-for="task in testList" :key="task.id_os" class="draggable-card">
                                <card :task="task" />
                            </Draggable>
                        </Container>
                    </div>
                </div>
                <div class="responsive-kanban col-scrum" id="col-done">
                    <div class="kanban-title-responsive">
                        <h5>Concluído</h5>
                    </div>
                    <div class="os-list-container">
                        <Container group-name="kanban" class="os-list" @drag-start="handleDragStart('done', $event)" @drop="handleDrop('done', $event)" :get-child-payload="getChildPayload" :should-accept-drop="verifyAllowDrop">
                            <Draggable v-for="task in doneList" :key="task.id_os" class="draggable-card">
                                <card :task="task" />
                            </Draggable>
                        </Container>
                    </div>
                </div>
            </div>
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

export default {
    name: "kanban",
    props: ['change_project'],
    mixins: [globalMethods],
    data() {
        return {
            in_drag: false,
            task_list: {},
            is_loading: true,
            draggind_card: {
                status: '',
                col: '',
                index: -1,
                cardData: {}
            },
            joined_group: false,
            current_project_id: null
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
    methods: {
        init: function () {
            setTimeout(() => {
                this.getAllOs();
                this.verifyAllowDrop();
                this.joined_group = window.location.href.indexOf("?") != -1 ? window.location.href.split("?")[1].replace("joined_group=", "") : false;
            }, 300);
        },
        verifyAllowDrop: function () {
            if (window.innerWidth > 866) {
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
                    index: payload.index,
                    cardData: {
                        ...data[payload.index]
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

            self.task_list = self.task_list.filter(function(i) { return i.id_complete !== self.draggind_card.cardData.id_complete; });

            if (addedIndex != null) {
                self.draggind_card.cardData.status_os = status;
                self.task_list.push(self.draggind_card.cardData)
                let jwt = "Bearer " + self.getJwtFromLocalStorage();
                api.patch("/os/os_status", {
                    id_complete: self.draggind_card.cardData.id_complete,
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
        getAllOs: function (programatic = false) { // Função recupera a lista de OS do banco de dados.
            let self = this, jwt = "Bearer " + self.getJwtFromLocalStorage();
            if (!self.in_drag) {
                api.post("/os/return_os_list", {
                    id: self.getCurrentProjectIdInSessionStorage()
                },
                {
                    headers: {
                        Authorization: jwt
                    }
                })
                .then(function(response){
                    self.task_list = response.data.response.os_list;
                    if (!programatic) { // Só vai ter chamada recursiva se a chamada não for feita por outra função
                        setTimeout(() => {
                            self.is_loading = false;
                        }, 2000);
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
            setInterval(() => {
                if (this.current_project_id != this.getCurrentProjectIdInSessionStorage()) {
                    this.getAllOs(true);
                    this.current_project_id = this.getCurrentProjectIdInSessionStorage();
                }
            }, 1000);
        },
        hideTooltip: function () { // Reseta e esconde tooltip.
            $(".os-tooltip").attr("id", "");
            $(".os-tooltip").html("");
            $(".os-tooltip").hide();
        }
    },
    mounted() {
        setTimeout(() => {
            if (window.location.href.indexOf("/home") != -1) {
                this.init();
                this.current_project_id = this.getCurrentProjectIdInSessionStorage();
                this.checkIfProjectChanged();
            }
        }, 2000)
    },
    components: {
        Draggable,
        card,
        Container,
        joinedGroupModal
    }
}
</script>

<style scoped>
.os-list-container {
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

.kanban {
    position: absolute;
    display: flex;
    justify-content: center;
    bottom: 0;
    overflow: hidden;
    height: calc(100vh - 66px);
    width: 100vw;
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
    border-right: 1px solid var(--gray-high-2)!important;
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
}
</style>