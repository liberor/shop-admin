import axios from "@/axios";

export function login(username,password){
    return axios.post("/admin/login",{
        username,
        password
    })
}
export function getInfo(){
    return axios.post("/admin/getinfo")
}
export function logout(){
    return axios.post("/admin/logout")
}
export function updatepassword(data){
    return axios.post("/admin/updatepassword",data)
}

export function getManagerList(page,query={limit:10,keyword:''}){
    const str = query.keyword ? `&keyword=${query.keyword}` : ''
    return axios.get("/admin/manager/"+page+`?limit=${query.limit}` + str)
}
export function updateManagerStatus(id,status){
    return axios.post(`/admin/manager/${id}/update_status`,{status})
}
export function createManager(data){
    return axios.post(`/admin/manager`,data)
}

export function updateManager(id,data){
    return axios.post(`/admin/manager/${id}`,data)
}
export function deleteManager(id){
    return axios.post(`/admin/manager/${id}/delete`)
}
