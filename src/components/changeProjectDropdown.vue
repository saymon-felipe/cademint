<template>
    <div class="change-project">
        <div class="current-project" v-on:click="toggleProjectsContainer = !toggleProjectsContainer">
            <span class="material-icons">sync</span>
            <div class="current-project-informations">
                <div class="project-image small background-image" :style="`background-image: url('${selectedProject.image}')`"></div>
                <span>{{ selectedProject.group_name }}</span>
            </div>
            <div class="project-members">
                <div v-for="(member, index) in selectedProject.group_members" :key="index">
                    <div class="avatar-pp background-image" :title="member.nome" v-if="index < 3" :style="`background-image: url('${member.profile_photo}')`"></div>
                </div>
                <div class="more-users" v-if="selectedProject.group_members.length > 3">
                    + {{ selectedProject.group_members.length - 3 }}
                </div>
            </div>
        </div>
        <div class="projects-wrapper" v-if="toggleProjectsContainer" v-on:click="toggleProjectsContainer = !toggleProjectsContainer"></div>
        <div class="projects-list" v-if="toggleProjectsContainer">
            <div class="my-projects">
                <div class="my-projects-header">
                    <p class="font-size-h5">Meus projetos</p>
                    <div class="input-search">
                        <input type="text" placeholder="Procurar" v-model="filterMyProjectsString" />
                    </div>
                </div>
                <ProjectListComponent :project="project" @selected="selectThisGroup($event.id, $event.name)" :isSelected="isSelectedProject(project.groups_id)" v-for="(project, index) in filteredMyProjects" :key="index" />
            </div>
            <div class="other-projects" v-if="otherProjects.length > 0">
                <div class="my-projects-header">
                    <p class="font-size-h5">Projetos que faço parte</p>
                    <div class="input-search">
                        <input type="text" placeholder="Procurar" v-model="filterOtherProjectsString" />
                    </div>
                </div>
                <ProjectListComponent :project="project" @selected="selectThisGroup($event.id, $event.name)" :isSelected="isSelectedProject(project.groups_id)" v-for="(project, index) in filteredOtherProjects" :key="index" />
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
                currentProject: null,
                filterMyProjectsString: "",
                filterOtherProjectsString: "",
                filteredMyProjects: [],
                filteredOtherProjects: [],
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
        watch: {
            "$root.user": {
                handler() {
                    this.filterMyProjects();
                    this.filterOtherProjects();
                },
                deep: true
            },
            filterMyProjectsString: function () {
                this.filterMyProjects();
                
            },
            filterOtherProjectsString: function () {
                this.filterOtherProjects();
            },
            toggleProjectsContainer: function () {
                if (this.toggleProjectsContainer) {
                    this.$nextTick(() => {
                        let selectedProject = $(".project.selected");
                
                        if (selectedProject.length > 0) {
                            selectedProject[0].scrollIntoView({ behavior: "smooth" });
                        }
                    })
                }
            }
        },
        methods: {
            filterMyProjects: function () {
                this.filteredMyProjects = this.myProjects.filter((project) => {
                    let condition = project.group_name.toLowerCase().includes(this.filterMyProjectsString.toLowerCase()) ||
                                    project.group_description.toLowerCase().includes(this.filterMyProjectsString.toLowerCase());

                    return condition;
                })
            },
            filterOtherProjects: function () {
                this.filteredOtherProjects = this.otherProjects.filter((project) => {
                    let condition = project.group_name.toLowerCase().includes(this.filterOtherProjectsString.toLowerCase()) ||
                                    project.group_description.toLowerCase().includes(this.filterOtherProjectsString.toLowerCase());

                    return condition;
                })
            },
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

            this.filteredMyProjects = this.myProjects;
            this.filteredOtherProjects = this.otherProjects;
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

.my-projects-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-4);
    white-space: nowrap;
    gap: var(--space-4);

    & input {
        width: 200px !important;
    }

    & > p {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: 100%;
        flex-grow: 1;
        min-width: 0;
    }
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
    width: 98vw;
    max-width: 500px;
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

    & .background-image {
        margin-left: -.7rem;
    }
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