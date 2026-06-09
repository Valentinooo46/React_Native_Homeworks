import {createApi} from "@reduxjs/toolkit/query/react";
import {fetchBaseQuery} from "@reduxjs/toolkit/query";
import { BASE_URL } from "@/api";
// import {serialize} from "object-to-formdata";
import type IRegisterModel from "../models/IRegisterModel.ts";
import type ILoginModel from "../models/ILoginModel.ts";
import {serialize} from "object-to-formdata";
import IMeModel from "@/models/IMeModel";
import * as SecureStore from "expo-secure-store";

export const authService = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/Account/`,
        prepareHeaders: async  (headers) => {
            const token = await SecureStore.getItemAsync("accessToken");
            headers.set('Content-Type', 'application/json');
            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }
            return headers;
        },
    }),
    tagTypes: ['Auth'],
    endpoints: (build) => ({
        register: build.mutation<{token : string}, IRegisterModel>({
            query: (model)=>{
                const formData = serialize(model)
                return {
                    url: "Register",
                    method: "POST",
                    body: formData,
                }
            },
            invalidatesTags: ["Auth"]
        }),
        login: build.mutation<{token : string}, ILoginModel>({
            query: (model)=>{
                // const formData = serialize(model)
                return{
                    url: "Login",
                    method: "POST",
                    body: model,
                }
            }
        }),
        me: build.query<IMeModel, void>({
            query: () => {
                return {
                    url: "Me",
                    method: "GET",
                }
            }
        })
    })
})

export const {
    useRegisterMutation,
    useLoginMutation,
    useMeQuery,
} = authService;