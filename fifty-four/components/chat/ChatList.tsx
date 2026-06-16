import { FC } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { IChatListItem } from "@/models/chat/IChatListItem";

interface ChatListProps {
    chats: IChatListItem[];
    activeChatId: number | null;
    onSelect: (id: number) => void;
}

const ChatList: FC<ChatListProps> = ({ chats, activeChatId, onSelect }) => {
    return (
        <ScrollView className="flex-1 p-3">
            {chats.map(chat => {
                const isActive = chat.chatId === activeChatId;

                return (
                    <View key={chat.chatId} style={{ marginBottom: 8 }}>
                        <TouchableOpacity
                            onPress={() => onSelect(chat.chatId)}
                            className={`p-3 rounded-xl ${isActive ? "bg-emerald-500" : "bg-zinc-100 dark:bg-zinc-900"}`}
                        >
                            <Text className={isActive ? "text-white font-semibold" : "text-zinc-800 dark:text-zinc-200"}>
                                {chat.name}
                            </Text>
                        </TouchableOpacity>
                    </View>
                );
            })}
        </ScrollView>
    );
};

export default ChatList;
