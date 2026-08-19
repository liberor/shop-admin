import axios from "@/axios";


export function getOrderList(page,query){
    const params = {}
    for(const k in query){
        if(query[k] !== ''){
            params[k] = query[k]
        }
    }
    return axios.get("/admin/order/"+ page ,{params})
}
export function deleteOrder(ids){
    return axios.post(`/admin/order/delete_all`,{ids})
}
export function excelExport(query){
    return axios.post(`/admin/order/excelexport`, query, {responseType: 'blob'})
}