import {Text, TouchableOpacity} from "react-native";

export function AuthTab({
                            label,
                            emoji,
                            active,
                            onPress,
                        }: {
    label: string;
    emoji: string;
    active: boolean;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity
            onPress={onPress}
            className={`flex-1 py-3 rounded-xl items-center ${
                active
                    ? "bg-zinc-200 dark:bg-zinc-800"
                    : ""
            }`}
        >
            <Text
                className={`text-base font-semibold ${
                    active
                        ? "text-zinc-900 dark:text-white"
                        : "text-zinc-500 dark:text-zinc-400"
                }`}
            >
                {emoji} {label}
            </Text>
        </TouchableOpacity>
    );
}