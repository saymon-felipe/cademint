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
                <p class="task-description font-size-4" v-html="formatDescOs(task.desc_os)"></p>
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
        },
        formatDescOs: function (os_string) {
            const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
            let replacedString = os_string.replace(urlPattern, function(url) {
                return `<a href="${url}" target="_blank" style="text-decoration: underline; color: var(--blue-low); position: relative; z-index: 2;">${url}</a>`;
            });

            return replacedString.replace(/\n/g, '<br>');
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
        max-width: 220px;
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
</style>