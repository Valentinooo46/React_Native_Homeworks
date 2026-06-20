import {KeyboardAvoidingView, Platform, View} from "react-native";
import {Slot, Stack} from "expo-router";
import {AuthTabs} from "@/components/auth/AuthTabs";
import {SafeAreaView} from "react-native-safe-area-context";

export default function AuthLayout() {
    return (
            <View className="flex-1 bg-white dark:bg-zinc-950">
                <View className="flex-1 p-6">
                    <KeyboardAvoidingView
                        style={{flex: 1}}
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
                    >
                        <Slot/>
                        <AuthTabs/>
                    </KeyboardAvoidingView>
                </View>
            </View>

    );
}
