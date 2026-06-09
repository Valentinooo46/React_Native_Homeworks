import {
    View, Text, TextInput,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar
} from "react-native";
import {useForm, Controller} from "react-hook-form";
import {ImagePickerButton} from "@/components/form/ImagePickerButton";
import {useDispatch} from "react-redux";
import {router} from "expo-router";

import * as ImagePicker from "expo-image-picker"
import * as SecureStore from "expo-secure-store";
import {useRegisterMutation} from "@/service/AuthService";
import {loginSuccess} from "@/store/reducers/AuthSlice";


type RegisterFormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    imageFile: any | null;
};


export default function RegisterScreen() {
    const {control, handleSubmit, setValue, watch} = useForm<RegisterFormData>();
    const [registerUser, {isLoading}] = useRegisterMutation();

    const dispatch = useDispatch();

    const image = watch("imageFile");

    const pickImage = async () => {
        // console.log("Pick image");
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            alert("Доступ до галереї потрібен для вибору фото.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const asset = result.assets[0];

            setValue("imageFile", {
                uri: asset.uri,
                name: "avatar.jpg",
                type: "image/jpeg",
            });
        }

    }


    const onSubmit = async  (data: RegisterFormData) => {
        try {
            // const model : IRegisterModel =
            //     {
            //         ...data,
            //         imageFile: {...data.imageFile  }
            //     };
            const response = await registerUser(data).unwrap();
            const token = response.token;
            dispatch(loginSuccess(token));
            await SecureStore.setItemAsync("accessToken", token);
            router.replace("/(tabs)/explore");

        } catch (e) {
            console.log("Register error:", e);
            alert("Помилка реєстрації");
        }
    };

    return (

        <View className="flex-1 bg-zinc-50 dark:bg-zinc-950">
            <StatusBar barStyle="default"/>

            <KeyboardAvoidingView
                style={{flex: 1}}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                        paddingBottom: 80,
                        flexGrow: 1,
                    }}
                >

                    <View className="items-center px-6">
                        <Text className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-8">
                            Реєстрація користувача
                        </Text>

                        <View className="items-center my-6">
                            <ImagePickerButton
                                imageUri={image?.uri ?? null}
                                onPress={pickImage}
                            />
                            <Text className="text-zinc-400 dark:text-zinc-300 mt-2">
                                Натисніть, щоб обрати фото
                            </Text>
                        </View>
                        <Controller control={control}
                                    name="firstName"
                                    rules={{required: "Ім’я обов’язкове"}}
                                    render={({field: {onChange, value}}) => (
                                        <TextInput
                                            placeholder="Ім’я"
                                            value={value}
                                            onChangeText={onChange}
                                            className="w-full max-w-md bg-white dark:bg-zinc-800
                                               text-black dark:text-white
                                               rounded-lg px-4 py-3 mb-4
                                               border border-gray-300 dark:border-zinc-700"
                                        />
                                    )}
                        />
                        <Controller control={control}
                                    name="lastName"
                                    rules={{required: "Прізвище обов’язкове"}}
                                    render={({field: {onChange, value}}) => (
                                        <TextInput
                                            placeholder="Прізвище"
                                            value={value}
                                            onChangeText={onChange}
                                            className="w-full max-w-md bg-white dark:bg-zinc-800
                                               text-black dark:text-white
                                               rounded-lg px-4 py-3 mb-4
                                               border border-gray-300 dark:border-zinc-700"
                                        />
                                    )}
                        />
                        <Controller control={control}
                                    name="email"
                                    rules={{required: "Email обов’язковий"}}
                                    render={({field: {onChange, value}}) => (
                                        <TextInput
                                            placeholder="Email"
                                            keyboardType="email-address"
                                            value={value}
                                            onChangeText={onChange}
                                            className="w-full max-w-md bg-white dark:bg-zinc-800
                                               text-black dark:text-white
                                               rounded-lg px-4 py-3 mb-4
                                               border border-gray-300 dark:border-zinc-700"
                                        />
                                    )}
                        />

                        <Controller control={control}
                                    name="password"
                                    rules={{required: "Пароль обов’язковий"}}
                                    render={({field: {onChange, value}}) => (
                                        <TextInput placeholder="Пароль"
                                                   secureTextEntry
                                                   value={value}
                                                   onChangeText={onChange}
                                                   className="w-full max-w-md bg-white rounded-lg px-4 py-3 mb-6 border border-gray-300"
                                        />
                                    )}
                        />

                        <Pressable onPress={handleSubmit(onSubmit)}
                                   disabled={isLoading}
                                   className="w-full max-w-md bg-blue-500 rounded-lg py-3 items-center"
                        >
                            <Text className="text-white font-semibold">
                                {isLoading ? "Завантаження..." : "Зареєструватися"}
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}