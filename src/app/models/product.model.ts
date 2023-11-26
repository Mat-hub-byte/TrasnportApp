export interface Product{
    name : string,
    image : string,
    id : string
    createdAt: firebase.default.firestore.Timestamp; // Usa el tipo Timestamp
}