<template>
    <div class="change-project">
        <div class="current-project" v-on:click="toggleProjectsContainer = !toggleProjectsContainer">
            <span class="material-icons">sync</span>
            <div class="current-project-informations">
                <img class="project-image small" :src="selectedProject.image">
                <span>{{ selectedProject.group_name }}</span>
            </div>
            <div class="project-members">
                <div v-for="(member, index) in selectedProject.group_members" :key="index">
                    <img v-if="index < 3" :src="member.profile_photo" class="avatar-pp" :title="member.nome">
                </div>
                <div class="more-users" v-if="selectedProject.group_members.length > 3">
                    + {{ selectedProject.group_members.length - 3 }}
                </div>
            </div>
        </div>
        <div class="projects-wrapper" v-if="toggleProjectsContainer" v-on:click="toggleProjectsContainer = !toggleProjectsContainer"></div>
        <div class="projects-list" v-if="toggleProjectsContainer">
            <div class="my-projects">
                <p class="font-size-h5">Meus projetos</p>
                <ProjectListComponent :project="project" @selected="selectThisGroup($event.id, $event.name)" :isSelected="isSelectedProject(project.groups_id)" v-for="(project, index) in myProjects" :key="index" />
            </div>
            <div class="other-projects" v-if="otherProjects.length > 0">
                <p class="font-size-h5">Projetos que faço parte</p>
                <ProjectListComponent :project="project" @selected="selectThisGroup($event.id, $event.name)" :isSelected="isSelectedProject(project.groups_id)" v-for="(project, index) in otherProjects" :key="index" />
            </div>
        </div>
    </div>
</template>
<script>
import { globalMethods } from '../js/globalMethods';
import ProjectListComponent from './projectListComponent.vue';
import $ from 'jquery';

    export default {
        name: "changeProjectDropdown",
        props: ["gid"],
        mixins: [globalMethods],
        data() {
            return {
                selectedProject: this.$root.user.user_groups[0],
                toggleProjectsContainer: false,
                currentProject: null
            }
        },
        watch: {
            toggleProjectsContainer: function () {
                if (this.toggleProjectsContainer) {
                    this.$nextTick(() => {
                        let selectedProject = $(".project.selected");
                
                        if (selectedProject.length > 0) {
                            selectedProject[0].scrollIntoView();
                        }
                    })
                }
            }
        },
        computed: {
            myProjects: function () {                
                return this.$root.user.user_groups.filter((group) => { return group.group_owner == this.$root.user.id_usuario })
            },
            otherProjects: function () {
                return this.$root.user.user_groups.filter((group) => { return group.group_owner != this.$root.user.id_usuario })
            }
        },
        methods: {
            isSelectedProject: function (group_id) {
                return group_id == this.selectedProject.groups_id;
            },
            checkProjectInLocalStorage: function () {
                let project = this.getCurrentProjectInLocalStorage();

                if (project == undefined || project == null) {
                    this.setCurrentProjectInLocalStorage(this.selectedProject.groups_id, this.selectedProject.group_name);
                }

                project = this.getCurrentProjectInLocalStorage();

                this.selectedProject = this.$root.user.user_groups.filter((group) => { return group.groups_id == project.group_id })[0];
            },
            selectThisGroup: function (group_id, group_name) {
                this.setCurrentProjectInLocalStorage(group_id, group_name);
                this.selectedProject = this.$root.user.user_groups.filter((group) => { return group.groups_id == group_id })[0];
                this.toggleProjectsContainer = !this.toggleProjectsContainer;
            }
        },
        mounted: function () {
            this.checkProjectInLocalStorage();
        },
        components: {
            ProjectListComponent
        }
    }
</script>
<style scoped>
.projects-wrapper {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 5;
}

.project-image {
    width: 30px;
    height: 27px;
    border-radius: 6px;
    object-fit: cover;
    flex-shrink: 0;
}

.current-project {
    background: var(--blue);
    border-radius: 6px;
    padding: .3rem .8rem;
    color: var(--white);
    cursor: pointer;
    position: relative;
    display: grid;
    align-items: center;
    justify-content: center;
    grid-auto-flow: column;

    & > span {
        margin-right: .7rem;
    }
}

.current-project-informations, .project-members {
    display: flex;
    align-items: center;
}

.current-project-informations {    
    & span {
        margin: 0 .5rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 150px;
    }
}

.projects-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin: auto;
    width: fit-content;
    max-width: 100vw;
    background: var(--white);
    border-radius: 6px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
    z-index: 6;
    max-height: 50vh;
    overflow-y: auto;
    overflow-x: hidden;
}

.project-members {
    margin-left: 1rem;
    float: right;

    & .more-users {
        color: var(--black);
        background: var(--yellow);
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-left: -.7rem;
        position: relative;
        z-index: 2;
        box-shadow: 0 0 0 3px var(--blue);
    }

    & img {
        margin-left: -.7rem;
        margin-bottom: -3px;
    }
}

.my-projects > p, .other-projects > p {
    padding-left: 1rem;
    padding-top: 1rem;
}

@media (max-width: 720px) {
    .current-project-informations {    
        min-width: 0;
    }

    .projects-list {
        max-height: calc(100vh - 56.59px);
    }
}
</style>