import { View, Text, TextInput, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";
import {useRouter} from "expo-router";
import {authService} from "@/service/AuthService";
import {loginSuccess} from "@/store/reducers/AuthSlice";
import {useAppDispatch} from "@/hooks/redux";
import {useState} from "react";
import ILoginModel from "@/models/ILoginModel";



export default function LoginScreen() {
    const { control, handleSubmit } = useForm<ILoginModel>();
    const [login, { isLoading }] = authService.useLoginMutation();
    const [serverError, setServerError] = useState<string | null>(null);
    const dispatch = useAppDispatch();
    const router = useRouter();



    const onSubmit = async (data: ILoginModel) => {
        console.log("Form data:", data);
        try {
            const result = await login(data).unwrap();

            if (result.token) {
                console.log(result.token);
                // 2. Hydrate your global Redux state
                dispatch(loginSuccess(result.token));
                router.push("/explore");
            }
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



    return (
        <View className="flex-1 justify-center items-center bg-gray-100 px-6">
            <Text className="text-3xl font-bold text-blue-600 mb-8">
                Увійти в акаунт
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

            <Controller control={control}
                        name="password"
                        rules={{ required: "Пароль обов’язковий" }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput placeholder="Пароль"
                                       secureTextEntry
                                       value={value}
                                       onChangeText={onChange}
                                       className="w-full max-w-md bg-white rounded-lg px-4 py-3 mb-6 border border-gray-300"
                            />
                        )}
            />

            <Pressable onPress={handleSubmit(onSubmit)}
                       className="w-full max-w-md bg-blue-500 rounded-lg py-3 items-center"
            >
                <Text className="text-white font-semibold">Увійти</Text>
            </Pressable>
        </View>
    );
}