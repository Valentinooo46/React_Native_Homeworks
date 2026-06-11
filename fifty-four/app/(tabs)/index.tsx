import { Image } from 'expo-image';
import {ActivityIndicator, Pressable, StyleSheet, View, Text} from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import {Redirect, router} from 'expo-router';
import { useAppSelector } from "@/store";
import {authService, useMeQuery} from "@/service/AuthService";
import * as SecureStore from "expo-secure-store";
import { useDispatch } from "react-redux";
import {logout} from "@/store/reducers/AuthSlice";
import {Ionicons} from "@expo/vector-icons";


export default function HomeScreen() {
    const auth = useAppSelector(x => x.auth);
    const { data: me, isLoading, isError } = useMeQuery();
    const dispatch = useDispatch();

    if (auth == null) {
        return <Redirect href='/login' />;
    }
    const handleLogout = async () => {
        await SecureStore.deleteItemAsync("accessToken");
        dispatch(logout());
        dispatch(authService.util.resetApiState());
        router.replace("/login");
    };

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
            headerImage={
                <Image
                    source={{ uri: me?.image ? `https://p32-native.itstep.click/images/1200_${me.image}` : undefined }}
                    style={styles.profileImage}
                    contentFit="cover"
                />
            }>

            {isLoading && (
                <ThemedView className="flex-1 items-center justify-center py-10">
                    <ActivityIndicator size="large" />
                </ThemedView>
            )}

            {isError && (
                <ThemedView className="mx-4 mt-4 p-4 rounded-xl bg-red-50 border border-red-200 items-center">
                    <ThemedText className="text-red-600 text-sm text-center mb-3">
                        Не вдалося завантажити профіль
                    </ThemedText>

                    <Pressable
                        onPress={() => {
                            if(router.canGoBack()){
                                router.back();
                            }
                            else{
                                router.replace("/login");
                            }
                        }}
                        className="flex-row items-center px-4 py-2 bg-gray-200 rounded-lg"
                    >
                        <Ionicons name="arrow-back" size={20} color="black" />
                        <ThemedText className="ml-2 text-sm font-medium">
                            Повернутись назад
                        </ThemedText>
                    </Pressable>
                </ThemedView>
            )}

            {me && (
                <>
                    {/* Header: Avatar + Name */}
                    <ThemedView className="items-center pt-2 pb-2">
                        <View className="w-20 h-20 rounded-full overflow-hidden border-2 border-white shadow mb-3">
                            <Image
                                source={{ uri: me?.image ? `https://p32-native.itstep.click/images/200_${me.image}` : undefined }}
                                style={styles.profileImage}
                                contentFit="cover"
                            />
                        </View>
                        <ThemedText className="text-2xl font-semibold text-center">
                            {me.fullName}
                        </ThemedText>
                        <ThemedText className="text-sm text-gray-500 mt-1">
                            #{me.id}
                        </ThemedText>
                    </ThemedView>

                    <ThemedView className="items-center mt-4 mb-2">
                        <Pressable
                            onPress={()=>router.push("/chat")}
                            className="bg-blue-500 px-6 py-3 rounded-lg"
                        >
                            <Text className="text-white font-semibold">Перейти в чат</Text>
                        </Pressable>
                    </ThemedView>

                    {/* Info card */}
                    <ThemedView className="mx-4 rounded-2xl border border-gray-200 overflow-hidden">

                        <ThemedView className="flex-row items-center gap-3 px-4 py-3 border-b border-gray-100">
                            <ThemedText className="text-gray-400 text-xs w-28">
                                Повне імя
                            </ThemedText>
                            <ThemedText className="flex-1 text-sm font-medium">
                                {me.fullName}
                            </ThemedText>
                        </ThemedView>

                        <ThemedView className="flex-row items-center gap-3 px-4 py-3 border-b border-gray-100">
                            <ThemedText className="text-gray-400 text-xs w-28">
                                Електронна пошта
                            </ThemedText>
                            <ThemedText className="flex-1 text-sm font-medium text-blue-600">
                                {me.email}
                            </ThemedText>
                        </ThemedView>

                        <ThemedView className="flex-row items-center gap-3 px-4 py-3 border-b border-gray-100">
                            <ThemedText className="text-gray-400 text-xs w-28">
                                ID
                            </ThemedText>
                            <ThemedText className="flex-1 text-sm font-medium">
                                {me.id}
                            </ThemedText>
                        </ThemedView>

                        <ThemedView className="flex-row items-center gap-3 px-4 py-3">
                            <ThemedText className="text-gray-400 text-xs w-28">
                                Дата реєстрації
                            </ThemedText>
                            <ThemedText className="flex-1 text-sm font-medium">
                                {new Date(me.dateCreated).toLocaleDateString('uk-UA', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            </ThemedText>
                        </ThemedView>
                        <ThemedView className="items-center mt-10 mb-20">
                            <Pressable
                                onPress={handleLogout}
                                className="bg-red-500 px-6 py-3 rounded-lg"
                            >
                                <Text className="text-white font-semibold">Вийти</Text>
                            </Pressable>
                        </ThemedView>
                    </ThemedView>
                </>
            )}

        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    profileImage: {
        height: '100%',
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
    },
});