import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Keyboard, Platform } from "react-native";
import { router, usePathname } from "expo-router";
import { AuthTab } from "@/components/auth/AuthTab";

export function AuthTabs() {
    const pathname = usePathname();
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
        const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

        const showSubscription = Keyboard.addListener(showEvent, () => setKeyboardVisible(true));
        const hideSubscription = Keyboard.addListener(hideEvent, () => setKeyboardVisible(false));

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    if (isKeyboardVisible) return null;

    return (
        <View className="px-4 pb-6 bg-zinc-100 dark:bg-zinc-900">
            <View className="flex-row rounded-2xl p-1">
                <AuthTab
                    label="Вхід"
                    emoji="🔐"
                    active={pathname === "/login"}
                    onPress={() => router.replace("/login")}
                />
                <AuthTab
                    label="Реєстрація"
                    emoji="✨"
                    active={pathname === "/register"}
                    onPress={() => router.replace("/register")}
                />
            </View>

            <TouchableOpacity
                onPress={() => router.replace("/")}
                className="mt-3 items-center"
            >
                <Text className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    🏠 На головну
                </Text>
            </TouchableOpacity>
        </View>
    );
}