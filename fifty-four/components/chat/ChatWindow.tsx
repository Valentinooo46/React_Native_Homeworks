import { FC, useEffect, useRef, useState, useMemo } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
} from "react-native";

import { InputField } from "@/components/form/InputField";
import { useForm } from "@/hooks/useForm";
import { getChatConnection } from "@/hubs/chatHub";
import {
    useGetChatMessagesQuery,
    useAmIAdminQuery,
} from "@/service/chatService";
import { IMessageItem } from "@/models/chat/IMessageItem";

import EditChatModal from "./EditChatModal";
import {BASE_URL_IMAGES} from "@/api";

interface ChatWindowProps {
    chatId: number | null;
}

const ChatWindow: FC<ChatWindowProps> = ({ chatId }) => {
    const scrollRef = useRef<ScrollView>(null);

    const { data: history, isFetching } = useGetChatMessagesQuery(chatId ?? 0, {
        skip: !chatId,
        refetchOnMountOrArgChange: true,
    });

    console.log('history', history);

    const { data: isAdmin } = useAmIAdminQuery(chatId ?? 0, {
        skip: !chatId,
    });

    const [realtimeMessages, setRealtimeMessages] = useState<IMessageItem[]>([]);
    const [editVisible, setEditVisible] = useState(false);

    const messages = useMemo(() => {
        const base = history ?? [];

        if (realtimeMessages.length === 0) return base;

        const ids = new Set(base.map(m => m.id));
        const uniqueRealtime = realtimeMessages.filter(m => !ids.has(m.id));

        return [...base, ...uniqueRealtime];
    }, [history, realtimeMessages]);

    // console.log("Messages", messages);

    useEffect(() => {
        if (!chatId) return;

        const connection = getChatConnection();
        if (!connection) return;

        connection.invoke("JoinChat", chatId);

        const handler = (msg: IMessageItem) => {
            setRealtimeMessages(prev => {
                if (prev.some(m => m.id === msg.id)) return prev;
                return [...prev, msg];
            });
        };

        connection.on("ReceiveMessage", handler);

        connection.onreconnected(() => {
            connection.invoke("JoinChat", chatId);
        });

        return () => {
            connection.invoke("LeaveChat", chatId);
            connection.off("ReceiveMessage", handler);
            setRealtimeMessages([]);
        };
    }, [chatId]);

    const msgForm = useForm<{ message: string }>({ message: "" });

    const sendMessage = () => {
        const text = msgForm.form.message.trim();
        if (!text || !chatId) return;

        const connection = getChatConnection();
        if (!connection) return;

        connection.invoke("SendMessage", { chatId, message: text });

        msgForm.setForm({ message: "" });
    };

    if (!chatId) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-zinc-400">Оберіть чат</Text>
            </View>
        );
    }

    return (
        <View className="flex-1">

            <View className="flex-row items-center justify-between p-3 border-b border-zinc-300 dark:border-zinc-700">
                <Text className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                    Чат {isFetching && "..."}
                </Text>

                {isAdmin && (
                    <TouchableOpacity
                        onPress={() => setEditVisible(true)}
                        className="px-3 py-1 bg-emerald-500 rounded-lg"
                    >
                        <Text className="text-white font-semibold">Редагувати</Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView
                ref={scrollRef}
                className="flex-1 p-4"
                contentContainerStyle={{ paddingBottom: 20, gap: 8 }}
                keyboardShouldPersistTaps="handled"
                onContentSizeChange={() =>
                    scrollRef.current?.scrollToEnd({ animated: true })
                }
            >
                {messages.map((m, i) => (
                    <View
                        key={m.id ?? `msg-${i}`}
                        className="bg-zinc-200 dark:bg-zinc-800 p-3 rounded-xl self-start max-w-[85%] flex-row items-start gap-2"
                    >
                        <Image
                            source={{ uri: `${BASE_URL_IMAGES}100_${m.userImage}` }}
                            className="w-10 h-10 rounded-full"
                        />

                        <View className="flex-1">
                            <Text className="text-zinc-600 dark:text-zinc-400 font-semibold mb-1">
                                {m.userName || "Користувач"}
                            </Text>

                            <Text className="text-zinc-900 dark:text-zinc-100">
                                {m.message}
                            </Text>
                        </View>
                    </View>
                ))}
            </ScrollView>

            <View className="flex-row p-2 border-t border-zinc-300 dark:border-zinc-700 items-end gap-2">
                <View className="flex-1">
                    <InputField
                        placeholder="Напишіть повідомлення..."
                        value={msgForm.form.message}
                        onChangeText={msgForm.onChange("message")}
                        onSubmitEditing={sendMessage}
                    />
                </View>

                <TouchableOpacity
                    onPress={sendMessage}
                    className="bg-emerald-500 px-4 py-3 rounded-xl"
                >
                    <Text className="text-white font-semibold">OK</Text>
                </TouchableOpacity>
            </View>

            <EditChatModal
                chatId={chatId}
                visible={editVisible}
                onClose={() => setEditVisible(false)}
            />
        </View>
    );
};

export default ChatWindow;
