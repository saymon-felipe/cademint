<template>
    <div class="project" :class="isSelected ? 'selected' : ''" v-on:click="selectProject()">
        <div class="project-header">
            <img class="project-image" :src="project.image">
            <div class="project-informations">
                <span>
                    <span class="status-item" :class="chooseProjectStatus(project.status)" :title="chooseProjectStatus(project.status, true)"></span>
                    <span class="font-size-4">{{ project.group_name }}</span>
                </span>
                <p class="font-size-6" v-if="project.group_description != ''" style="color: var(--gray);">{{ project.group_description }}</p>
            </div>
        </div>
        <div class="project-members">
            <div v-for="(member, index) in project.group_members" :key="index">
                <img v-if="index < 3" :src="member.profile_photo" class="avatar-pp" :title="member.nome">
            </div>
            <div class="more-users" v-if="project.group_members.length > 3">
                + {{ project.group_members.length - 3 }}
            </div>
        </div>
    </div>
</template>
<script>
import { globalMethods } from '../js/globalMethods';

    export default {
        name: "projectListComponent",
        props: ["project", "isSelected"],
        mixins: [globalMethods],
        methods: {
            selectProject: function () {
                this.$emit("selected", { id: this.project.groups_id, name: this.project.group_name });
            }
        }
    }
</script>
<style scoped>
.status-item {
    padding-left: 15px;

    &::before {
        left: 10px;
    }
}

.selected {
    background: var(--blue-high-2) !important;
}

.project-image {
    width: 50px;
    height: 47px;
    border-radius: 6px;
    object-fit: cover;
    border: 1px solid var(--gray-soft);
    flex-shrink: 0;
}

.project-header {
    display: flex;
    align-items: center;
    flex-grow: 1;
    min-width: 0;
}

.project {
    padding: .5rem 1rem;
    margin: .5rem 0;
    border-bottom: 1px solid var(--gray-soft);
    color: var(--black);
    cursor: pointer;
    position: relative;
    justify-content: space-between;
    width: 100%;

    &:hover {
        background: var(--gray-high);
    }

    &:last-child {
        border: none;
    }
}

.project-informations {
    flex-direction: column;
    align-items: flex-start !important;
    flex-grow: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    & p {
        padding-left: 33px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
}

.project, .project-informations, .project-members {
    display: flex;
    align-items: center;
}

.project-members {
    margin-left: 2rem;

    & .more-users {
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
        flex-shrink: 0;
    }

    & img {
        margin-left: -.7rem;
        margin-bottom: -3px;
        flex-shrink: 0;
    }
}
</style>