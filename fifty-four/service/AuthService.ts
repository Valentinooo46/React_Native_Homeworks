import {createApi} from "@reduxjs/toolkit/query/react";
import {fetchBaseQuery} from "@reduxjs/toolkit/query";
import { BASE_URL } from "@/api";
// import {serialize} from "object-to-formdata";
import type IRegisterModel from "../models/IRegisterModel.ts";
import type ILoginModel from "../models/ILoginModel.ts";
import {serialize} from "object-to-formdata";


export const authService = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${BASE_URL}/Account/`,
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['Auth'],
    endpoints: (build) => ({
        register: build.mutation<{
            email: string,
            id: number,
            username: string,
        }, IRegisterModel>({
            query: (model)=>{
                const formData = serialize(model)
                return {
                    url: "register",
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
        })

    })
})

export const { useRegisterMutation, useLoginMutation } = authService;