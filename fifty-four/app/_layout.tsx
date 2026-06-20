import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {Slot, Stack, usePathname} from 'expo-router';
import {StatusBar} from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';
import {useColorScheme} from '@/hooks/use-color-scheme';
import {Provider} from "react-redux";
import {store} from "@/store";
import * as SecureStore from 'expo-secure-store';
import {loginSuccess} from "@/store/reducers/AuthSlice";
import {useEffect, useState} from "react";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {AuthTabs} from "@/components/auth/AuthTabs";
import {KeyboardAvoidingView, Platform} from "react-native";


export default function RootLayout() {

    const pathname = usePathname();

    console.log("MainLayout pathname--", pathname);

    console.log("----Layout Working----");
    //token
    //await SecureStore.getItemAsync('accessToken');
    const [storageReady, setStorageReady] = useState(false);

    useEffect(() => {
        initStore().then(() => {
            setStorageReady(true)
        });
    }, []);

    async function initStore(): Promise<void> {
        const accessToken  = await SecureStore.getItemAsync('accessToken');
        // console.log("User info", accessToken);
        if (accessToken) {
            store.dispatch(loginSuccess(accessToken));
            // console.log("User info", accessToken);
        }
    }
    const colorScheme = useColorScheme();


    if (!storageReady) {
        return null;
    }

    return (
        <>
            {/*<SafeAreaProvider>*/}
            {/*<Provider store={store}>*/}
            {/*    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>*/}
            {/*        <Stack>*/}
            {/*            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>*/}
            {/*            <Stack.Screen name="(auth)" options={{headerShown: false}}/>*/}
            {/*            <Stack.Screen name="mychat" options={{ headerShown: false }} />*/}
            {/*            /!*<Stack.Screen name="chat/home" options={{ headerShown: false }} />*!/*/}
            {/*            <Stack.Screen name="modal" options={{presentation: 'modal', title: 'Modal'}}/>*/}
            {/*            <Stack.Screen name="logger" options={{headerShown: false}}/>*/}
            {/*        </Stack>*/}
            {/*        <StatusBar style="auto"/>*/}
            {/*    </ThemeProvider>*/}
            {/*</Provider>*/}
            {/*</SafeAreaProvider>*/}

            <Provider store={store}>
                <SafeAreaProvider>

                    <Stack screenOptions={{ headerShown: false }} />

                </SafeAreaProvider>
            </Provider>

        </>

    );
}
