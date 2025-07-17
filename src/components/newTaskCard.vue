<template>
    <div class="card-container new-task-object">
        <div class="new-card-wrapper" v-on:click="closeNewTask"></div>
        <div class="card-task">
            <textarea name="task_description" v-model="task_description" id="task-description" cols="30" rows="5" v-on:keydown="closeNewTask($event, '#task-description', true)" placeholder="Escreva a descrição da tarefa..."></textarea>
            <span class="material-icons sponsor-icon" v-if="sponsor_photo == ''" v-on:click="toggleMembersContainer">person</span>
            <img class="user-image-preview avatar-p" v-if="sponsor_photo != ''" :src="sponsor_photo" v-on:click="toggleMembersContainer" />
        </div>
        <div class="new-task-members-wrapper" v-on:click="toggleMembersContainer"></div>
        <div class="new-task-members">
            <div class="project-member" v-for="(member, index) in group_users" :key="index" v-on:click="selectSponsor(member)">
                <img :src="member.profile_photo" class="avatar-p">
                <span>{{member.nome}}</span>
            </div>
        </div>
    </div>    
</template>
<script>
import $ from 'jquery';
import {globalMethods} from '../js/globalMethods.js';
import moment from 'moment';
import api from '../configs/api.js';

export default {
    name: "newTaskCard",
    data() {
        return {
            task_description: "",
            sponsor_id: 2, // Id do usuario "QUALQUER"
            sponsor_photo: "",
            creating_task: false
        }
    },
    props: ["group_users", "user", "card_status"],
    mixins: [globalMethods],
    methods: {
        selectSponsor: function (sponsor) {
            this.sponsor_id = sponsor.id_usuario;
            this.sponsor_photo = sponsor.profile_photo;
            this.toggleMembersContainer();
        },
        toggleMembersContainer: function () {
            let newTaskMembers = $(".new-task-members");
            let newTaskMembersWrapper = $(".new-task-members-wrapper");
            if (newTaskMembers.is(":visible")) {
                newTaskMembers.css("opacity", 0);
                newTaskMembersWrapper.hide();
                setTimeout(() => {
                    newTaskMembers.hide();
                }, 400);
            } else {
                newTaskMembers.show();
                newTaskMembersWrapper.show();
                setTimeout(() => {
                    newTaskMembers.css("opacity", 1);
                }, 10);
            }
        },
        closeNewTask: function (event = null, input_id = null, keydown = false) {
            let key = event.keyCode, input = $(input_id);

            if (keydown) {
                if(event.shiftKey && key == 13){
                    event.preventDefault();
                    $(input).val($(input).val() + '\n'); // shift + enter = Quebra linha
                    $(input).scrollTop(10000000);
                    return;
                }

                if (key != 13) {
                    return;
                }
            }

            let promises = [];
            
            if (this.task_description.trim().length > 0) {
                let temporary_task = {
                    desc_os: this.task_description,
                    sponsor: this.sponsor_id,
                    priority: 1,
                    size: 'P',
                    task_create_date: moment().format(),
                    user_owner: this.user.id_usuario,
                    user_owner_name: this.user.nome,
                    status_os: this.card_status,
                    group_id: this.getCurrentProjectInLocalStorage("new-card").group_id
                }

                promises.push(
                    this.createInitialTask(temporary_task)
                )
            } else {
                promises.push(new Promise((resolve) => { resolve(); }));
            }

            Promise.all(promises).then(() => {
                this.resetCardBeforeClose();
                this.$emit("closeTask");
            })
        },
        createInitialTask: function (task_object) {
            return new Promise((resolve) => {
                let self = this;

                if (!this.creating_task) {
                    this.creating_task = true;
                } else {
                    return;
                }

                api.post("/task", task_object)// Requisição cria nova tarefa com os dados do formulário.
                .then(function(response){
                    resolve();
                    self.$emit("closeTask", response.data.returnObj.created_task);
                }).catch(function(error){
                    console.log(error)
                })
            })
        },
        resetCardBeforeClose: function () {
            this.task_description = "";
            this.sponsor_id = 2;
            this.sponsor_photo = "";
            this.creating_task = false;
        }
    },
    mounted() {
        if (window.innerWidth < 720) {
            $(".card-task #task-description").attr("rows", 4);
        }
    }
}
</script>
<style scoped>
.new-card-wrapper, .new-task-members-wrapper {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 3;
}

.new-task-members-wrapper {
    z-index: 4;
    display: none;
}

.new-task-object .card-task {
    background: var(--white);
    margin-bottom: 10px;
    border-radius: 6px;
    padding: 13px;
    border: 1px solid var(--gray-soft);
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 4;
}

.new-task-object {
    position: relative;
}

.sponsor-icon {
    border-radius: 50%;
    width: 35px;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed var(--gray);
    margin-top: 1rem;
    cursor: pointer;
}

.user-image-preview {
    margin-top: 15px;
    cursor: pointer;
}

#task-description {
    border: 1px solid var(--gray);
    border-radius: 6px;
    resize: none;
    outline: none;
    padding: 10px;
    font-size: 15px;
    transition: all 0.4s;
}

    #task-description:focus {
        box-shadow: 0 0 0 2px var(--gray);
    }

.new-task-members {
    width: 200px;
    background: var(--white);
    border-radius: 6px;
    padding: 10px;
    transition: all 0.4s;
    opacity: 0;
    display: none;
    position: absolute;
    top: 100%;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    z-index: 4;
}

.project-member {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    padding: 7px;
    cursor: pointer;
}

    .project-member:last-child {
        margin-bottom: 0px;
    }

    .project-member:hover {
        background: var(--gray-high);
    }

    .project-member span {
        margin-left: 1rem;
    }

@media (max-width: 720px) {
    .new-task-object .card-task {
        padding: 11px;
    }

    .sponsor-icon, .new-task-members-wrapper, .new-task-members {
        display: none !important;
    }

    .new-task-object .card-task {
        height: 100%;
        width: 230px;
        margin-right: 10px;
    }
}
</style>