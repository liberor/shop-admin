import { defineStore } from "pinia"
import { cartesianProductOf } from '@/composables/utils'
export default defineStore("goodsSku", {
    state() {
        return {
            goods_skus_card: [],
            goods_skus: [],
            pre_ids_to_skus: {},
            goods_id:null
        }
    }
    ,
    getters: {

    },
    actions: {
        delete_sku(id) {
            this.goods_skus_card = this.goods_skus_card.filter(item => item.id != id)
        },
        create_sku(sku) {
            this.goods_skus_card.push(sku)
        },
        //保存当前的规格数据，而后改规格名时可以复用之前的数据
        update_pre_ids_to_skus() {
            this.pre_ids_to_skus = {}
            for (let obj of this.goods_skus) {
                let ids = []
                for (let o of Object.values(obj.skus)) {
                    ids.push(o.id)
                }
                ids.sort((a, b) => a - b)
                ids = ids.join()
                let skus = {}
                skus.pprice = obj.pprice
                skus.oprice = obj.oprice
                skus.cprice = obj.cprice
                skus.stock = obj.stock
                skus.volume = obj.volume
                skus.weight = obj.weight
                skus.code = obj.code
                this.pre_ids_to_skus[ids] = skus
            }

        },
        //复用之前的数据
        update_goods_skus_basedon_ids() {
            for (let obj of this.goods_skus) {
                let ids = []
                for (let o of Object.values(obj.skus)) {
                    ids.push(o.id)
                }
                ids.sort((a, b) => a - b)
                ids = ids.join()
                for (let pre_ids of Object.keys(this.pre_ids_to_skus)) {
                    if (pre_ids == ids) {
                        Object.assign(obj, this.pre_ids_to_skus[ids])
                        break
                    }
                }
            }
        },
        update_skus_basedon_cards() {
            if (this.goods_skus_card.length == 0) {
                this.goods_skus = []
            } else {
                let arr = [];
                for (let card of this.goods_skus_card) {
                    const temp = card.goods_skus_card_value.map(item => item);
                    if (temp.length > 0) arr.push(temp)
                }
                if (arr.length == 0) {
                    this.goods_skus = [];
                    return
                }
                arr = cartesianProductOf(...arr);
                this.goods_skus = [];
                this.goods_skus = arr.map(o => {
                    Object.values(o).forEach((item,index)=>{
                        item.name = this.goods_skus_card[index].name
                    })
                    return {
                        code: '0',
                        cprice: '0.00',
                        goods_id: this.goods_skus_card.goods_id,
                        image: '',
                        oprice: '0.00',
                        pprice: '0.00',
                        stock: 0,
                        volume: 0,
                        weight: 0,
                        skus: o
                    }
                })
            }
        }
    }
})