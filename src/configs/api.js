import axios from 'axios'

let url_api;

const dev_environment = "http://192.168.15.43:3000"; //Ambiente de desenvolvimento.
const test_environment = "https://coretest-cademint-0012d7964dfd.herokuapp.com"; //Ambiente de teste.
const production_environment = ""; //Ambiente de produção.

// TROCA DO AMBIENTE DA API
//
// O parâmetro que deverá ser informado será 0, 1 ou 2, sendo que:
// 0 - Ambiente de desenvolvimento
// 1 - Ambiente de teste
// 2 - Ambiente de produção
// 
// ==============================
let ambient;
    
if (window.location.hostname.indexOf("localhost") != -1 || window.location.hostname.indexOf("192.168") != -1) {
    ambient = 0;
} else if (window.location.hostname.indexOf("test.") != -1 || window.location.hostname.indexOf("test-") != -1) {
    ambient = 1;
} else {
    ambient = 2;
}
// ==============================
//


switch (ambient) {
    case 0:
        url_api = dev_environment;
        break;
    case 1: 
        url_api = test_environment;
        break;
    case 2: 
        url_api = production_environment;
        break;
}

const api = axios.create({
    baseURL: url_api
});

export default api;