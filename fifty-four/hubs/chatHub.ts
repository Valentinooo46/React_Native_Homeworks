import * as signalR from "@microsoft/signalr";
import {BASE_URL} from "@/api";

let connection: signalR.HubConnection | null = null;

export const createChatConnection = (token: string) => {
    connection = new signalR.HubConnectionBuilder()
        .withUrl(`${BASE_URL}/hubs/chat`, {
            accessTokenFactory: () => token,
        })
        .withAutomaticReconnect()
        .build();

    return connection;
};

export const getChatConnection = () => connection;
