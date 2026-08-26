import { defineStore } from "pinia"
export default defineStore("goodsSku",{
    state(){
        return {
            goods_skus_card:[],
            goods_skus:[]
        }
    }
    ,
    getters:{

    },
    actions:{
        delete_sku(id){
            this.goods_skus_card = this.goods_skus_card.filter(item=>item.id != id)
        },
        create_sku(sku){
            this.goods_skus_card.push(sku)
        }
    }
})