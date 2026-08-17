import axios from "@/axios";


export function getUserList(page,query){
    if(!query.limit) query.limit = 10
    return axios.get("/admin/user/"+page+`?limit=${query.limit}`,{params:query})
}
export function updateUserStatus(id,status){
    return axios.post(`/admin/user/${id}/update_status`,{status})
}
export function createUser(data){
    return axios.post(`/admin/user`,data)
}

export function updateUser(id,data){
    return axios.post(`/admin/user/${id}`,data)
}
export function deleteUser(id){
    return axios.post(`/admin/user/${id}/delete`)
}
