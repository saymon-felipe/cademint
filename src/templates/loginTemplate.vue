<template>
    <div class="login">
        <div class="login-container">
            <slot />
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
        width: 100%;
        height: 100vh;
        background: url("../assets/img/logo-cademint-v2-reduced.png"), var(--yellow);
        background-repeat: no-repeat;
        background-position: center 5%;
        background-size: 400px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .login-container {
        display: flex;
        background: var(--white);
        border-radius: 20px;
        flex-direction: column;
        justify-content: center;
        width: 30rem;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        padding: 70px 25px;
        margin: 0 15px;
        font-weight: 500;
    }

    @media (max-width: 920px) {
        .login-container {
            background-size: 300px;
        }
    }

    @media (max-width: 650px) {
        .login-container {
            background-size: 250px;
        }
    }

    @media (max-width: 460px) {
        .login-container {
            background-size: 200px;
        }
    }

    @media(max-width: 420px) {
        .login {
            padding: 35px 10px;
        }
    }

    @media (max-width: 510px) {
        .login {
            background-size: 80%;
        }
    }
</style>