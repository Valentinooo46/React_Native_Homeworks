import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import {BASE_URL_API} from "@/api";
import * as SecureStore from "expo-secure-store";

export const createBaseQuery = (endpoint: string) =>
    fetchBaseQuery({
        baseUrl: `${BASE_URL_API}/${endpoint}/`,
        prepareHeaders: async (headers) => {
            const token = await SecureStore.getItemAsync("accessToken");
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    });
