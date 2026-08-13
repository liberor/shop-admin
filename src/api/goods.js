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
