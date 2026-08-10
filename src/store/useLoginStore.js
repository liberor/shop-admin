import { defineStore } from "pinia"
export default defineStore("login",{
    state(){
        return {
            user:{},
            asideWidth:"250px"
        }
    }
    ,
    getters:{

    },
    actions:{
        set_user_info(info){
            this.user = info
        },
        toggleAsideWidth(){
            this.asideWidth = this.asideWidth == "250px" ? "64px" : "250px"
        },
        
    }
})