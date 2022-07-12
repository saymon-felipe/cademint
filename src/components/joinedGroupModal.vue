<template>
    <div class="enter-group-container">
        <div class="enter-group-message">
            <h1>Parabéns! Você entrou em um grupo!</h1>
            <button v-on:click="closeModal">OK</button>
        </div>    
        <div class="overlay" v-if="joined_group"></div>
    </div>
</template>
<script>
import $ from 'jquery';

export default {
    name: "joinedGroupModal",
    props: ['joined_group'],
    methods: {
        openModal: function () {
            let modal = $(".enter-group-message");
            modal.css("display", "flex");
            setTimeout(() => {
                modal.css("opacity", 1).css("transform", "translateY(0)");
            }, 10);
        },
        closeModal: function () {
            let modal = $(".enter-group-message");
            modal.css("opacity", 0).css("transform", "translateY(-100px)");
            setTimeout(() => {
                modal.hide();
                this.$emit("joined_group", false);
            }, 400);
        }
    },
    mounted() {
        this.openModal();
    }
}
</script>
<style scoped>
.overlay {
    display: block;
}

.enter-group-message {
    position: fixed;
    transform: translateY(-100px);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    width: 50vw;
    height: 40vh;
    padding: 1rem;
    color: black;
    /*display: flex;*/
    display: none;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    z-index: 9999;
    background: var(--white);
    border-radius: 10px;
    transition: transform 0.4s;
}

    .enter-group-message button {
        padding: 10px 60px;
        font-size: 2rem;
        border: none;
        border-radius: 10px;
        background: var(--blue);
        color: var(--white);
        margin-top: 2rem;
        cursor: pointer;
    }

        .enter-group-message button:hover {
            background: var(--blue-low);
        }
</style>