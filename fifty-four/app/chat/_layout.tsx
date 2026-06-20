import {Stack} from "expo-router";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {KeyboardAvoidingView, Platform} from "react-native";

export default function ChatLayout() {
    return (
        <SafeAreaProvider>
            <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
                <Stack screenOptions={{headerShown: false}}/>
           </KeyboardAvoidingView>
        </SafeAreaProvider>
    );
}
