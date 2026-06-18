import React, { useMemo } from "react";
import {
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

import { InputField } from "@/components/form/InputField";
import { useForm } from "@/hooks/useForm";

import {
    useGetChatTypesQuery,
    useGetUsersQuery,
    useCreateChatMutation,
} from "@/service/chatService";

import { IChatCreate } from "@/models/chat/IChatCreate";

export default function CreateChatScreen() {
    const { data: chatTypes } = useGetChatTypesQuery();
    const { data: users } = useGetUsersQuery({});
    const [createChat, { isLoading }] = useCreateChatMutation();

    const { form, setForm, onChange } = useForm<IChatCreate>({
        name: "",
        chatTypeId: 0,
        userIds: [],
    });

    const selectedType = useMemo(
        () => chatTypes?.find(t => t.id === form.chatTypeId),
        [chatTypes, form.chatTypeId]
    );

    const isPrivate = selectedType?.typeName === "Private";

    const toggleUser = (userId: number) => {
        setForm(prev => {
            if (isPrivate) {
                return { ...prev, userIds: [userId] };
            }

            return prev.userIds.includes(userId)
                ? { ...prev, userIds: prev.userIds.filter(id => id !== userId) }
                : { ...prev, userIds: [...prev.userIds, userId] };
        });
    };

    const onSubmit = async () => {
        if (!form.name || !form.chatTypeId) return;

        if (isPrivate && form.userIds.length !== 1) {
            alert("Для приватного чату оберіть одного користувача");
            return;
        }

        try {
            await createChat(form).unwrap();
            console.log("Crate Chat Screen");
            //Після створення ми приєднуємося в ЧАТ
            router.replace(`/chat/join`);
        } catch (e) {
            console.log("Create chat error:", e);
        }
    };

    return (
        <View className="flex-1 bg-zinc-50 dark:bg-zinc-950">
            <StatusBar barStyle="default" />

            <LinearGradient
                colors={["rgba(16,185,129,0.35)", "transparent"]}
                className="absolute w-full h-[380px] rounded-full blur-[120px]"
            />

            <SafeAreaView className="flex-1 p-6">
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        contentContainerStyle={{ paddingBottom: 40 }}
                    >

                        <View className="items-center mt-4">
                            <Text className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">
                                Новий чат
                            </Text>
                            <View className="h-[2px] w-12 bg-emerald-500 my-6 rounded-full" />
                            <Text className="text-zinc-500 dark:text-zinc-400 text-center text-lg">
                                Оберіть тип та учасників
                            </Text>
                        </View>

                        <View className="mt-8">
                            <InputField
                                placeholder="Назва чату"
                                value={form.name}
                                onChangeText={onChange("name")}
                            />
                        </View>

                        <View className="mt-8">
                            <Text className="text-zinc-600 dark:text-zinc-400 mb-2 font-medium">
                                Тип чату
                            </Text>

                            <View className="flex-row gap-3">
                                {chatTypes?.map(type => (
                                    <TouchableOpacity
                                        key={type.id}
                                        onPress={() =>
                                            setForm(prev => ({
                                                ...prev,
                                                chatTypeId: type.id,
                                                userIds: [],
                                            }))
                                        }
                                        className={`px-4 py-3 rounded-xl border
                                            ${form.chatTypeId === type.id
                                            ? "bg-emerald-500 border-emerald-500"
                                            : "border-zinc-300 dark:border-zinc-700"}
                                        `}
                                    >
                                        <Text
                                            className={
                                                form.chatTypeId === type.id
                                                    ? "text-white font-semibold"
                                                    : "text-zinc-700 dark:text-zinc-300"
                                            }
                                        >
                                            {type.typeName}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View className="mt-8">
                            <Text className="text-zinc-600 dark:text-zinc-400 mb-2 font-medium">
                                Учасники
                            </Text>

                            <View className="gap-2">
                                {users?.map(user => {
                                    const selected = form.userIds.includes(user.id);

                                    return (
                                        <TouchableOpacity
                                            key={user.id}
                                            onPress={() => toggleUser(user.id)}
                                            className={`px-4 py-3 rounded-xl border
                                                ${selected
                                                ? "bg-emerald-500 border-emerald-500"
                                                : "border-zinc-300 dark:border-zinc-700"}
                                            `}
                                        >
                                            <Text
                                                className={
                                                    selected
                                                        ? "text-white font-semibold"
                                                        : "text-zinc-800 dark:text-zinc-200"
                                                }
                                            >
                                                {user.name}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            {isPrivate && (
                                <Text className="text-xs text-zinc-400 mt-2">
                                    Приватний чат — лише один учасник
                                </Text>
                            )}
                        </View>

                        <View className="mt-10">
                            <TouchableOpacity
                                className="bg-emerald-500 py-5 rounded-2xl items-center shadow-md"
                                activeOpacity={0.85}
                                onPress={onSubmit}
                                disabled={isLoading}
                            >
                                <Text className="text-white text-xl font-bold">
                                    {isLoading ? "Створення..." : "Створити чат"}
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
