<template>
    <div class="modal-container">
        <div class="modal-box">
            <div class="modal-header">
                <span class="modal-name">{{ modalname }}</span>
                <span class="material-icons close-modal" v-on:click="closeThisModal()">close</span>
            </div>
            <div class="modal-body">
                <slot></slot>
                <div class="loading"></div>
            </div>
            <div class="modal-footer">
                <button class="btn primary" v-on:click="saveModalData()">Salvar</button>
                <button class="btn btn-gray" v-on:click="closeThisModal()">Cancelar</button>
            </div>
        </div>
        <div class="modal-wrapper" v-on:click="closeThisModal()"></div>
    </div>
</template>
<script>
import $ from 'jquery';

export default {
    name: "modalComponent",
    props: ["modalname", "saved"],
    data() {
        return {
            isLoading: false
        }
    },
    watch: {
        saved: function () {
            if (this.saved) {
                this.hideLoading();
                this.closeThisModal();
            }
        }
    },
    methods: {
        hideLoading: function () {
            let loading = $(".loading");
            this.isLoading = false;
            loading.hide();
        },
        showLoading: function () {
            let loading = $(".loading");
            let footerButtons = $(".modal-footer button");
            footerButtons.attr("disabled", "disabled");
            this.isLoading = true;
            loading.show();
        },
        showModal: function () {
            let modalBox = $(".modal-box");
            let modalContainer = $(".modal-container");
            let modalWrapper = $(".modal-wrapper");

            modalContainer.show();
            modalBox.css("opacity", 1).css("transform", "translateY(0)");
            modalWrapper.show();
        },
        closeThisModal: function () {
            let modalBox = $(".modal-box");
            let modalContainer = $(".modal-container");
            let modalWrapper = $(".modal-wrapper");

            modalBox.css("opacity", 1).css("transform", "translateY(-50vh)");

            setTimeout(() => {
                modalContainer.hide();
                modalWrapper.hide();
                this.$emit("modalClosed", true);
            }, 400)
        },
        saveModalData: function () {
            let modalBody = $(".modal-body");
            let saveModalButton = $("#save-modal-data");
            saveModalButton.click();

            if (this.isLoading || !modalBody.hasClass("valid")) {
                return;
            }
            
            this.showLoading();

            this.$emit("saveAction", true);
        }
    },
    mounted: function () {
        this.showModal();
    }
}
</script>
<style scoped>
.modal-container {
    position: fixed;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 0;
    top: 0;
}

.modal-footer {
    border-top: 1px solid var(--gray-high);
    padding: 1rem;
    display: flex;
    justify-content: flex-end;
    height: fit-content;
}

.modal-box {
    background: vaR(--white);
    position: relative;
    transition: all 0.4s ease-in-out;
    transform: translateY(-50vh);
    margin: auto;
    border-radius: 10px;
    z-index: 1;
    min-width: 300px;
    min-height: 220px;
    max-width: 600px;
    max-height: 560px;
    width: 95vw;
    height: 95vh;
    display: flex;
    flex-direction: column;
}

.modal-body {
    overflow: hidden;
    overflow-y: auto;
    flex-grow: 1;
    padding: 1rem;
}

.modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid var(--gray-high);
    height: fit-content;
}

.close-modal {
    cursor: pointer;
}

.modal-wrapper {
    position: fixed;
    width: 100vw;
    height: 100vh;
    left: 0;
    top: 0;
    cursor: default;
    background: rgba(0, 0, 0, 0.7);
}
</style>