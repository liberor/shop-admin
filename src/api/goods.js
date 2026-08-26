import axios from "@/axios";


export function getGoodsList(page,query){
    const params = {}
    for(const k in query){
        if(query[k] !== ''){
            params[k] = query[k]
        }
    }
    return axios.get("/admin/goods/"+ page ,{params})
}
export function updateGoodsStatus(ids,status){
    return axios.post(`/admin/goods/changestatus`,{ids,status})
}
export function createGoods(data){
    return axios.post(`/admin/goods`,data)
}

export function updateGoods(id,data){
    return axios.post(`/admin/goods/${id}`,data)
}
export function deleteGoods(ids){
    return axios.post(`/admin/goods/delete_all`,{ids})
}
export function readGoods(id){
    return axios.get(`/admin/goods/read/${id}`)
}
export function setGoodsBanner(id,data){
    return axios.post(`/admin/goods/banners/${id}`,data)
}
export function updateGoodsSkus(id,data){
    return axios.post(`/admin/goods/updateskus/${id}`,data)
}
export function restoreGoods(ids){
    return axios.post(`/admin/goods/restore`,{ids})
}
export function destroyGoods(ids){
    return axios.post(`/admin/goods/destroy`,{ids})
}
export function checkGoods(id,ischeck){
    return axios.post(`/admin/goods/${id}/check`,{ischeck})
}

export function createGoodsSkusCard(data){
    return axios.post(`/admin/goods_skus_card`,data)
}
export function updateGoodsSkusCard(id,data){
    return axios.post(`/admin/goods_skus_card/`+id,data)
}
export function deleteGoodsSkusCard(id){
    return axios.post(`/admin/goods_skus_card/`+id+"/delete")
}
export function sortGoodsSkusCard(data){
    return axios.post(`/admin/goods_skus_card/sort`,data)
}
export function createGoodsSkusCardValue(data){
    return axios.post(`/admin/goods_skus_card_value`,data)
}
export function updateGoodsSkusCardValue(id,data){
    return axios.post(`/admin/goods_skus_card_value/${id}`,data)
}
export function deleteGoodsSkusCardValue(id){
    return axios.post(`/admin/goods_skus_card_value/${id}/delete`)
}