<template>
    <div class="exclude-group-wrapper">
        <div class="exclude-group-modal">
            <p class="font-size-2-bold">Tem certeza que deseja excluir o grupo?</p>
            <div class="buttons">
                <button class="confirm" v-on:click="excludeGroup()">Sim, excluir</button>
                <button class="cancelate" v-on:click="hideModal()">Não, cancelar</button>
            </div>
        </div>
        <div class="overlay" v-on:click="hideModal()"></div>
    </div>
</template>
<script>
import { globalMethods } from '../js/globalMethods';
import $ from 'jquery';
import api from '../configs/api.js';

export default {
    name: "excludeGroupModal",
    props: ['exclude', 'group'],
    mixins: [globalMethods],
    methods: {
        showModal: function () {
            let container = $(".exclude-group-modal");
            let overlay = $(".exclude-group-wrapper .overlay");
            container.css("transform", "translateY(0)").css("opacity", 1);
            overlay.show();
        },
        hideModal: function (excluded = false) {
            let container = $(".exclude-group-modal");
            let overlay = $(".exclude-group-wrapper .overlay");
            container.css("transform", "translateY(-100px)").css("opacity", 0);
            setTimeout(() => {
                overlay.hide();
                this.$emit("closeModal");
                if (excluded) {
                    this.$router.push("/home/update-profile");
                }
            }, 400);
        },
        excludeGroup: function () { // Função apaga o grupo solicitado.
            let self = this;
            let current_project = self.getCurrentProjectInLocalStorage();
            let data = {
                groups_id: self.group.group_id
            }
            
            api.post("/projects/delete_group", data)
            .then(function () {
                if (current_project.group_id == self.group.group_id) { // Se o id do grupo que está sendo excluido for igual ao que está em session storage, o que está armazenado é deletado.
                    self.removeCurrentProjectInLocalStorage();
                }
                self.hideModal(true);
            }).catch((error) => {
                console.log(error)
            })
        },
    },
    mounted: function () {
        setTimeout(() => {
            this.showModal();
        }, 10);
    }
}
</script>
<style scoped>
.overlay {
    z-index: 998;
}

.exclude-group-wrapper {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
}

.exclude-group-modal {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 95%;
    height: fit-content;
    max-width: fit-content;
    background: var(--white);
    padding: 1rem;
    border: 1px solid var(--gray);
    border-radius: 10px;
    transition: all 0.4s;
    transform: translateY(-100px);
    opacity: 0;
    z-index: 999;
}

.buttons {
    margin-top: .5rem;
    display: flex;
    justify-content: center;
}

    .buttons button {
        padding: 6px 10px;
        border-radius: 6px;
        border: none;
        cursor: pointer;
        margin: 5px;
        transition: all 0.4s;
    }

.confirm:hover {
    background: var(--gray-high);
}

.cancelate {
    background: var(--blue);
    color: var(--white);
}

    .cancelate:hover {
        background: var(--blue-low);
    }
</style>
