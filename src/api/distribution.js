import axios from "@/axios";

export function getAgentList(page,query){
    return axios.get("/admin/agent/"+page,{params:query})
}
export function getAgentOrderList(page,query){
    return axios.get("/admin/user_bill/"+page,{params:query})
}

export function getAgentStatistics(){
    return axios.get("/admin/agent/statistics")
}

export function getConfig(){
    return axios.get("admin/distribution_setting/get")
}
export function setConfig(data){
    return axios.post("admin/distribution_setting/set",data)
}
