<template>
    <aside class="edit-task">
        <div class="edit-task-inner">
            <div class="edit-task-header">
                <div class="header-informations">
                    <p class="font-size-3 task-id">#{{task.id > 0 ? task.id : "Automático"}}</p>
                    <p class="font-size-1 project-name">{{group.nome}}</p>
                </div>
                <div class="modal-header-buttons">
                    <button type="button" class="save-task-button" v-if="haveChanges" v-on:click="saveTaskChanges()">
                        <span class="material-icons">done</span>
                    </button>
                    <button type="button" class="exclude-task-button" v-on:click="deleteTask()">
                        <span class="material-icons">delete</span>
                    </button>
                    <button type="button" class="close-modal-button" v-on:click="closeEditTaskModal()">
                        <span class="material-icons">close</span>
                    </button>
                </div>
            </div>
            <div class="edit-task-body">
                <div class="input-group first-input-group">
                    <label>Descrição</label>
                    <textarea name="task_description" v-on:keyup="computeChanges('description', $event)" id="task_description" cols="30" rows="6" maxlength="5000"></textarea>
                </div>
                <div class="customized-select-option-group-wrapper" v-on:click="closeSelects()"></div>
                <div class="input-group">
                    <label>Responsável</label>
                    <div class="cademint-customized-select">
                        <div class="customized-select-selected" v-on:click="toggleSponsorSelect()">
                            <div class="customized-option" :user_id="selected_sponsor[0].id_usuario">
                                <img :src="selected_sponsor[0].profile_photo" class="avatar-pp">
                                <span>{{selected_sponsor[0].nome}}</span>
                            </div>
                            <span class="material-icons customized-select-icon">expand_more</span>
                        </div>
                        <div class="customized-select-option-group sponsor-select">
                            <div class="customized-option" :class="selected_sponsor[0].id_usuario == member.id_usuario ? 'selected' : ''" :user_id="member.id_usuario" v-for="(member, index) in group.group_members_objects" :key="index" v-on:click="selected_sponsor = [member, '']; toggleSponsorSelect(); computeChanges('sponsor', member.id_usuario, member.nome)">
                                <img :src="member.profile_photo" class="avatar-pp" v-if="member.id_usuario != selected_sponsor[0].id_usuario">
                                <span v-if="member.id_usuario != selected_sponsor[0].id_usuario">{{member.nome}}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="input-group">
                    <label>Prioridade</label>
                    <div class="cademint-customized-select">
                        <div class="customized-select-selected" v-on:click="togglePrioritySelect()">
                            <div class="customized-option" :priority="selected_priority">
                                <span :class="selected_priority == 2 ? 'priority-text' : ''">{{returnPriorityName(selected_priority)}}</span>
                            </div>
                            <span class="material-icons customized-select-icon">expand_more</span>
                        </div>
                        <div class="customized-select-option-group priority-select">
                            <div class="customized-option" priority="1" :class="selected_priority == 1 ? 'selected' : ''" v-if="selected_priority != 1" v-on:click="selected_priority = 1; togglePrioritySelect(); computeChanges('priority', 1)">
                                <span>Normal</span>
                            </div>
                            <div class="customized-option" priority="2" :class="selected_priority == 2 ? 'selected' : ''" v-if="selected_priority != 2" v-on:click="selected_priority = 2; togglePrioritySelect(); computeChanges('priority', 2)">
                                <span class="priority-text">Importante</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="input-group">
                    <label>Tamanho</label>
                    <div class="cademint-customized-select">
                        <div class="customized-select-selected" v-on:click="toggleSizeSelect()">
                            <div class="customized-option" :size="selected_size">
                                <span>{{returnSizeName(selected_size)}}</span>
                            </div>
                            <span class="material-icons customized-select-icon">expand_more</span>
                        </div>
                        <div class="customized-select-option-group size-select">
                            <div class="customized-option" size="P" :class="selected_size == 'P' ? 'selected' : ''" v-if="selected_size != 'P'" v-on:click="selected_size = 'P'; toggleSizeSelect(); computeChanges('size', 'P')">
                                <span>P - Pequeno</span>
                            </div>
                            <div class="customized-option" size="M" :class="selected_size == 'M' ? 'selected' : ''" v-if="selected_size != 'M'" v-on:click="selected_size = 'M'; toggleSizeSelect(); computeChanges('size', 'M')">
                                <span>M - Medio</span>
                            </div>
                            <div class="customized-option" size="G" :class="selected_size == 'G' ? 'selected' : ''" v-if="selected_size != 'G'" v-on:click="selected_size = 'G'; toggleSizeSelect(); computeChanges('size', 'G')">
                                <span>G - Grande</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="input-group">
                    <label>Status</label>
                    <div class="cademint-customized-select">
                        <div class="customized-select-selected" v-on:click="toggleStatusSelect()">
                            <div class="customized-option" :status="selected_status">
                                <span>{{returnStatusName(selected_status)}}</span>
                            </div>
                            <span class="material-icons customized-select-icon">expand_more</span>
                        </div>
                        <div class="customized-select-option-group status-select">
                            <div class="customized-option" status="1" :class="selected_status == 1 ? 'selected' : ''" v-if="selected_status != 1" v-on:click="selected_status = 1; toggleStatusSelect(); computeChanges('status', 1)">
                                <span>A Fazer</span>
                            </div>
                            <div class="customized-option" status="2" :class="selected_status == 2 ? 'selected' : ''" v-if="selected_status != 2" v-on:click="selected_status = 2; toggleStatusSelect(); computeChanges('status', 2)">
                                <span>Fazendo</span>
                            </div>
                            <div class="customized-option" status="3" :class="selected_status == 3 ? 'selected' : ''" v-if="selected_status != 3" v-on:click="selected_status = 3; toggleStatusSelect(); computeChanges('status', 3)">
                                <span>Teste</span>
                            </div>
                            <div class="customized-option" status="4" :class="selected_status == 4 ? 'selected' : ''" v-if="selected_status != 4" v-on:click="selected_status = 4; toggleStatusSelect(); computeChanges('status', 4)">
                                <span>Concluído</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="input-group">
                    <label>Abertura</label>
                    <input type="hidden" name="task_open_date" :value="task_create_date">
                    <div class="opened-container">
                        <span>{{task.user_owner_name}} - {{formatDate(task_create_date)}}</span>
                    </div>
                </div>
            </div>
            <div class="edit-task-footer">
                <div class="footer-list-menu">
                    <ul>
                        <li class="menu-item selected font-size-3">
                            Comentários
                            <div class="menu-underline"></div>
                        </li>
                    </ul>
                    
                </div>
                <div class="footer-content">
                    <div class="comments-list" v-if="task.id != undefined">
                        <div class="comment" v-for="(comment, index) in task_comments" :key="index">
                            <div class="comment-header">
                                <div class="author-photo">
                                    <img :src="comment.criador_imagem" class="avatar-pp">
                                </div>
                                <div class="author-informations">
                                    <span class="author-name">{{comment.criador_nome}}</span>
                                    <span class="comment-create-time font-size-5">{{ formatDate(comment.data_criacao_comentario) }}</span>
                                </div>
                            </div>
                            <div class="comment-body">
                                <div class="comment-text">{{ comment.desc_comentario }}</div>
                                <div class="comment-like" v-on:click="commentLike(comment.id_comentario)" :class="comment.user_has_liked == 1 ? 'liked' : 'unliked'">
                                    <span class="material-icons like-icon">thumb_up</span>
                                    <span class="comment-like-count">{{ comment.curtidas_comentario }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="comment-input">
            <textarea name="message" id="desc_comentario" placeholder="Faça um comentário" maxlength="2000" rows="1" v-on:keydown="countRows($event)" v-on:keyup="countRows($event, true)"></textarea>
            <div class="send-icon" v-on:click="sendComment('#desc_comentario')">
                <span class="material-icons">send</span>
            </div>
        </div>
    </aside>
</template>
<script>
import {globalMethods} from '../js/globalMethods.js';
import $ from 'jquery';
import moment from 'moment';
import api from '../configs/api.js';

export default {
    name: "editTaskModal",
    props: ["task", "group"],
    mixins: [globalMethods],
    data() {
        return {
            selected_sponsor: [
                {
                    id_usuario: 0
                }
            ],
            selected_priority: this.task.priority,
            selected_size: this.task.size,
            selected_status:  this.task.status_os,
            task_create_date: this.task.task_create_date,
            haveChanges: false,
            changed_task: {},
            task_comments: {}
        }
    },
    mounted() {
        this.changed_task = JSON.parse(JSON.stringify(this.task));
        if (this.task.id == undefined) {
            this.disableCommentInput();
        } else {
            this.loadTaskComments();
        }
        $("#task_description").val(this.task.desc_os);
        
        this.setSelectedSponsor(this.task.sponsor);
    },
    methods: {
        setSelectedSponsor: function (sponsor_id) {
            let member = this.group.group_members_objects.filter(member => {return member.id_usuario == sponsor_id});
            this.selected_sponsor = member;
        },
        deleteTask: function () {
            let self = this, jwt = "Bearer " + self.getJwtFromLocalStorage();
            api.delete("/os/delete_os", { data: {id: self.task.id}, headers: {Authorization: jwt}})
            .then(function(){
                self.closeEditTaskModal();
            }).catch(function(error){
                console.log(error)
            })
        },
        commentLike: function (task_comment_id) {
            let self = this, jwt = "Bearer " + self.getJwtFromLocalStorage();
            let data = {
                task_comment_id: task_comment_id
            }

            api.post("/os/like_task_comment", data, { // Requisição que atualiza a tarefa com os novos dados.
                headers: {
                    Authorization: jwt
                }
            })
            .then(function(){
                self.loadTaskComments();
            }).catch(function(error){
                console.log(error)
            })
        },
        disableCommentInput: function () {
            $("#desc_comentario").attr("disabled", "disabled");
            $(".send-icon").css("background", "#e7e7e7").css("cursor", "default");
            $(".send-icon").on("click", (e) => {
                e.preventDefault();
            })
        },
        sendComment: function (input_id) {
            let input = $(input_id);
            let self = this, jwt = "Bearer " + self.getJwtFromLocalStorage();

            if (input.val().trim().length == 0) {
                input.val("");
                return;
            }
            let comment = {
                desc_comentario: input.val(),
                data_criacao_comentario: moment().format(),
                id_task: self.task.id
            }
            
            api.post("/os/task_comment", comment, { // Requisição que atualiza a tarefa com os novos dados.
                headers: {
                    Authorization: jwt
                }
            })
            .then(function(){
                self.loadTaskComments(true);
                input.attr("rows", "1");
                input.val("");
            }).catch(function(error){
                console.log(error)
            })
        },
        loadTaskComments: function (programatic = false) {
            let self = this, jwt = "Bearer " + self.getJwtFromLocalStorage();
            let data = {
                id_task: self.task.id
            }
            api.post("/os/get_task_comment", data, { // Requisição que atualiza a tarefa com os novos dados.
                headers: {
                    Authorization: jwt
                }
            })
            .then(function(response){
                self.task_comments = response.data.returnObj.comentarios;
                if (programatic) {
                    $(".edit-task-inner").animate({
                        scrollTop: 9999999
                    }, 500);
                }
            }).catch(function(error){
                console.log(error)
            })
        },
        closeEditTaskModal: function () {
            this.$emit("closeEditTaskModal", true);
        },
        saveTaskChanges: function () {
            let self = this, jwt = "Bearer " + self.getJwtFromLocalStorage();

            api.patch("/os", self.changed_task, { // Requisição que atualiza a tarefa com os novos dados.
                headers: {
                    Authorization: jwt
                }
            })
            .then(function(){
                self.closeEditTaskModal();
            }).catch(function(error){
                console.log(error)
            })
        },
        computeChanges: function (input_type, value, nome = "") {
            switch (input_type) {
                case 'priority':
                    this.changed_task.priority = value;
                    break;
                case 'sponsor':
                    this.changed_task.sponsor = value.toString();
                    this.changed_task.sponsor_name = nome;
                    break;
                case 'size':
                    this.changed_task.size = value;
                    break;
                case 'description':
                    this.changed_task.desc_os = value.target.value;
                    break;
                case 'status':
                    this.changed_task.status_os = value;
                    break;
            }
            if (JSON.stringify(this.changed_task) != JSON.stringify(this.task)) {
                this.haveChanges = true;
                return;
            }
            this.haveChanges = false;
        },
        formatDate: function (date) {
            moment.locale("pt-br");
            return moment(date).fromNow();
        },
        closeSelects: function () {
            this.closePrioritySelect();
            this.closeSponsorSelect();
            this.closeSizeSelect();
            this.closeStatusSelect();
        },
        toggleSponsorSelect: function () {
            let container = $(".sponsor-select.customized-select-option-group");
            if (container.is(":visible")) {
                this.closeSponsorSelect();
                return;
            }
            this.openSponsorSelect();
        },
        openSponsorSelect: function () {
            let container = $(".sponsor-select.customized-select-option-group");
            let wrapper = $(".customized-select-option-group-wrapper");
            container.show();
            wrapper.show();
            setTimeout(() => {
                container.css("opacity", 1);
            }, 10);
        },
        closeSponsorSelect: function () {
            let container = $(".sponsor-select.customized-select-option-group");
            let wrapper = $(".customized-select-option-group-wrapper");
            container.css("opacity", 0);
            setTimeout(() => {
                container.hide();
                wrapper.hide();
            }, 400);
        },
        togglePrioritySelect: function () {
            let container = $(".priority-select.customized-select-option-group");
            if (container.is(":visible")) {
                this.closePrioritySelect();
                return;
            }
            this.openPrioritySelect();
        },
        openPrioritySelect: function () {
            let container = $(".customized-select-option-group.priority-select");
            let wrapper = $(".customized-select-option-group-wrapper");
            container.show();
            wrapper.show();
            setTimeout(() => {
                container.css("opacity", 1);
            }, 10);
        },
        closePrioritySelect: function () {
            let container = $(".customized-select-option-group.priority-select");
            let wrapper = $(".customized-select-option-group-wrapper");
            container.css("opacity", 0);
            setTimeout(() => {
                container.hide();
                wrapper.hide();
            }, 400);
        },
        toggleSizeSelect: function () {
            let container = $(".size-select.customized-select-option-group");
            if (container.is(":visible")) {
                this.closeSizeSelect();
                return;
            }
            this.openSizeSelect();
        },
        openSizeSelect: function () {
            let container = $(".customized-select-option-group.size-select");
            let wrapper = $(".customized-select-option-group-wrapper");
            container.show();
            wrapper.show();
            setTimeout(() => {
                container.css("opacity", 1);
            }, 10);
        },
        closeSizeSelect: function () {
            let container = $(".customized-select-option-group.size-select");
            let wrapper = $(".customized-select-option-group-wrapper");
            container.css("opacity", 0);
            setTimeout(() => {
                container.hide();
                wrapper.hide();
            }, 400);
        },
        toggleStatusSelect: function () {
            let container = $(".status-select.customized-select-option-group");
            if (container.is(":visible")) {
                this.closeStatusSelect();
                return;
            }
            this.openStatusSelect();
        },
        openStatusSelect: function () {
            let container = $(".customized-select-option-group.status-select");
            let wrapper = $(".customized-select-option-group-wrapper");
            container.show();
            wrapper.show();
            setTimeout(() => {
                container.css("opacity", 1);
            }, 10);
        },
        closeStatusSelect: function () {
            let container = $(".customized-select-option-group.status-select");
            let wrapper = $(".customized-select-option-group-wrapper");
            container.css("opacity", 0);
            setTimeout(() => {
                container.hide();
                wrapper.hide();
            }, 400);
        },
        returnPriorityName: function (priority) {
            switch (priority) {
                case 1:
                    return "Normal";
                case 2: 
                    return "Importante";
            }
        },
        returnSizeName: function (size) {
            switch (size) {
                case 'P':
                    return "P - Pequeno";
                case 'M': 
                    return "M - Medio";
                case 'G': 
                return "G - Grande";
            }
        },
        returnStatusName: function (status) {
            let statusString = status.toString();
            switch (statusString) {
                case "1":
                    return "A Fazer";
                case "2": 
                    return "Fazendo";
                case "3": 
                    return "Teste";
                case "4":
                    return "Concluído";
            }
        },
        countRows: function (event, keyup = false) {
            let input = $("#" + event.target.id), length = input.val().length, keycode = event.keyCode;
            if (keycode == 13) {
                event.preventDefault();
                if (keyup) {
                    if(event.shiftKey){
                        $(input).val($(input).val() + '\n'); // shift + enter = Quebra linha
                        $(input).scrollTop(10000000);
                        return;
                    }
                    this.sendComment('#desc_comentario');
                }
            }

            if (length <= 30) {
                input.attr("rows", 1);
            } else if (length > 30 && length <= 60) {
                input.attr("rows", 2);
            } else if (length > 60 && length <= 90) {
                input.attr("rows", 3);
            } else {
                input.attr("rows", 4);
            }
        }
    }
}
</script>
<style scoped>
.edit-task-header {
    display: flex;
    justify-content: space-between;
}

.save-task-button, .close-modal-button, .exclude-task-button {
    border-radius: 50%;
    width: 38px;
    height: 38px;
    cursor: pointer;
    border: none;
    border: 2px solid var(--white);
    transition: all 0.4s;
    margin: 0 3px;
}  

.exclude-task-button {
    background: var(--red-high);
    color: var(--red);
}

.exclude-task-button {
    color: var(--red);
}

.save-task-button {
    background: var(--green);
    color: var(--white);
    outline-color: var(--green-low);
    
}

    .save-task-button:hover {
        background: var(--green-low);
    }

    .save-task-button:active {
        border: 2px solid var(--green-low);
    }

.close-modal-button {
    background: var(--gray-high);
    color: var(--black);
    outline-color: var(--gray-low);
}

    .close-modal-button:hover {
        background: var(--gray);
    }

    .close-modal-button:active {
        border: 2px solid var(--gray-low);
    }

.edit-task-body {
    margin-top: -5px;
}

.edit-task {
    width: 40vw;
    min-width: 480px;
    max-width: 880px;
    height: calc(100% - 56px);
    position: fixed;
    right: 0;
    bottom: 0;
    background: var(--white);
    border-left: 1px solid var(--gray);
    z-index: 4;
}

.edit-task-inner {
    overflow-y: scroll;
    overflow-x: hidden;
    height: calc(100% - 60px);
    padding: 20px;
}

.first-input-group {
    align-items: flex-start !important;
}

.input-group {
    display: grid;
    grid-template-columns: 1fr 2fr;
    align-items: center;
    justify-content: space-between;
    padding-right: 1rem;
    margin: 15px 0;
}

    .input-group label {
        margin-right: 1rem;
        color: var(--gray-low);
    }

.task-id {
    font-weight: 600;
    color: var(--gray-low);
    letter-spacing: 1px;
}

.project-name {
    font-weight: 600;
    margin: 5px 0;
}

#task_description {
    border-radius: 6px;
    border: 1px solid var(--gray);
    resize: vertical;
    max-height: 170px;
    min-height: 50px;
    outline-color: transparent;
    transition: outline-color 0.4s;
    padding: 10px;
    font-size: 18px;
}

    #task_description:focus {
        outline-color: var(--gray-low);
    }

.cademint-customized-select {
    border: 1px solid var(--gray);
    border-radius: 6px;
    padding: 10px;
    position: relative;
}

.customized-select-option-group {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    background: var(--white);
    padding: 5px;
    border-radius: 6px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    transition: opacity 0.4s;
    opacity: 0;
    display: none;
    z-index: 6;
}

.customized-select-option-group-wrapper {
    width: 100vw;
    height: 100vh;
    z-index: 5;
    position: fixed;
    top: 0;
    left: 0;
    display: none;
}

.customized-option {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    cursor: pointer;
    transition: background 0.4s;
    padding: 10px;
}

    .customized-option:hover {
        background: var(--gray-high);
    }

    .customized-option img {
        margin-right: 15px;
    }

.customized-select-selected .customized-option, .customized-option.selected {
    margin: 0;
    padding: 0;
}

    .customized-select-selected .customized-option:hover {
        background: var(--white);
    }

.customized-select-icon {
    position: absolute;
    top: 0;
    right: 10px;
    bottom: 0;
    margin: auto;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.priority-text {
    color: var(--red);
}

.footer-list-menu {
    margin-top: 1rem;
    border-bottom: 1px solid var(--gray);
}

    .footer-list-menu ul {
        list-style: none;
        display: inline-block;
    }

        .footer-list-menu ul li {
            cursor: pointer;
        }

.menu-item {
    color: var(--gray);
}

.menu-item.selected {
    color: var(--blue);
}

.menu-underline {
    height: 2px;
    border-radius: 6px;
    margin-top: 7px;
    width: 100%;
    background: var(--blue);
}

.footer-content {
    margin-top: 1rem;
}

.comment {
    border-bottom: 1px solid var(--gray-soft-2);
    padding-bottom: 1.2rem;
    margin-left: 3px;
    padding-right: 3px;
}

.comment:last-child {
    border: none;
}

.comment:not(:first-child) {
    margin-top: 15px;
}

.comment-header {
    display: flex;
    align-items: center;
}

    .comment-header img {
        margin-right: 1rem;
    }

.author-informations {
    display: flex;
    flex-direction: column;
}

.author-name {
    font-weight: 600;
}

.comment-body {
    margin-left: 46px;
}

.comment-text {
    margin: 10px 0;
    overflow: hidden;
    width: 100%;
    display: -webkit-box;
    word-break: break-word;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical; 
}

.comment-like {
    padding: 5px;
    width: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--gray-high);
    transition: all 0.4s;
    border-radius: 6px;
    cursor: pointer;
}

    .comment-like:hover {
        background: var(--gray);
    }

.liked {
    background: var(--gray);
}

.unliked {
    background: var(--gray-high);
}

.like-icon {
    font-size: 20px;
}

.comment-like-count {
    margin-left: 7px;
}

.comment-input {
    border-radius: 0 0 6px 6px;
    width: 100%;
    background: var(--gray-soft);
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    padding: 20px;
    box-shadow: 0 0 1px solid var(--gray);
}

    .comment-input textarea {
        outline: none;
        padding: 5px;
        border: none;
        border-radius: 10px 0 0 10px;
        width: calc(100% - 55px);
        resize: none;
        min-height: 40px;
        max-height: 100px;
    }

.send-icon {
    position: absolute;
    right: 20px;
    background: var(--white);
    height: calc(100% - 40px);
    width: 55px;
    border-radius: 0 10px 10px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

@media (max-width: 500px) {
    .unliked {
        background: var(--gray-high) !important;
    }

    .edit-task {
        width: 100vw;
        min-width: auto;
    }

    .input-group {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        padding: 0;
    }

    .input-group input, .input-group textarea, .input-group .cademint-customized-select {
        width: 100%;
    }
}
</style>