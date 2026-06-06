import {View, KeyboardAvoidingView, Platform} from "react-native";
import {Slot} from "expo-router";
import {AuthTabs} from "../../components/auth/AuthTabs";
import {SafeAreaView} from "react-native-safe-area-context";

export default function AuthLayout() {
    return (
        <View className="flex-1 bg-white dark:bg-zinc-950">
            <SafeAreaView className="flex-1 p-6">
                <Slot/>
                <AuthTabs/>
            </SafeAreaView>
        </View>
    );
}
