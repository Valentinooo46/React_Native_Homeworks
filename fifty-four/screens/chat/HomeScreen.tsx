import {View, Text, StatusBar, TouchableOpacity, Image, ScrollView} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {LinearGradient} from "expo-linear-gradient";
import {router} from "expo-router";
import {useAppSelector, useAppDispatch} from "@/store";
import {BASE_URL_IMAGES} from "@/api";
import * as SecureStore from "expo-secure-store";
import {logout} from "@/store/reducers/AuthSlice";
import {authService} from "@/service/AuthService";

export default function HomeScreen() {
    const {user} = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();

    const onLogout = async () => {
        await SecureStore.deleteItemAsync("accessToken");
        dispatch(logout());
        dispatch(authService.util.resetApiState());
        router.replace("/login");
    };

    return (
        <View className="flex-1 bg-zinc-50 dark:bg-zinc-950">
            <StatusBar barStyle="default"/>

            <LinearGradient
                colors={["rgba(16,185,129,0.35)", "transparent"]}
                className="absolute w-full h-[380px] rounded-full blur-[120px]"
            />

            <SafeAreaView className="flex-1 px-8 justify-between">
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{paddingBottom: 10}}
                >
                    <View className="items-center mt-10 py-1">
                        <View className="bg-emerald-500/10 px-4 py-1 rounded-full mb-4 border border-emerald-500/20">
                            <Text
                                className="text-emerald-600 dark:text-emerald-400 text-[10px] font-bold tracking-[3px] uppercase">
                                чат система
                            </Text>
                        </View>

                        <Text
                            className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter text-center">
                            Привіт,{" "}
                            <Text className="text-emerald-500">
                                {user?.name ?? "Гість"}
                            </Text>
                        </Text>

                        <View className="h-[2px] w-12 bg-emerald-500 my-6 rounded-full"/>
                    </View>

                    <View className="items-center my-8">
                        <View className="relative">

                            <View className="w-44 h-44 rounded-full bg-emerald-500/10 items-center justify-center overflow-hidden">
                                {user?.image && BASE_URL_IMAGES ? (
                                    <Image
                                        source={{uri: `${BASE_URL_IMAGES}400_${user.image}`}}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <Text className="text-7xl">👤</Text>
                                )}
                            </View>

                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={() => router.push("/profile")}
                                className="absolute bottom-1 right-1 w-12 h-12 rounded-full bg-emerald-500 items-center justify-center shadow-lg"
                            >
                                <Text className="text-xl">✏️</Text>
                            </TouchableOpacity>

                        </View>
                    </View>

                    <View className="gap-y-5">

                        <View className="relative">
                            <View className="absolute top-1 left-0 right-0 bottom-[-4] bg-emerald-700 rounded-2xl"/>

                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={() => router.push('/chat/create')}
                                className="bg-emerald-500 py-4 rounded-2xl items-center"
                            >
                                <Text className="text-white text-xl font-bold tracking-tight">
                                    Створити новий чат
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={() => router.push("/chat/join")}
                            className="border border-zinc-300 dark:border-zinc-700 py-4 rounded-2xl items-center"
                        >
                            <Text className="text-zinc-900 dark:text-zinc-100 text-lg font-semibold">
                                Підключитися до чату
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            activeOpacity={0.85}
                            onPress={onLogout}
                            className="bg-red-500/10 border border-red-500/20 py-4 rounded-2xl items-center"
                        >
                            <Text className="text-red-500 text-xl font-bold tracking-tight">
                                Вийти з аккаунту
                            </Text>
                        </TouchableOpacity>

                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
