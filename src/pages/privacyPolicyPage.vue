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
                    <span class="material-icons">lock</span>
                </div>
                <p class="font-size-h4">Política de privacidade</p>
                <p class="font-size-4">Última atualização em 21 de Junho de 2022</p> 
                <div class="content">
                    <p>Esta página informa sobre as políticas da Cademint relacionadas à coleta, uso e divulgação dos dados fornecidos durante o uso do sistema.</p>
                    <p class="font-size-h5">Coleta, uso e tipos de dados</p>
                    <p>Nós utilizamos seus dados para melhorar a experiência de utilização do nosso sistema de forma que as operações aqui realizadas sejam satisfatórias para nós e para você.</p>
                    <p>Os tipos de dados pessoais que coletaremos será:</p>
                    <ul>
                        <li>Nome</li>
                        <li>Email</li>
                        <li>Telefone <strong>*</strong></li>
                    </ul>
                    <p class="font-size-6"><strong>*</strong> Esses dados ainda não serão coletados, porém em versões futuras o usuário será convidado a preencher essas informações para o correto funcionamento do sistema.</p>
                    <p class=font-size-h5>Compartilhamento de dados</p>
                    <p>Nós não compartilhamos seus dados com ninguém exceto serviços necessários para o funcionamento do sistema.</p>
                    <p>Nós poderemos divulgar seus dados pessoais caso tal feito seja necessário para:</p>
                    <ul>
                        <li>Assegurar os direitos da Cademint ou da Rabsystems (empresa proprietária da Cademint);</li>
                        <li>Corrigir eventuais falhas ou irregularidades do sistema que comprometam a segurança do usuário;</li>
                        <li>Para proteger outros usuários ou pessoas que não utilizam o sistema;</li>
                        <li>Para cumprir uma obrigação legal;</li>
                        <li>Para evitar e proteger contra responsabilidade legal; </li>
                    </ul>
                    <p class="font-size-h5">Cookies</p>
                    <p>Assim como já foi explicado na nossa página de Termos de uso, os cookies são necessários para melhorar a sua experiência durante a utilização do sistema, podendo ou não serem opcionais.</p>
                    <p class="font-size-h5">Segurança</p>
                    <p>Nosso compromisso é com a segurança do usuário durante a utilização do nosso sistema, por isso nós utilizamos os métodos mais seguros e eficazes de transferência de dados e armazenamento de sessão, mas como nenhum sistema é inviolável, não temos como garantir a total segurança do usuário e suas informações.</p>
                    <p class="font-size-h5">Sobre a política de privacidade</p>
                    <p>A política de privacidade da Cademint pode ser alterada e/ou incrementada em qualquer período, sendo que todos os usuários serão devidamente informados quando tal evento ocorrer.</p>
                    <p class="font-size-h5">Uso da plataforma</p>
                    <p>Nosso serviço não atende menores de 18 anos devido as informações que serão fornecidas e divulgadas por outros usuários e eventuais cobranças futuras que possam ser implementadas na plataforma.</p>
                    <p class="font-size-h5">Contato</p>
                    <p>Se você ainda tiver alguma dúvida sobre a nossa política de privacidade entre em contato conosco pelo email: <a href="mailto:contato.cademint@gmail.com" class="redirect">contato.cademint@gmail.com</a></p>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="copyright">
                <p class="font-size-5">Copyright © 2022 Cademint</p>
            </div>
            <div class="footer-links">
                <router-link to="/terms-of-use" class="redirect">Termos de uso</router-link>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    name: "privacyPolicyPage",
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