<template>
    <div class="help-page">
        <div class="help-header">
            <a @click="$router.go(-1)" class="back">
                <span class="material-icons">arrow_back</span>
                <p class="font-size-4">Voltar</p>
            </a>
            <img src="../assets/img/logo-cademint-v2-reduced.png">
        </div>
        <div class="content-container">
            <div class="help-page-container">
                <div class="logo">
                    <span class="material-icons">help</span>
                </div>
                <p class="font-size-h4">Precisa de ajuda?</p>
                <p class="font-size-4">Clique no botão abaixo para enviar um email para o nosso suporte.</p>
                <a href="mailto:contato.cademint@gmail.com">Enviar dúvida</a>
            </div>
            <div class="help-page-container">
                <router-link to="privacy-policy" class="redirect">
                    <div class="logo">
                        <span class="material-icons">lock</span>
                    </div>
                    <p class="font-size-h4">Política de privacidade</p>
                    <p class="font-size-4">Veja nossa política de privacidade e tire suas dúvidas sobre a gestão dos seus dados.</p> 
                </router-link>
            </div>
            <div class="help-page-container">
                <router-link to="terms-of-use" class="redirect">
                    <div class="logo">
                        <span class="material-icons">list</span>
                    </div>
                    <p class="font-size-h4">Termos de uso</p>
                    <p class="font-size-4">veja nossos termos de uso e tire suas dúvidas sobre a utilização do nosso sistema.</p>
                </router-link>
            </div>
        </div>
        <div class="footer">
            <div class="copyright">
                <p class="font-size-5">Copyright © 2022 Cademint</p>
            </div>
            <div class="footer-links">
                <router-link to="/privacy-policy" class="redirect">Privacidade</router-link> -
                <router-link to="/terms-of-use" class="redirect">Termos de uso</router-link>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    name: "helpPage",
}
</script>
<style scoped>

.redirect {
    display: flex;
    flex-direction: column;
    align-items: center;
}

p {
    margin-top: .5rem;
}

.help-page {
    width: 100%;
    height: 100%;
}

.help-page::after {
    content: "";
    position: absolute;
    top: 0;
    z-index: 1;
    background: var(--yellow);
    height: 300px;
    width: 100%;
}

.help-header {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    position: relative;
    height: 50px;
    border-bottom: 1px solid var(--gray);
    background: var(--white);
    z-index: 2;
}

    .help-header img {
        width: 100%;
        max-width: 200px;
    }

    .help-header a p {
        margin: 0;
    }

.back {
    display: flex;
    align-items: center;
    position: absolute;
    left: 1rem;
    color: var(--blue);
    cursor: pointer;
}

    .back span {
        margin-right: 1rem;
    }

    .back p {
        margin-bottom: -2px !important;
    }

.content-container {
    width: fit-content;
    height: fit-content;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-wrap: wrap;
    z-index: 2;
    margin: 7vh auto 2rem auto;
}

@media (min-width: 920px) {
    .content-container {
        margin: 14vh auto 2rem auto;
    }
}

.help-page-container {
    background: var(--white);
    z-index: 2;
    width: 95%;
    height: 350px;
    max-width: 350px;
    border-radius: 6px;
    border: 1px solid var(--gray);
    padding: 20px;
    overflow: hidden;
    margin: 1rem;
}

.logo {
    background: var(--blue-high-2);
    width: 50px;
    height: 50px;
    border-radius: 50%;
    color: var(--blue-low);
    display: flex;
    align-items: center;
    justify-content: center;
}

.danger {
    background: var(--red-high);
    color: var(--red-low);
}

.footer {
    width: 100%;
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    padding: .7rem 2rem;
    justify-content: space-between;
    background: var(--white);
    z-index: 3;
}

.footer-links {
    margin-left: 10px;
}

.copyright {
    margin-right: 10px;
}

.copyright, .footer-links {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

.copyright p {
    color: var(--gray-low);
    margin: 0;
}

.footer-links a {
    color: var(--blue);
    margin: 0 5px;
}

    .footer-links a:hover {
        text-decoration: underline;
    }

.help-page-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: all 0.4s;
}

    .help-page-container p {
        margin-top: 1rem;
    }

    .help-page-container p:first-of-type {
        margin-top: 2rem;
    }

    .help-page-container p:last-of-type {
        text-align: center;
    }

    .help-page-container a:not(.redirect) {
        background: var(--blue);
        color: var(--white);
        width: 100%;
        padding: 7px 10px;
        border-radius: 6px;
        margin-top: 2rem;
        transition: all 0.4s;
    }

        .help-page-container a:hover:not(.redirect) {
            background: var(--blue-low);
        }

@media (max-width: 645px) {
    .help-header a p {
        display: none;
    }

    .footer-links {
        justify-content: flex-end;
    }
}

@media (max-width: 452px) {
    .footer-links {
        text-align: center !important;
    }
}

@media (max-width: 350px) {
    .help-header img {
        max-width: 130px;
    }
}
</style>