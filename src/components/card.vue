<template>
    <div class="card-container">
        <div class="card-loading" v-if="loading_card"></div>
        <div class="card-os" :id="task.id_complete" v-if="!loading_card" @mouseenter="showTooltip(task.id_complete, task.user_owner_name, task.priority, task.size)" @mouseleave="hideTooltip()">
            <router-link :to="'/home/edit/' + task.id_complete" class="card-link" :id="'link-' + task.id_os" draggable="false">
                <div class="card-os-header">
                    <h6><strong>{{ task.id_complete }}</strong></h6>
                    <h6 class="sponsor-card-name"><strong>{{ task.sponsor_name }}</strong></h6>
                </div>
                <div class="card-os-body">
                    <p class="os-description">{{ task.desc_os }}</p>
                </div>
                <div class="priority-container" :class="findPriority(task.priority, 1)">
                    <h6 class="priority-text">{{ findPriority(task.priority) }}</h6>
                </div>
            </router-link>
        </div>
    </div>
</template>
<script>
import $ from 'jquery';

export default {
    name: "card",
    props: ['task', 'first_load'],
    data() {
        return {
            loading_card: true
        }
    },
    methods: {
        showTooltip: function (id, user_owner, priority, size) { // Função mostra o tooltip da respectiva OS sobreposta e preenche as informações.
            if (sessionStorage.getItem("in_drag") == "true") {
                return;
            }
            if (window.innerWidth > 865) {
                let border = "border: 2px solid ";
                switch (priority) {
                    case 1: 
                        border += "#FFA500";
                        break;
                    case 2: 
                        border += "#FF0000";
                        break;
                }
                /*let osTooltipElement = `
                                        <div class="os-tooltip" id="#tooltip-${id}" style="${border}">
                                            <h6 class="os-tooltip-number"><strong>(OS) ${id}</strong></h6>
                                            <h6><strong>Aberta por:</strong> ${user_owner}</h6>
                                            <h6><strong>Tamanho:</strong> ${size}</h6>
                                            <h6><strong>Expira:</strong> Não</h6>
                                            <h6><strong>H. Previstas:</strong> n/a</h6>
                                            <h6><strong>H. Restantes:</strong> n/a</h6>
                                        </div>
                                    `;*/
                let osTooltipElement = `
                                        <div class="os-tooltip" id="#tooltip-${id}" style="${border}">
                                            <h6 class="os-tooltip-number"><strong>${id}</strong></h6>
                                            <h6><strong>Aberta por:</strong> ${user_owner}</h6>
                                            <h6><strong>Tamanho:</strong> ${size}</h6>
                                        </div>
                                    `;
                $(".card-os").append(osTooltipElement);
            }
        },
        hideTooltip: function () { // Reseta e esconde tooltip.
            $(".os-tooltip").remove();
        },
        findPriority: function (priority, badge = 0) { // Função para encontrar as classes dos badges da OS segundo a prioridade dela.
            switch (priority) {
                case 1: 
                    if (badge == 1) { return "normal" }
                    return "Normal";
                case 2: 
                    if (badge == 1) { return "priority" }
                    return "Prioritário";
            }
        }
    },
    mounted() {
        let interval = setInterval(() => {
            if (this.task != undefined) {
                clearInterval(interval);
                this.loading_card = false;
            }
        }, 1000)
    }
}
</script>
<style scoped>
.card-link {
    z-index: 2;
}

.card-loading {
    background: rgb(242, 242, 242);
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
    height: 11rem;
    max-width: 447px;
    border-radius: 15px;
    padding: 1rem;
    margin: .3rem auto;
    position: relative;
    z-index: 2;
    animation-name: pulse;
    animation-duration: 2.5s;
    animation-iteration-count: infinite;
    opacity: 0.5s;
}

@keyframes pulse {
    0% {
        opacity: 0.5
    }
    50% {
        opacity: 1;
    }
    100% {
        opacity: 0.5;
    }
}

.card-os {
    background: rgb(242, 242, 242);
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
    max-height: 15rem;
    max-width: 447px;
    border-radius: 15px;
    padding: 1rem;
    margin: .9rem auto;
    position: relative;
    z-index: 2;
}

    .card-os:hover .os-tooltip {
        display: block;
    }

.card-os-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.sponsor-card-name {
    font-weight: 500;
}

.card-os-body {
    position: relative;
    margin-bottom: 28px;
}

.os-description {
    overflow-y: scroll;
    max-height: 7.5rem;
    margin-bottom: .4rem;
}

.text-elipsis {
    display: none;
    line-height: 1.2rem;
    font-size: 1.4rem;
    color: black;
    background: rgb(242, 242, 242);
    padding: 0 6px 5px;
    position: absolute;
    right: 0;
    bottom: 1px;
}

.priority-container {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    border-radius: 2.5rem;
    position: absolute;
    bottom: .6rem;
    left: 0;
    right: 0;
    margin: auto;
    width: 80%;
}

    .priority-container h6 {
        margin: .2rem 0;
    }

.normal {
    background: orange;
}

.priority {
    background: var(--red);
}

@media (max-width: 865px) {
    .card-os {
        width: 15rem;
        margin: .5rem;
    }
}
</style>