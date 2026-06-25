import { View, Text, TextInput, Pressable, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import {useRouter} from "expo-router";
import {loginSuccess} from "@/store/reducers/AuthSlice";
import {useAppDispatch} from "@/hooks/redux";
import {useState} from "react";
import IForgotPasswordModel from "@/models/IForgotPasswordModel";
import * as SecureStore from 'expo-secure-store';
import {useForgotPasswordMutation} from "@/service/AuthService";


export default function ForgotPasswordScreen() {
    const { control, handleSubmit } = useForm<IForgotPasswordModel>();
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
    const [serverError, setServerError] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const onSubmit = async (data: IForgotPasswordModel) => {
        console.log("Form data:", data);
        try {
            await forgotPassword(data).unwrap();
            await SecureStore.setItemAsync("resetEmail", data.email);

            console.log("Result forgot password is good send message");
            router.push("/verify-code");
            // if (result.token) {
            //     console.log(result.token);
            //     // 2. Hydrate your global Redux state
            //     dispatch(loginSuccess(result.token));
            //     //Потрібно зберегти глобально інформацію про користувача
            //     await SecureStore.setItemAsync('accessToken',  result.token);
            //     router.push("/chat/home");
            // }
        }
        catch (err: any) {
            console.error("Помилка авторизації:", err);

            // 1. Check if the backend returned a validation/error message payload
            if (err?.data?.message) {
                setServerError(err.data.message);
            }
            // 2. Check if it's a top-level RTK Query network fetch error
            else if (err?.status === 'FETCH_ERROR') {
                setServerError("Немає зв'язку з сервером. Перевірте інтернет.");
            }
            // 3. Fallback for any other unexpected status codes
            else {
                setServerError("Щось пішло не так. Спробуйте пізніше.");
            }
        }

    };

    // const onHandleToLogger = () => {
    //     router.push("/logger");
    // }

    return (
        <View className="flex-1 justify-center bg-zinc-50 items-center px-6">
            <Text className="text-3xl font-bold text-blue-600 mb-8">
                Відновлення пароля
            </Text>

            {serverError && (
                <View className="w-full max-w-md bg-red-100 border border-red-400 p-3 rounded-lg mb-4">
                    <Text className="text-red-700 text-center text-sm font-medium">
                        {serverError}
                    </Text>
                </View>
            )}

            <Controller control={control}
                        name="email"
                        rules={{ required: "Email обов’язковий" }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                placeholder="Email"
                                keyboardType="email-address"
                                value={value}
                                onChangeText={onChange}
                                placeholderClassName={"text-gray-600"}
                                className="w-full max-w-md bg-white rounded-lg px-4 py-3 mb-4 border border-gray-300"
                            />
                        )}
            />


            <View className="items-center w-full mt-4">
                <Pressable onPress={handleSubmit(onSubmit)}
                           className="w-full max-w-md bg-blue-500 rounded-lg py-3 items-center"
                >
                    <Text className="text-white font-semibold">Надіслати</Text>
                </Pressable>

                <TouchableOpacity
                    className="mb-6 mt-2"
                    onPress={() => router.replace('/login')}
                >
                    <Text className="font-spartan-semibold text-[13px] text-[#093030] dark:text-[#DFF7E2]">
                        Повернутися до логіну
                    </Text>
                </TouchableOpacity>


            </View>

        </View>
    );
}