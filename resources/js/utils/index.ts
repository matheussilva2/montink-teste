import { api } from "@/services/api";
import axios from "axios";

export const product = {
    index: async () => {
        const products = await api.get('products');

        return products;
    },
    get: async (id:number) => {
        const product = await api.get(`products/${id}`);

        return product;
    },
    update: async (data) => {
        await api.put(`products/${data.id}`);

        return true;
    },
    delete: async(id:number) => {
        await api.delete(`products/${id}`);

        return true;
    }
}