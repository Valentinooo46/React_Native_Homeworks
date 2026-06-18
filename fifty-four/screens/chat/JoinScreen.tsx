import {StatusBar, View, KeyboardAvoidingView, Platform, ScrollView} from "react-native";
import { useState, useEffect } from "react";
import { useGetMyChatsQuery } from "@/service/chatService";
import { useAppSelector } from "@/store";
import {createChatConnection} from "@/hubs/chatHub";
import ChatList from "@/components/chat/ChatList";
import ChatWindow from "@/components/chat/ChatWindow";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JoinScreen() {
    //Потрібно скинути кеш Query RTK
    const { data: chats, refetch } = useGetMyChatsQuery();
    const { user } = useAppSelector(s => s.auth);

    const [activeChatId, setActiveChatId] = useState<number | null>(null);

    // без юз ефекту било помилку

    //if (!user?.token) return;
    //createChatConnection(user.token).start();

    useEffect(() => {

        if (!user?.token) return;
        createChatConnection(user.token).start();
    }, [user?.token]);

    useEffect(() => {
        refetch(); //Скидаємо кеш Query RTK
    },[]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="flex-1 bg-zinc-50 dark:bg-zinc-950"
        >
            <StatusBar barStyle="default" />
            <SafeAreaView className="flex-1 flex-row">
                <View className="max-w-[280px] w-1/3 border-r border-zinc-200 dark:border-zinc-800">
                    <ChatList
                        chats={chats ?? []}
                        activeChatId={activeChatId}
                        onSelect={setActiveChatId}
                    />
                </View>

                <View className="flex-1">
                    <ChatWindow chatId={activeChatId} />
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}
