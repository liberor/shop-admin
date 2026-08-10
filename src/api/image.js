import axios from "@/axios";

export function getImageClassList(page){
    return axios.get("/admin/image_class/" + page)
}
export function createImageClass(data){
    return axios.post("/admin/image_class" ,data)
}
export function updateImageClass(id,data){
    return axios.post("/admin/image_class/" + id,data)
}
export function deleteImageClass(id){
    return axios.post("/admin/image_class/" + id + "/delete")
}

export function getImageList(id,page){
    return axios.get(`/admin/image_class/${id}/image/${page}`)
}
export function updateImage(id,data){
    return axios.post(`/admin/image/${id}`,data)
}
export function deleteImage(ids){
    return axios.post(`/admin/image/delete_all`,{ids})
}
export const ImageUploadAction = "/api/admin/image/upload"