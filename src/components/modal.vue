<template>
    <div class="modal">
        <div class="modal-container">
            <div class="modal-header">
                <h2 class="font-bold">{{ modaltitle }}</h2>
                <span class="material-icons" v-on:click="handleCloseModalContent()">close</span>
            </div>
            <div class="modal-body">
                <div>
                    <slot />
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn primary" id="modal-submit-button" v-if="modalbutton1 != ''" v-on:click="submitInformations()">{{ modalbutton1 }}</button>
                <button class="btn btn-gray" v-if="modalbutton2 != ''" v-on:click="handleCloseModalContent()">{{ modalbutton2 }}</button>
            </div>
        </div>
        <div class="modal-overlay" v-on:click="handleCloseModalContent()"></div>
    </div>
</template>
<script>
import $ from 'jquery';

export default {
    name: "modalComponent",
    props: ["modaltitle", "modalbutton1", "modalbutton2"],
    methods: {
        showModalContent: function () {
            let modal = $(".modal-container");
            modal.css("opacity", 1).css("transform", "translateY(0)");
        },
        handleCloseModalContent: function () {
            let modal = $(".modal-container");
            modal.css("opacity", 0).css("transform", "translateY(-20vh)");

            setTimeout(() => {
                this.$emit("closeModal", true);
            }, 400)
        },
        submitInformations: function () {
            let modalButton1 = $("#modal-submit-button");
            modalButton1.attr("disabled", "disabled").addClass("btn-loading");

            $("#submit-button").click();
        },
        saveAndSubmitInformations: function () {
            let modalButton1 = $("#modal-submit-button");
            modalButton1.attr("disabled", "disabled").addClass("btn-loading");

            $("#submit-button").click();
        }
    },
    mounted: function () {
        setTimeout(() => {
            this.showModalContent();
        }, 1)

        let submitButton = $("#submit-button");

        submitButton.off("click");

        submitButton.on("click", () => {
            let informationsForm = $("#informations-form");

            if (informationsForm.find(":invalid").length > 0) {
                $("#modal-submit-button").removeAttr("disabled").removeClass("btn-loading");
            }
        })
    }
}
</script>
<style scoped>

.modal, .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 4;
}

.modal {
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-overlay {
    background: var(--overlay);
    z-index: 1;
}

.modal-container {
    z-index: 2;
    background: var(--white);
    border-radius: var(--radius-sm);
    box-shadow: var(--boxshadow-default);
    width: 95%;
    height: 95%;
    max-width: 700px;
    max-height: 600px;
    position: relative;
    display: flex;
    flex-direction: column;
    transition: opacity 0.4s, transform 0.4s;
    transform: translateY(-20vh);
    opacity: 0;
}

.modal-header, .modal-body, .modal-footer {
    padding: var(--space-5) var(--space-6);
}

.modal-header, .modal-footer {
    flex: 0 0 auto;
}

.modal-footer {
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid var(--gray-high);
}

.modal-body {
    flex: 1;
    overflow: hidden;
    overflow-y: auto;
}

.modal-body > div {
    height: 100%;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid var(--gray-high);
}

    .modal-header span {
        cursor: pointer;
        border-radius: var(--radius-full);
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

        .modal-header span:hover {
            background: var(--gray-soft-2);
        }
</style>