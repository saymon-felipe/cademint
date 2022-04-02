<template>
    <section class="not-allowed">
        <div class="not-allowed-container">
            <i class="fas fa-ban"></i>
            <div class="not-allowed-text">
                <h1>Você não tem acesso à essa área!</h1>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: "indexPage"
}
</script>

<style scoped>
    .not-allowed {
        position: absolute;
        width: 100%;
        height: 100%;
        background: var(--yellow);
    }

    .not-allowed-container {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        width: 95vw;
        max-width: 850px;
        height: 70vh;
        max-height: 700px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
        border-radius: 10px;
        z-index: 2;
        padding: 1rem;
    }

        .not-allowed-container i {
            font-size: 5rem;
            margin-left: 2rem;
            color: var(--red);
        }

    .not-allowed-text {
        margin-left: 6.5rem;
    }

        .not-allowed-text h1 {
            color: var(--black);
            font-size: 2.5rem;
            margin-bottom: .5rem;
        }

    @media (max-width: 702px) {
        .not-allowed-container {
            flex-direction: column;
        }

            .not-allowed-container i {
                margin: 0;
                margin-bottom: 2rem;
            }

        .not-allowed-text {
            margin: 0;
            text-align: center;
        }
    }

    @media (max-width: 605px) {
        .not-allowed-text h1 {
            font-size: 2rem;
        }

        .not-allowed-container i {
            font-size: 4.5rem;
        }
    }
</style>