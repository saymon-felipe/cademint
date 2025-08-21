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
                            <div class="customized-option" :class="selected_sponsor[0].id_usuario == member.id_usuario ? 'selected' : ''" :user_id="member.id_usuario" v-for="(member, index) in group.group_members" :key="index" v-on:click="selected_sponsor = [member, '']; toggleSponsorSelect(); computeChanges('sponsor', member.id_usuario, member.nome)">
                                <img :src="member.profile_photo" class="avatar-pp">
                                <span>{{member.nome}}</span>
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
                            <div class="customized-option" priority="1" :class="selected_priority == 1 ? 'selected' : ''" v-on:click="selected_priority = 1; togglePrioritySelect(); computeChanges('priority', 1)">
                                <span>Normal</span>
                            </div>
                            <div class="customized-option" priority="2" :class="selected_priority == 2 ? 'selected' : ''" v-on:click="selected_priority = 2; togglePrioritySelect(); computeChanges('priority', 2)">
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
                            <div class="customized-option" size="P" :class="selected_size == 'P' ? 'selected' : ''" v-on:click="selected_size = 'P'; toggleSizeSelect(); computeChanges('size', 'P')">
                                <span>P - Pequeno</span>
                            </div>
                            <div class="customized-option" size="M" :class="selected_size == 'M' ? 'selected' : ''" v-on:click="selected_size = 'M'; toggleSizeSelect(); computeChanges('size', 'M')">
                                <span>M - Medio</span>
                            </div>
                            <div class="customized-option" size="G" :class="selected_size == 'G' ? 'selected' : ''" v-on:click="selected_size = 'G'; toggleSizeSelect(); computeChanges('size', 'G')">
                                <span>G - Grande</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="input-group">
                    <label>Status</label>
                    <div class="cademint-customized-select">
                        <span v-if="statusList.length == 0" style="color: var(--gray)">Carregando status...</span>
                        <div v-else class="customized-select-selected" v-on:click="toggleStatusSelect()">
                            <div class="customized-option" :status="selected_status">
                                <span>{{returnStatusName(selected_status)}}</span>
                            </div>
                            <span class="material-icons customized-select-icon">expand_more</span>
                        </div>
                        <div class="customized-select-option-group status-select">
                            <div v-for="(column, index) in statusList" :key="index" class="customized-option" :status="column.id" :class="selected_status == column.id ? 'selected' : ''" v-on:click="selected_status = column.id; toggleStatusSelect(); computeChanges('status', column.id)">
                                <span>{{ column.name }}</span>
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
                <div class="tabs-list-menu">
                    <ul>
                        <li class="menu-item selected font-size-3" id="footer-comments" v-on:click="selectFooterMenu(0)">
                            Comentários
                            <div class="menu-underline"></div>
                        </li>
                        <li class="menu-item font-size-3" style="display: none;" id="footer-hours" v-on:click="selectFooterMenu(1)">
                            Horas
                            <div class="menu-underline"></div>
                        </li>
                    </ul>
                </div>
                <div class="tabs-content">
                    <div class="comments-list" v-if="task.id != undefined && viewComments">
                        <div class="comment" v-for="(comment, index) in task_comments" :key="index" :id="'comment-' + index">
                            <div class="comment-header">
                                <div class="comment-header-inner">
                                    <div class="author-photo">
                                        <img :src="comment.criador_imagem" class="avatar-pp">
                                    </div>
                                    <div class="author-informations">
                                        <span class="author-name">{{comment.criador_nome}}</span>
                                        <span class="comment-create-time font-size-5">{{ formatDate(comment.data_criacao_comentario) }}</span>
                                    </div>
                                </div>
                                <div class="comment-options-wrapper" v-on:click="toggleCommentContainer(index)"></div>
                                <span class="material-icons comment-options" v-on:click="toggleCommentContainer(index)" v-if="comment.criador_comentario == $root.user.id_usuario">more_vert</span>
                                <div class="comment-options-container">
                                    <ul>
                                        <li v-on:click="handleEditComment(index)">Editar</li>
                                        <li v-on:click="deleteComment(comment.id_comentario)">Excluir</li>
                                    </ul>
                                </div>
                            </div>
                            <div class="comment-body">
                                <div class="comment-text">
                                    <span :ref="'commentText-' + index" v-html="formatLinks(comment.desc_comentario)" :class="{ 'expanded': comment.isExpanded }"></span>
                                    <textarea v-model="comment.desc_comentario" rows="5" v-on:focusout="handleSaveComment(comment, index)"></textarea>
                                    <button
                                        v-if="comment.needsTruncation"
                                        @click="toggleCommentExpansion(comment)"
                                        class="expand-collapse-button"
                                    >
                                        {{ comment.isExpanded ? 'Ler menos' : 'Ler mais' }}
                                    </button>
                                </div>
                                <div class="comment-like" v-on:click="commentLike(comment.id_comentario)" :class="comment.user_has_liked == 1 ? 'liked' : 'unliked'">
                                    <span class="material-icons like-icon">thumb_up</span>
                                    <span class="comment-like-count">{{ comment.curtidas_comentario }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="task-hours" v-if="viewHours">
                        Horas da tarefa
                    </div>
                </div>
            </div>
        </div>
        <div class="comment-input">
            <textarea name="message" id="desc_comentario" placeholder="Faça um comentário" maxlength="1000" rows="1" v-on:keydown="countRows($event)" v-on:keyup="countRows($event, true); handleSendComment($event)"></textarea>
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
            selected_status: this.task.status_os,
            task_create_date: this.task.task_create_date,
            haveChanges: false,
            changed_task: {},
            task_comments: [],
            viewComments: true,
            viewHours: false,
            statusList: []
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
        this.returnColumns();
    },
    methods: {
        returnColumns: function () {
            let self = this;

            api.post("/projects/columns", {
                project_id: self.group.group_id
            })
            .then((response) => {
                self.statusList = response.data.returnObj;
            })
        },
        handleEditComment: function (index) {
            let textarea = $("#comment-" + index + " textarea");

            textarea.show();
            $("#comment-" + index + " .comment-text span").hide();
            $("#comment-" + index + " .expand-collapse-button").hide();

            this.toggleCommentContainer(index);

            setTimeout(() => {
                textarea.focus();
            }, 1)
        },
        handleSaveComment: function (comment, index) {
            let self = this, jwt = "Bearer " + self.getJwtFromLocalStorage();
            let data = {
                comment: comment
            }

            api.post("/task/edit_task_comment", data, {
                headers: {
                    Authorization: jwt
                }
            })
            .then(function(){
                $("#comment-" + index + " textarea").hide();
                $("#comment-" + index + " .comment-text span").show();
            }).catch(function(error){
                console.log(error)
            })
        },
        toggleCommentContainer: function (index) {
            let commentOptions = $("#comment-" + index + " .comment-options-container");
            let wrapper = $("#comment-" + index + " .comment-options-wrapper");
            
            if (commentOptions.is(":visible")) {
                commentOptions.hide();
                wrapper.hide();
            } else {
                commentOptions.show();
                wrapper.show();
            }
        },
        selectFooterMenu: function (menuItem) {
            this.viewComments = false;
            this.viewHours = false;

            let comments = $("#footer-comments");
            let hours = $("#footer-hours");

            comments.removeClass("selected");
            hours.removeClass("selected");

            switch (menuItem) {
                case 0: 
                    this.viewComments = true;
                    comments.addClass("selected");
                    break;
                case 1:
                    this.viewHours = true;
                    hours.addClass("selected");
                    break;
            }
        },
        setSelectedSponsor: function (sponsor_id) {
            let member = this.group.group_members.filter(member => {return member.id_usuario == sponsor_id});

            this.selected_sponsor = member;
        },
        deleteTask: function () {
            let self = this, jwt = "Bearer " + self.getJwtFromLocalStorage();
            api.delete("/task/delete_os", { data: {id: self.task.id}, headers: {Authorization: jwt}})
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

            api.post("/task/like_task_comment", data, {
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
        handleSendComment: function (event) {
            let keycode = event.keyCode;

            if (keycode == "Enter") {
                this.sendComment("#desc_comentario");
            }
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
            
            api.post("/task/task_comment", comment, {
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
        deleteComment: function (comment_id) {
            let self = this;
            
            api.delete("/task/delete_task_comment/" + comment_id)
            .then(function(){
                self.loadTaskComments(true);
            }).catch(function(error){
                console.log(error)
            })
        },
        loadTaskComments: function (programatic = false) {
            let self = this, jwt = "Bearer " + self.getJwtFromLocalStorage();
            let data = {
                id_task: self.task.id
            }
            api.post("/task/get_task_comment", data, {
                headers: {
                    Authorization: jwt
                }
            })
            .then(function(response){
                self.task_comments = response.data.returnObj.comentarios.map(comment => {
                    return {
                        ...comment,
                        isExpanded: false,
                        needsTruncation: false
                    };
                });

                self.$nextTick(() => {
                    self.checkCommentTruncation();
                });
                
                if (programatic) {
                    self.$nextTick(() => { // Garante que o scroll ocorra após a renderização e o cálculo de truncamento
                        $(".edit-task-inner").animate({
                            scrollTop: 9999999
                        }, 500);
                    });
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

            api.patch("/task", self.changed_task, {
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
            let column = this.statusList.filter((column) => { return column.id == status });

            return column[0].name;
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
        },
        toggleCommentExpansion(comment) {
            this.$set(comment, 'isExpanded', !comment.isExpanded);
            if (comment.isExpanded) {
                this.$nextTick(() => {
                    const commentElement = $(`#comment-${this.task_comments.indexOf(comment)}`);
                    if (commentElement.length) {
                        const innerContainer = $(".edit-task-inner");
                        const currentScrollTop = innerContainer.scrollTop();
                        const commentOffsetTop = commentElement.position().top;
                        const commentHeight = commentElement.outerHeight();
                        const containerHeight = innerContainer.height();

                        if ((commentOffsetTop + commentHeight) > (currentScrollTop + containerHeight)) {
                            innerContainer.animate({
                                scrollTop: currentScrollTop + (commentOffsetTop + commentHeight) - (currentScrollTop + containerHeight) + 20
                            }, 300);
                        }
                    }
                });
            }
        },
        checkCommentTruncation(indexToCheck = null) {
            this.$nextTick(() => {
                const comments = indexToCheck !== null ? [this.task_comments[indexToCheck]] : this.task_comments;

                comments.forEach((comment) => {
                    const actualIndex = indexToCheck !== null ? indexToCheck : this.task_comments.indexOf(comment);
                    const commentSpan = this.$refs[`commentText-${actualIndex}`];

                    if (commentSpan && commentSpan.length > 0) {
                        const spanElement = commentSpan[0];
                        const originalIsExpanded = comment.isExpanded;

                        this.$set(comment, 'isExpanded', false);
                        
                        this.$nextTick(() => {
                            const isTruncated = spanElement.scrollHeight > spanElement.clientHeight;
                            this.$set(comment, 'needsTruncation', isTruncated);
                            this.$set(comment, 'isExpanded', originalIsExpanded);
                        });
                    }
                });
            });
        },
    }
}
</script>

<style scoped>
.edit-task-header {
    display: flex;
    justify-content: space-between;
}

.modal-header-buttons {
    display: flex;
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
    height: calc(100% - 64px);
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
    position: relative;
}

.customized-select-option-group {
    position: absolute;
    top: calc(100% + 10px);
    left: 0;
    background: var(--white);
    border-radius: 6px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    transition: opacity 0.4s;
    opacity: 0;
    display: none;
    z-index: 6;
    gap: 5px;
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
    cursor: pointer;
    transition: background 0.4s;
    padding: 14px;
}

    .customized-option:hover {
        background: var(--gray-high);
    }

    .customized-option img {
        margin-right: 15px;
    }

.customized-select-selected .customized-option {
    border-radius: 6px;
}

.customized-option.selected {
    background: var(--blue-high-2);
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
    justify-content: space-between;
}

.comment-options {
    cursor: pointer;
}

.comment-options-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: none;
}

.comment-options-container {
    position: absolute;
    top: 100%;
    right: 10px;
    background: var(--white);
    border-radius: 8px;
    box-shadow: 0 0 16px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    display: none;
}

    .comment-options-container ul {
        list-style: none;
    }

        .comment-options-container ul li {
            cursor: pointer;
            padding: 10px;
        }

            .comment-options-container ul li:hover {
                background: var(--gray-soft-2);
            }

.comment-header, .comment-header-inner {
    display: flex;
    align-items: center;
    position: relative;
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
    width: 100%;
}

.comment-text span {
    overflow: hidden;
    display: -webkit-box;
    word-break: break-word;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical; 
}

    .comment-text textarea {
        display: none;
    }

.comment-text span.expanded {
    -webkit-line-clamp: unset; 
    display: block; 
}

.expand-collapse-button {
    background: none;
    border: none;
    color: var(--blue-low);
    cursor: pointer;
    font-size: 14px;
    padding: 0;
    margin-top: 5px;
    display: block;
    text-align: left;
}

.expand-collapse-button:hover {
    text-decoration: underline;
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
    padding: 7px;
    box-shadow: 0 0 1px solid var(--gray);
}

    .comment-input textarea {
        outline: none;
        padding: 5px;
        margin: 5px;
        border: none;
        border-radius: 10px;
        overflow: hidden;
        width: 100%;
        resize: none;
        min-height: 40px;
        max-height: 100px;
    }

.send-icon {
    position: absolute;
    right: 12px;
    background: var(--white);
    height: calc(100% - 24px);
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