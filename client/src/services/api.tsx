import { get, deleteMethod, put, post } from "./fetcher";

export const getUsers = (page: number) => {
    return get(`/users?q=${page}`);
}

export const getUserById = (id: string) => {
    return get(`/users/${id}`);
}

export const getMyUser = () => {
    return get('/users/me');
}

export const getImages = (page: number) => {
    return get(`/images?q=${page}`);
}

export const updateImage = (id: string, body: any) => {
    return put(`/images/${id}`, body);
}

export const getUserImages = (id: string) => {
    return get(`/users/${id}/images`);
}

export const deleteImage = (id: string) => {
    return deleteMethod(`/images/${id}`);
}

export const updateUser = (id: string, body: any) => {
    return put(`/users/me`, body);
}

export const uploadImage = (body: any) => {
    return post(`/images`, body, "");
}

export const loginUser = (body: any) => {
    return post('/login', body);
}

export const registerUser = (body: any) => {
    return post('/register', body);
}

export const loginOAuth = (body: any) => {
    return post("/login", body);
}

export const registerOAuth = (body: any) => {
    return post("/register")
}

export const deleteAccount = (id: string) => {
    return deleteMethod(`/users/me`)
}

export const searchImage = (query: string) => {
    return get(`/images/search?q=${query}`);
}

export const searchUser = (query: string) => {
    return get(`/users/search?q=${query}`);
}

export const publishComment = (id: string, authorId: string, text: string) => {
    return post(`/images/${id}/comment`, { author: authorId, text });
}

export const updateStatutPicture = (idPicture: string, id: string) => {
    return put(`/images/${idPicture}`, { likes: { _id: id } });
}

export const getImage = (id: string) => {
    return get(`/images/${id}`);
}

export const getRecommendation = () => {
    return get(`/users/me/recommendation`);
}

export const getNotif = (id: string) => {
    return get(`/users/${id}/notif`);
}

export const removeNotif = (id: string, body: any) => {
    return post(`/users/${id}/notif`, body);
}

export const getTrending = () => {
    return get(`/images/trending`);
}