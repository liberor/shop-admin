import axios from "@/axios";

export function getGoodsCommentList(page,query){
    if(!query.limit) query.limit = 10
    return axios.get("/admin/goods_comment/"+page,{params:query})
}
export function updateGoodsCommentStatus(id,status){
    return axios.post(`/admin/goods_comment/${id}/update_status`,{status})
}
export function reviewGoodsComment(id,comment){
    return axios.post(`/admin/goods_comment/review/${id}`,{data:comment})
}
