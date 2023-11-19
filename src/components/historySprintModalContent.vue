<template>
    <div class="sprint-history">
        <div class="sprint" v-for="(sprint, index) in historicSprints" :key="index">
            <div class="sprint-informations">
                <p><strong>Id:</strong> {{ sprint.id }}</p>
                <p><strong>Nome:</strong> {{ sprint.name }}</p>
                <p><strong>Horas totais: </strong> {{ sprint.sprint_total_hours }}</p>
            </div>
            <div class="sprint-users">
                <div class="user" v-for="user in sprint.sprint_hours" :key="user.id">
                    <div class="user-informations">
                        <img :src="user.profile_photo" class="avatar-p">
                        <span>{{ user.user_name }}</span>
                    </div>
                    <p class=user-spent-hours>{{ user.spent_hours }}h</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
//import $ from 'jquery';

export default {
    name: "historySprintModalContent",
    data() {
        return {
            historicSprints: [
                {
                    id: 1,
                    name: "Dominar o mundo",
                    sprint_hours: [
                        {
                            id: 1,
                            user_name: "Saymon",
                            profile_photo: "https://scrum-cademint-storage.s3.us-west-1.amazonaws.com/2021-12-30T21_20_49.857Z126018478_1648490771979717_7245151950313189709_o.jpg",
                            spent_hours: 20
                        },
                        {
                            id: 1,
                            user_name: "João marques",
                            profile_photo: "https://scrum-cademint-storage.s3.us-west-1.amazonaws.com/2021-12-30T21_20_49.857Z126018478_1648490771979717_7245151950313189709_o.jpg",
                            spent_hours: 20
                        }
                    ],
                    sprint_total_hours: 40
                }
            ]
        }
    },
    methods: {
        
    }
}
</script>
<style scoped>
.sprint-informations {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
}

.sprint {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    border-bottom: 1px solid var(--gray-high);
}

    .sprint:last-child {
        border: none;
    }

.sprint-users {
    margin: 1rem 0;
}

.sprint-users, .user, .user-informations {
    display: flex;
    align-items: center;
}

.user-informations {
    margin-right: 1rem;
}

.user-informations .avatar-p {
    margin-right: .5rem;
}

.user-informations span {
    font-weight: 600;
}

.user {
    margin: 0 1rem;
}
</style>