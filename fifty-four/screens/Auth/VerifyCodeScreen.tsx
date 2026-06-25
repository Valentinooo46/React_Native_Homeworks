import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useResetPasswordMutation } from "@/service/AuthService";
import * as SecureStore from "expo-secure-store";
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from "react-native-confirmation-code-field";

const CELL_COUNT = 6;

export default function VerifyCodeScreen() {
    const router = useRouter();
    const [resetPassword, { isLoading }] = useResetPasswordMutation();
    const [value, setValue] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });

    const handleSubmit = async () => {
        if (value.length !== 6) {
            alert("Введіть усі 6 цифр");
            return;
        }
        if (!newPassword.trim()) {
            alert("Введіть новий пароль");
            return;
        }

        try {
            const email = await SecureStore.getItemAsync("resetEmail");
            await resetPassword({
                email: email!,
                code: value,
                newPassword,
            }).unwrap();

            alert("Пароль успішно змінено");
            router.replace("/login");
        } catch (err: any) {
            console.error("Помилка:", err);
            alert("Невірний або прострочений код");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Введіть код з пошти</Text>

            <CodeField
                ref={ref}
                {...props}
                value={value}
                onChangeText={setValue}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                renderCell={({ index, symbol, isFocused }) => (
                    <Text
                        key={index}
                        style={[styles.cell, isFocused && styles.focusCell]}
                        onLayout={getCellOnLayoutHandler(index)}
                    >
                        {symbol || (isFocused ? <Cursor /> : null)}
                    </Text>
                )}
            />

            <TextInput
                style={styles.passwordInput}
                placeholder="Новий пароль"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isLoading}>
                <Text style={styles.buttonText}>{isLoading ? "Зміна..." : "Підтвердити"}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
    codeFieldRoot: { marginTop: 20 },
    cell: {
        width: 48,
        height: 56,
        lineHeight: 56,
        fontSize: 24,
        borderWidth: 1,
        borderColor: "#d1d5db",
        textAlign: "center",
        margin: 4,
        borderRadius: 8,
        backgroundColor: "#fff",
    },
    focusCell: { borderColor: "#10b981" },
    passwordInput: {
        width: "80%",
        borderWidth: 1,
        borderColor: "#d1d5db",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginTop: 20,
        fontSize: 16,
        backgroundColor: "#fff",
    },
    button: { backgroundColor: "#10b981", paddingVertical: 14, paddingHorizontal: 40, borderRadius: 12, marginTop: 24 },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});