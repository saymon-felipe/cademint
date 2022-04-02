<template>
    <section class="not-allowed">
        <div class="not-allowed-container">
            <div class="not-allowed-inner">
                <i class="fas fa-exclamation-circle"></i>
                <div class="not-allowed-text">
                    <h1>Ops!</h1>
                    <h4>A página que você está procurando não existe.</h4>
                </div>
            </div>
            <div class="redirect-countdown">Você será redirecionado para a home em {{ redirectCountdown }} segundos.</div>
        </div>
    </section>
</template>

<script>
export default {
    name: "indexPage",
    data() {
        return {
            redirectCountdown: 5
        }
    },
    methods: {
        redirectToHome: function () {
            let self = this, initialTime = 7;
            let interval = setInterval(() => {
                self.redirectCountdown = initialTime - 2;
                initialTime = initialTime - 1;
                if (initialTime == 1) {
                    clearInterval(interval);
                    this.$router.push("/home");
                }
            }, 1000);
        }
    },
    mounted() {
        this.redirectToHome();
    }
}
</script>

<style scoped>
    .not-allowed {
        position: absolute;
        width: 100%;
        height: 100%;
        background: var(--yellow);
        overflow: hidden;
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
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: white;
        border-radius: 10px;
        z-index: 2;
        padding: 1rem;
    }

    .not-allowed-inner {
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 5rem;
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
        .not-allowed-inner {
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

.redirect-countdown {
    font-size: 1.1rem;
    text-align: center;
}
</style>