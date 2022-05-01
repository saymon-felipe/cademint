<template>
    <div class="card-container">
        <div class="card-loading" v-if="loading_card"></div>
        <div class="card-task" :id="task.id" v-if="!loading_card" v-on:click="edit_task = true">
            <div class="card-task-header">
                <p class="font-size-4-bold">#{{ task.id }}</p>
                <div class="priority-container" :class="findPriority(task.priority, 1)">
                    <p class="font-size-5">{{ findPriority(task.priority) }}</p>
                </div>
            </div>
            <div class="card-os-body">
                <p class="task-description font-size-4">{{ task.desc_os }}</p>
            </div>
            <p class="font-size-4 sponsor">Responsável: <strong>{{ task.sponsor_name }}</strong></p>
        </div>
    </div>
</template>
<script>


export default {
    name: "card",
    props: ['task', 'first_load'],
    data() {
        return {
            loading_card: true
        }
    },
    methods: {
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
.card-loading {
    background: var(--gray-soft);
    margin-bottom: 10px;
    border-radius: 6px;
    height: 11rem;
    animation-name: pulse;
    animation-duration: 2.5s;
    animation-iteration-count: infinite;
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

/* INÍCIO ALTERAÇÕES CARD */

.card-container {
    position: relative;
}

.card-task {
    background: var(--white);
    margin-bottom: 10px;
    border-radius: 6px;
    padding: 13px;
    border: 1px solid var(--gray-soft);
    position: relative;
}

.card-task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.priority-container {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 17px;
    padding: 3px 7px;
}

.priority {
    background: var(--red);
}

    .priority p {
        color: var(--white);
    }

.normal {
    background: var(--yellow);
}

.task-description {
    margin: 10px 0;
    overflow: hidden;
    width: 100%;
    display: -webkit-box;
    word-break: break-word;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical; 
}

@media (max-width: 720px) {
    .card-container {
        height: 100%;
    }

    .card-task {
        min-width: 180px;
        margin: 0;
        height: 100%;
    }

    .sponsor {
        position: absolute;
        bottom: 20px;
        left: 10px;
    }

    .task-description {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .card-task, .card-loading {
        margin-right: 10px;
    }
}

/* FIM ALTERAÇÕES CARD */

/*

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

.normal {
    background: orange;
}

.priority {
    background: var(--red);
}

@media (max-width: 865px) {
    .card-os {
        width: 15rem;
    }
}*/
</style>