<template>
    <div class="login">
        <div class="app-animation">
            <div class="side-container">
                <div class="app-header">
                    <img src="../assets/img/logo-cademint-v2-reduced.png">
                    <p class="font-size-h5">Sua nova maneira de organizar tarefas</p>
                </div>
                <lottie-player id="animation" src="https://assets6.lottiefiles.com/packages/lf20_tykpzoym.json"  background="transparent"  speed="1" loop autoplay></lottie-player>
            </div>
        </div>
        <div class="login-container">
            <div class="side-container">
                <div class="app-header responsive-title">
                    <img src="../assets/img/logo-cademint-v2-reduced.png">
                    <p class="font-size-h5">Sua nova maneira de organizar tarefas</p>
                </div>
                <slot />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "templateLogin"
}
</script>

<style scoped>
.login {
    display: flex;
    align-items: center;
    overflow: hidden;
    justify-content: center;
}

.app-animation {
    background: var(--yellow);
    flex-direction: column;
    position: relative;
}

.login-container .side-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.side-container {
    width: 100%;
    height: 100%;
    max-width: 2000px;
    display: flex;
    justify-content: center;
}

.responsive-title {
    display: none !important;
    top: 1rem !important;
    padding: 0 10px 0 10px;
}

    .responsive-title img {
        max-width: 250px !important;
        margin-bottom: .5rem !important;
    }

    .responsive-title p {
        font-size: 1rem;
    }

.app-animation, .login-container {
    width: 50vw;
    height: 100vh;
    padding: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.app-animation #animation {
    max-width: 700px;
}

.app-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: absolute;
    top: 3rem;
    left: 0;
    right: 0;
    margin: auto;
    width: fit-content;
    z-index: 3;
}

    .app-header img {
        width: 90%;
        max-width: 600px;
        margin-bottom: 1rem;
    }

@media (max-width: 750px) {
    .app-animation {
        display: none;
    }

    .login-container {
        width: 100vw;
    }

    .responsive-title {
        display: block !important;
    }
}
</style>