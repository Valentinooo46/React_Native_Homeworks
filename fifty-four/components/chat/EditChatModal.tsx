import { FC, useEffect, useMemo, useState } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
} from "react-native";

import { InputField } from "@/components/form/InputField";
import { useForm } from "@/hooks/useForm";

import {
    useEditChatMutation,
    useGetUsersQuery,
} from "@/service/chatService";
import { IChatEdit } from "@/models/chat/IChatEdit";

interface Props {
    chatId: number;
    visible: boolean;
    onClose: () => void;
}

const EditChatModal: FC<Props> = ({ chatId, visible, onClose }) => {
    const [editChat, { isLoading }] = useEditChatMutation();

    const editForm = useForm<IChatEdit>({
        id: chatId,
        name: "",
        addUserIds: [],
        removeUserIds: [],
    });

    useEffect(() => {
        editForm.setForm(f => ({ ...f, id: chatId }));
    }, [chatId]);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [addIds, setAddIds] = useState<number[]>([]);
    const [removeIds, setRemoveIds] = useState<number[]>([]);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(t);
    }, [search]);

    const { data: members, isFetching: membersLoading } = useGetUsersQuery(
        { chatId },
        { skip: !visible }
    );

    const { data: searchUsers, isFetching: searchLoading } = useGetUsersQuery(
        { query: debouncedSearch },
        { skip: !visible }
    );

    const filteredSearch = useMemo(() => {
        if (!searchUsers) return [];
        const memberIds = new Set(members?.map(m => m.id));
        return searchUsers.filter(u => !memberIds.has(u.id));
    }, [searchUsers, members]);

    const toggle = (
        id: number,
        list: number[],
        set: (v: number[]) => void
    ) => {
        set(list.includes(id) ? list.filter(x => x !== id) : [...list, id]);
    };

    const save = async () => {
        await editChat({
            id: chatId,
            name: editForm.form.name?.trim() || undefined,
            addUserIds: addIds,
            removeUserIds: removeIds,
        });

        close();
    };

    const close = () => {
        setSearch("");
        setAddIds([]);
        setRemoveIds([]);
        onClose();
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View className="flex-1 bg-black/50 items-center justify-center">
                <View className="w-[92%] max-h-[85%] bg-white dark:bg-zinc-900 rounded-xl">

                    <ScrollView className="p-4">

                        <Text className="text-lg font-semibold mb-3 text-zinc-900 dark:text-zinc-100">
                            Редагувати чат
                        </Text>

                        <InputField
                            placeholder="Назва чату"
                            value={editForm.form.name ?? ""}
                            onChangeText={editForm.onChange("name")}
                        />

                        <Text className="mt-4 mb-1 font-semibold text-zinc-700 dark:text-zinc-300">
                            Поточні учасники:
                        </Text>

                        {membersLoading && <ActivityIndicator />}

                        {members?.map(u => (
                            <View
                                key={u.id}
                                className="flex-row justify-between items-center bg-zinc-200 dark:bg-zinc-800 p-2 rounded-lg mb-1"
                            >
                                <Text className="text-zinc-900 dark:text-zinc-100">
                                    {u.name}
                                </Text>

                                <TouchableOpacity
                                    onPress={() =>
                                        toggle(u.id, removeIds, setRemoveIds)
                                    }
                                >
                                    <Text
                                        className={`font-semibold ${
                                            removeIds.includes(u.id)
                                                ? "text-red-500"
                                                : "text-emerald-500"
                                        }`}
                                    >
                                        {removeIds.includes(u.id)
                                            ? "Видалено"
                                            : "Видалити"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))}

                        <Text className="mt-4 mb-1 font-semibold text-zinc-700 dark:text-zinc-300">
                            Додати учасників:
                        </Text>

                        <InputField
                            additionalClass="mb-3"
                            placeholder="Пошук користувача..."
                            value={search}
                            onChangeText={setSearch}
                        />

                        {searchLoading && <ActivityIndicator />}

                        {filteredSearch.map(u => (
                            <TouchableOpacity
                                key={u.id}
                                onPress={() => toggle(u.id, addIds, setAddIds)}
                                className="flex-row justify-between items-center bg-zinc-200 dark:bg-zinc-800 p-2 rounded-lg mb-1"
                            >
                                <View className="flex-1 mr-2">
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode="tail"
                                        className="text-zinc-900 dark:text-zinc-100"
                                    >
                                        {u.name}
                                    </Text>
                                </View>

                                <Text
                                    className={`font-semibold ${
                                        addIds.includes(u.id)
                                            ? "text-emerald-500"
                                            : "text-zinc-500"
                                    }`}
                                >
                                    {addIds.includes(u.id)
                                        ? "Додано"
                                        : "Додати"}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        <View className="h-6" />
                    </ScrollView>

                    <View className="flex-row justify-end gap-4 p-3 border-t border-zinc-200 dark:border-zinc-800">
                        <TouchableOpacity onPress={close}>
                            <Text className="text-zinc-500">Скасувати</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={save} disabled={isLoading}>
                            <Text className="text-emerald-500 font-semibold">
                                {isLoading ? "Збереження..." : "Зберегти"}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default EditChatModal;
