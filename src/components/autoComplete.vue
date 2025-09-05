<template>
    <div class="cademint-autocomplete">
        <div class="user" v-for="user in user_list" :key="user.nome" v-on:click="selectUser(user)">
            <img :src="user.profile_photo" class="avatar-p">
            <div class="informations">
                <p class="font-size-4-bold">{{ user.nome }}</p>
                <div class="occupations">
                    <div class="occupation" v-for="(occupation, index2) in user.user_occupation" :key="index2">
                        <div class="occupation-container" v-if="index2 <= 2">
                            <p>{{ occupation }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { globalMethods } from '../js/globalMethods';
import $ from 'jquery';
import api from '../configs/api.js';

export default {
    name: "autoComplete",
    props: ['searchParam'],
    mixins: [globalMethods],
    data() {
        return {
            user_list: []
        }
    },
    watch: {
        searchParam: function (string) {
            this.ajaxSearch();
            this.filterSearch(string);
        }
    },
    methods: {
        filterSearch: function (string) {
            let self = this;
            
            self.user_list = this.user_list.filter(user => { 
                return user.nome.toLowerCase().includes(string.toLowerCase());
            });
            
            if (this.searchParam.length > 3 && this.user_list.length == 0) {
                $(".cademint-autocomplete").css("opacity", 0);
            }
        },
        ajaxSearch: function () {
            if (this.searchParam.length != 3) {
                return;
            }

            let self = this;
            let data = {
                search: self.searchParam
            }
            $(".cademint-autocomplete").css("opacity", 1);
            api.post('/users/find_users', data)
            .then(function (response) {
                self.user_list = response.data.returnObj;
            }).catch((error) => {
                if (error.response.status == 404) {
                    self.$emit('emptySearch');
                }
            })
        },
        selectUser: function (user) {
            this.$emit('selectUser', user);
        }
    }
}
</script>
<style scoped>
.cademint-autocomplete {
    position: absolute;
    top: 40px;
    left: 0;
    border-radius: 10px;
    background: var(--white);
    border: 1px solid var(--gray);
    box-shadow: 0 0 7px rgba(0, 0, 0, 0.3);
    padding: 5px;
    opacity: 0;
}

.user {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 10px;
}

    .user:hover {
        background: var(--gray-high);
    }

.informations {
    margin-left: 1rem;
}

.occupation {
    background: var(--gray-soft);
    padding: 5px 10px;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    margin: 3px 10px 3px 0;
    display: inline-block;
}
</style>