<template>
    <div class="sprint-configuration">
        <div class="tabs-list-menu">
            <ul>
                <li class="menu-item selected font-size-3" id="sprint" v-on:click="selectFooterMenu(0)">
                    Sprint
                    <div class="menu-underline"></div>
                </li>
                <li class="menu-item font-size-3" id="users" v-on:click="selectFooterMenu(1)">
                    Usuarios
                    <div class="menu-underline"></div>
                </li>
            </ul>
        </div>
        <div class="tabs-content">
            <form @submit.prevent="setSprint()">
                <div class="sprint" v-if="sprint">
                    <div class="form-group">
                        <label for="sprint-name">Nome</label>
                        <input type="text" maxlength="50" id="sprint-name" v-model="sprintName" placeholder="Ex. Dominar o mundo..." required>
                    </div>
                    <div class="form-group">
                        <label for="sprint-number">Número</label>
                        <input type="text" id="sprint-number" disabled="disabled" v-model="currentSprint.sprintNumber">
                    </div>
                    <div class="form-group">
                        <label for="sprint-period">Período</label>
                        <div class="range-container">
                            <input type="range" id="sprint-period" min="5" max="30" step="5" v-model="rangeValue" @input="changeRange()" required>
                            <span>{{ rangeCounter }}</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="sprint-period">Horas por usuario por dia</label>
                        <div class="range-container">
                            <input type="number" id="sprint-hours" v-model="hours_day_user" required>
                        </div>
                    </div>
                </div>
                <div class="users" v-if="users">
                    <label>Membros do grupo</label>
                    <div class="group-member" v-for="(user, index) in groupUsers" v-bind:key="index">
                        <div class="user-informations">
                            <img :src="user.profile_photo" class="avatar-p">
                            <span>{{ user.nome }}</span>
                        </div>
                        <div class="user-hours">
                            <label for="user-hours">Horas no sprint</label>
                            <input type="number" id="user-hours" v-model="user.horas" placeholder="Ex. 2" required>
                        </div>
                    </div>
                </div>
                <button type="submit" class="hidden-input" id="save-modal-data">Criar sprint</button>
            </form>
        </div>
    </div>
</template>
<script>
import $ from 'jquery';

export default {
    name: "sprintModalContent",
    data() {
        return {
            rangeCounter: "15 dias",
            rangeValue: 15,
            hours_day_user: 2,
            sprintName: "",
            groupUsers: [
                {
                    id: 1,
                    nome: "Saymon",
                    profile_photo: "https://m.media-amazon.com/images/I/71WbcekHTbL._AC_UF1000,1000_QL80_.jpg",
                    horas: 20
                }
            ],
            currentSprint: {
                sprintNumber: "Gerado automaticamente"
            },
            sprint: true,
            users: false
        }
    },
    methods: {
        selectFooterMenu: function (menuItem) {
            this.sprint = false;
            this.users = false;

            let sprint = $("#sprint");
            let users = $("#users");

            sprint.removeClass("selected");
            users.removeClass("selected");

            switch (menuItem) {
                case 0: 
                    this.sprint = true;
                    sprint.addClass("selected");
                    break;
                case 1:
                    this.users = true;
                    users.addClass("selected");
                    break;
            }
        },
        changeRange: function () {
            this.rangeCounter = this.rangeValue + " dias";
        },
        setSprint: function () {
            let sprintPeriod = this.rangeValue;
            let sprintName = this.sprintName;
            let sprintUsers = this.groupUsers;

            let data = {
                name: sprintName,
                period: sprintPeriod,
                users: sprintUsers
            }

            if ($('form')[0].checkValidity()) {
                $(".modal-body").addClass("valid");
                console.log(data)
                setTimeout(() => {
                    this.$emit("saved", true);
                }, 2000)
            }
        }
    }
}
</script>
<style scoped>

    label {
        font-weight: 600;
        margin-bottom: 5px;
        display: inline-block;
    }

    .form-group {
        margin-bottom: .7rem;
    }

    .range-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .group-member {
        margin: .5rem 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .user-informations {
        display: flex;
        align-items: center;
    }

        .user-informations img {
            margin-right: .7rem;
        }

    .user-hours {
        display: flex;
        flex-direction: column;
    }

        .user-hours input {
            margin: 0 !important;
        }
</style>