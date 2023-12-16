import axios from 'axios';

export class ProductService {

    baseUrl = "https://api-producto-mongo.onrender.com/api/producto";

    createProduct(producto) {
        return axios.post(this.baseUrl, producto).then(res => res.data);
    }

    //READ
    readAll() {
        return axios.get(this.baseUrl).then(res => res.data);
    }

    //UPDATE
    updateProduct(producto) {
        return axios.put(this.baseUrl + "/" + producto._id, producto).then(res => res.data);
    }

    //DELETE
    deleteProduct(_id) {
        return axios.delete(this.baseUrl + "/" + _id).then(res => res.data);
    }

    findProductById(_id) {
        console.log("findProductById: " + _id)
        return axios.get(this.baseUrl + "/" + _id).then(res => res.data);
    }

}
