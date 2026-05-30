import { View, Text, TextInput, Pressable } from "react-native";
import { useForm, Controller } from "react-hook-form";

type RegisterFormData = {
    email: string;
    password: string;
};

export default function RegisterScreen() {
    const { control, handleSubmit } = useForm<RegisterFormData>();


    const onSubmit = (data: RegisterFormData) => {
        console.log("Form data:", data);
    };

    return (
        <View className="flex-1 justify-center items-center bg-gray-100 px-6">
            <Text className="text-3xl font-bold text-blue-600 mb-8">
                Реєстрація користувача
            </Text>

            <Controller control={control}
                        name="email"
                        rules={{ required: "Email обов’язковий" }}
                        render={({ field: { onChange, value } }) => (
                            <TextInput
                                placeholder="Email"
                                keyboardType="email-address"
                                value={value}
                                onChangeText={onChange}
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
                <Text className="text-white font-semibold">Зареєструватися</Text>
            </Pressable>
        </View>
    );
}