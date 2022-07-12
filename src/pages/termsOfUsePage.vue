<template>
    <div class="help-page">
        <div class="help-header">
            <router-link to="/login" class="back">
                <span class="material-icons">arrow_back</span>
                <p class="font-size-4">Voltar para o login</p>
            </router-link>
            <img src="../assets/img/logo-cademint-v2-reduced.png">
        </div>
        <div class="content-container">
            <div class="help-page-container">
                <div class="logo">
                    <span class="material-icons">list</span>
                </div>
                <p class="font-size-h4">Termos de uso</p>
                <p class="font-size-4">Última atualização em 21 de Junho de 2022</p> 
                <div class="content">
                    <p>Esta página informa sobre nossas políticas para uso do sistema onde todos terão as devidas responsabilidades.</p>
                    <p class="font-size-h5">O que é a Cademint?</p>
                    <p>A Cademint é um sistema onde o usuário pode criar, editar, excluir e compartilhar tarefas pessoais ou comerciais com outras pessoas através de grupos denominados projetos, sendo que durante este processo poderá compartilhar informações pessoais com outras pessoas e interagir através dos comentários, disponível na seção de tarefas.</p>
                    <p>Em resumo, a Cademint é um sistema de gerenciamento de tarefas pertencente à Rabsystems.</p>
                    <p class="font-size-h5">Nossas responsabilidades</p>
                    <p>A Cademint possui total responsabilidade sobre qualquer informação do usuário coletada em qualquer período após o cadastro e início do uso do sistema, exceto:</p>
                    <ul>
                        <li>Qualquer comentário ou descrição de tarefas, ou nome ou biografia de pessoas ou grupos que não sejam criados e divulgados pela própria Cademint;</li>
                        <li>Qualquer imagem ou outros arquivos anexados por usuários ou terceiros;</li>
                        <li>Incorporações e hiperlinks inseridos por usuários ou por terceiros.</li>
                    </ul>
                    <p class=font-size-h5>Cookies</p>
                    <p>Cookies são arquivos criados por sites e armazenados no computador que facilitam e melhoram a experiência do usuário, alguns cookies são imprescindíveis para o correto funcionamento e serão executados mesmo sem o consentimento do usuário.</p>
                    <p class="font-size-h5">Segurança de dados</p>
                    <p>Nós utilizamos as melhores tecnologias disponíveis comercialmente para proteção de banco de dados e servidores, mas como nenhum sistema é inviolável não podemos assegurar totalmente a integridade dos dados fornecidos.</p>
                    <p class="font-size-h5">Responsabilidades do usuário</p>
                    <p>O usuário terá <strong>TOTAL</strong> responsabilidade sobre os itens abaixo:</p>
                    <ul>
                        <li>Manter um ambiente online de trabalho e lazer seguro e saudável para si e para os outros usuários;</li>
                        <li>Publicar comentários com respeito e responsabilidade, sem ferir qualquer opinião e/ou crença e/ou características de outros usuários;</li>
                    </ul>
                    <p class="font-size-h5">Direitos da Cademint</p>
                    <p>Quaisquer usos e fins das informações contidas no cliente, servidor e banco de dados é permitida <strong>SOMENTE</strong> a Cademint e seus operadores e a Rabsystems, empresa criadora do software de gerenciamento de tarefas denominado Cademint e seus operadores.</p>
                    <p class="font-size-h5">Sobre os termos</p>
                    <p>Os termos de uso da Cademint poderão ser alterados e/ou incrementados em qualquer período, sendo que todos os usuários serão devidamente informados quando tal evento ocorrer.</p>
                    <p class="font-size-h5">Uso da plataforma</p>
                    <p>Nosso serviço não atende menores de 18 anos devido as informações que serão fornecidas e divulgadas por outros usuários e eventuais cobranças futuras que possam ser implementadas na plataforma.</p>
                    <p class="font-size-h5">Considerações</p>
                    <p>A partir do início da utilização do sistema o usuário aceitará todas as condições explícitas nesta página.</p>
                    <p class="font-size-h5">Contato</p>
                    <p>Se você ainda tiver alguma dúvida sobre os nossos termos de uso entre em contato conosco pelo email:  <a href="mailto:contato.cademint@gmail.com" class="redirect">contato.cademint@gmail.com</a></p>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="copyright">
                <p class="font-size-5">Copyright © 2022 Cademint</p>
            </div>
            <div class="footer-links">
                <router-link to="/privacy-policy" class="redirect">Privacidade</router-link>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    name: "termsOfUsePage",
}
</script>
<style scoped>

ul {
    text-align: left;
    margin: .5rem 0 0 30px;
}

.content p {
    text-align: left !important;
    margin-top: .5rem !important;
}

p.font-size-h5 {
    margin-top: 1rem !important;
}

p {
    margin-top: .5rem;
}

.redirect:hover {
    text-decoration: underline;
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
}

    .back span {
        margin-right: 1rem;
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
    height: fit-content;
    max-width: 9000px;
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

@media (max-width: 350px) {
    .help-header img {
        max-width: 130px;
    }
}
</style>