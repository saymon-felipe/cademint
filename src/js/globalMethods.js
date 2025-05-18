import $ from 'jquery';
import api from '../configs/api.js';

export const globalMethods = {
    methods: {
        //Métodos response
        resetResponse: function () {
            this.response = "";
            this.responseType = "";
        },
        setResponse: function (msg, type) {
            this.response = msg;
            this.responseType = type;
        },
        //Métodos modal
        showModalFunction: function (modalTitle, modalButton1, modalButton2, contentObject = null) {
            this.modalTitle = modalTitle;
            this.modalButton1 = modalButton1;
            this.modalButton2 = modalButton2;
            this.showModal = true;
            if (contentObject) this.$root.contentObject = JSON.parse(JSON.stringify(contentObject));
        },
        closeModalFunction: function () {
            this.closeModalContent();

            setTimeout(() => {
                this.showModal = false;

                this.modalTitle = "";
                this.modalButton1 = "";
                this.modalButton2 = "";
                this.$root.contentObject = {id: 0};
            }, 400);
        },
        closeModalContent: function () {
            let modal = $(".modal-container");
            modal.css("opacity", 0).css("transform", "translateY(-20vh)");
        },
        //Metodos autenticação
        setTemporaryEmail: function (email) { // Adiciona o email temporário em session storage.
            sessionStorage.setItem("temp_email", email);
        },
        getTemporaryEmail: function () {
            return sessionStorage.getItem("temp_email"); // Recupera o email temporário de session storage.
        },
        removeTemporaryEmail: function () { // Remove o email temporário em session storage.
            sessionStorage.removeItem("temp_email");
        },
        logoutUser: function (not_return = false) {
            let self = this;
            self.removeCurrentProjectInLocalStorage();
            self.removeJwtFromLocalStorage();
            if (!not_return) {
                if (window.location.pathname != "/login") {
                    self.$router.push("/login");
                }
            }
        },
        setJwtInLocalStorage: function (jwt) { // Armazena o token JWT em local storage. 
            localStorage.setItem("jwt_token", jwt);
            return;
        },
        removeJwtFromLocalStorage: function () { //Remove o token JWT de session storage e envia para o login passando parametro na URL.
            localStorage.removeItem("jwt_token");
        },
        getJwtFromLocalStorage: function () { //Pega o token jwt que está armazenado no session storage caso o usuário estiver logado.
            return localStorage.getItem("jwt_token");
        },
        checkIfUserIsAuthenticated: function (from_login = false) { // Função testará se usuário está logado para permitir sua entrada na página.
            return new Promise((resolve) => {
                let self = this, pathName = window.location.href, jwt = "Bearer " + self.getJwtFromLocalStorage();
                if (jwt == "Bearer null") {
                    if (pathName.indexOf("/login") == -1 && pathName.indexOf("/register") == -1 && pathName.indexOf("/reset-password") == -1 && pathName.indexOf("/enter-group") == -1 && pathName.indexOf("/maintenance") == -1) { // Se o usuário não estiver na página de login ou register, ele é redirecionado.
                        self.$router.push("/login");
                        return;
                    }

                    if (pathName.indexOf("/login") != -1 || pathName.indexOf("/register") != -1 || pathName.indexOf("/reset-password") != -1) {
                        return;
                    }
                }

                api.get("/system")
                .then(function(response) {
                    if (response.data.response.in_maintenance) { 
                        setTimeout(() => {
                            $(".in-maintenance-element").show();
                        }, 700); 
                        setTimeout(self.checkIfUserIsAuthenticated, 60 * 1000); // Se o sistema estiver em manutenção e cair na página de manutenção, depois de 60 segundos é feita uma nova verificação.
                        return;
                    } else {
                        api.get("/users/checkJWT", { // Se ja estiver logado no sistema e acessar a página de login, é checkado a valia do token JWT e então redirecionado para a index.
                            headers: {
                                Authorization: jwt
                            }
                        })
                        .then(function () { 
                            if (pathName.indexOf("/login") != -1) { // Se o usuário estiver logado e entrar em login, o mesmo é logado novamente e direcionado para a index.
                                setTimeout(() => {
                                    $(".form-input").attr("disabled", true);
                                    $("#submit-button").attr("disabled", true);
                                    self.loading = true;
        
                                    setTimeout(() => {
                                        self.$router.push("/home");
                                    }, 1000);
                                }, 100);
                            }
                            resolve();
                        })
                        .catch(function () { // Caso contrário ele é deslogado e enviado para login.
                            self.logoutUser();
                            return;
                        })
                        .then(function () {
                            if (!from_login) {
                                setTimeout(self.checkIfUserIsAuthenticated, 10 * 1000);
                                if (pathName.indexOf("/maintenance") != -1) {
                                    self.$router.push("/home");
                                }
                            }
                        })
                    }
                })
            })
        },
        addUserToGroup: function (group_id, token, user_id, user_email) { // Função adiciona usuário ao grupo.
            return new Promise((resolve, reject) => {
                api.post("/projects/enter_group_with_token", {
                    token: token,
                    email_requested: user_email,
                    user_id: user_id,
                    group_id: group_id
                }).then(() => {
                    resolve();
                })
                .catch(function(){
                    reject();
                })
            })
        },
        removeCurrentProjectInLocalStorage: function () { // Remove o id do projeto de session storage.
            localStorage.removeItem("current_project");
        },
        setCurrentProjectInLocalStorage: function (group_id, group_name) { // Adiciona o id do projeto de session storage.
            let current_project = {
                group_id: group_id,
                group_name: group_name
            }

            localStorage.setItem("current_project", JSON.stringify(current_project));
        },
        getCurrentProjectInLocalStorage: function () { // Retorna o id do projeto de session storage.
            let JSONproject = localStorage.getItem("current_project");
            let project = JSON.parse(JSONproject);
            return project;
        },
        getCurrentProjectId: function () {
            let JSONproject = localStorage.getItem("current_project");
            let project = JSON.parse(JSONproject).group_id;
            return project;
        },
        chooseProjectStatus: function (status, label = false) {
            switch (status) {
                case 1: 
                    if (label) {
                        return "Em andamento";
                    }

                    return "on-track";
                case 2: 
                    if (label) {
                        return "Em risco";
                    }
                    
                    return "at-risk";
                case 3: 
                    if (label) {
                        return "Suspenso";
                    }
                    
                    return "off-track";
                case 4: 
                    if (label) {
                        return "Em espera";
                    }
                    
                    return "on-hold";
            }
        },
        loadSystemVersion: async function(loadNow = false) {
            let newAppVersion = await api.get("/system").then(response => response.data.response.system_version);

            if (loadNow) {
                this.$root.app_version = newAppVersion;
                return;
            }
            
            let inMaintenanceElement = $(".in-maintenance-element");
            let newVersionElement = $(".new-version-availabe");

            if (inMaintenanceElement && newVersionElement) {
                if (this.$root.app_version != newAppVersion) {
                    inMaintenanceElement.hide();
                    newVersionElement.show();
                    this.$root.app_version = newAppVersion;
                }
            }

            setTimeout(() => {
                this.loadSystemVersion();
            }, 6 * 1000);
        },
        requireUser: function(reloadNow = false) { // Função retorna o usuário pelo id.
            return new Promise((resolve) => {
                let self = this;
                api.get("/users/return_user").then((res) => {
                    self.$root.user = res.data.returnObj;
                    resolve();
                    if (!reloadNow) {
                        setTimeout(() => {
                            this.requireUser();
                        }, 10 * 6 * 10 * 1000)
                    }
                });
            })
        },
        requireGroup: function(group_id) { // Função retorna o grupo pelo id.
            return new Promise((resolve, reject) => {
                let self = this;
                let data = {
                    group_id: group_id
                }
                api.post("/projects/return_group", data).then((response) => {
                    self.group = response.data.returnObj;
                    resolve(self.group);
                }).catch((error) => {
                    reject(error);
                })
            })
        },
        removePhoto: function (from_upload = false, banner = false, group = false, group_id = null) {
            let self = this, jwt = "Bearer " + self.getJwtFromLocalStorage();
            let target = "exclude_photo";
            let path = "/users/";
            let data = "";

            if (banner) {
                target = "exclude_banner";
            }

            if (group) {
                target = "exclude_group_image";
                path = "/projects/";
                data = {
                    group_id: group_id
                }
            }
            
            api.patch(path + target, data, {
                headers: {
                        Authorization: jwt
                    }
            })
            .then(function(response){
                if (!from_upload) {
                    location.reload();
                    self.response = response.data.response.action;
                }
            })
        },
        checkAndSetJwt: function() {
            let interval = setInterval(() => {
                let jwt = localStorage.getItem("jwt_token");
                if (jwt != null) {
                    api.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem("jwt_token")}`;
                    this.$root.jwtLoaded = true;
                    clearInterval(interval);
                }
            }, 100)
        },
        //Formatação
        formatLinks: function (string) {
            const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/ig;
            let replacedString = string.replace(urlPattern, function(url) {
                return `<a href="${url}" target="_blank" style="text-decoration: underline; color: var(--blue-low); position: relative; z-index: 2;">${url}</a>`;
            });

            return replacedString.replace(/\n/g, '<br>');
        },
    },
    mounted: function() {
        this.checkAndSetJwt();
    },
    data() {
        return {
            in_drag: false,
            system_url: "", // Url da aplicação WEB
            default_user_image: api.defaults.baseURL + "/public/default-user-image.png",
            default_user_cover_image: api.defaults.baseURL + "/public/default-banner-image.png",
            group_default_image: api.defaults.baseURL + "/public/cademint-group.png",
            showModal: false,
            modalTitle: "",
            modalButton1: "",
            modalButton2: "",
            response: "",
            responseType: ""
        }
    }
}