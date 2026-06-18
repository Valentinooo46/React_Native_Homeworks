import { createBaseQuery } from "@/utils/createBaseQuery";
import {createApi} from "@reduxjs/toolkit/query/react";
import {IChatType} from "@/models/chat/IChatType";
import {IUserShort} from "@/models/chat/IUserShort";
import { IChatCreate } from "@/models/chat/IChatCreate";
import {IChatListItem} from "@/models/chat/IChatListItem";
import {IMessageItem} from "@/models/chat/IMessageItem";
import {IChatEdit} from "@/models/chat/IChatEdit";
import { IUserSearch } from "@/models/chat/IUserSearch";

export const chatService = createApi({
    reducerPath: "api/chats",
    tagTypes: ["Chats", "Chat"],
    baseQuery: createBaseQuery("chats"),
    endpoints: builder => ({

        getChatTypes: builder.query<IChatType[], void>({
            query: () => "types",
        }),

        getUsers: builder.query<IUserShort[], IUserSearch>({
            query: params => ({
                url: "users",
                params,
            }),
            providesTags: ["Chat"],
        }),

        createChat: builder.mutation<number, IChatCreate>({
            query: body => ({
                url: "",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Chats"],
        }),

        editChat: builder.mutation<void, IChatEdit>({
            query: body => ({
                url: "edit",
                method: "PUT",
                body,
            }),
            invalidatesTags: ["Chats", "Chat"],
        }),

        getMyChats: builder.query<IChatListItem[], void>({
            query: () => "my",
            providesTags: ["Chats"],
        }),

        getChatMessages: builder.query<IMessageItem[], number>({
            query: chatId => `${chatId}/messages`,
            providesTags: ["Chat"],
        }),

        amIAdmin: builder.query<boolean, number>({
            query: chatId => ({
                url: "am-i-admin",
                params: { chatId },
            }),
        }),
    }),
});

export const {
    useGetChatTypesQuery,
    useGetUsersQuery,
    useCreateChatMutation,
    useEditChatMutation,
    useGetMyChatsQuery,
    useGetChatMessagesQuery,
    useAmIAdminQuery,
} = chatService;
