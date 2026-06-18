import React from "react";
import { TextInput, TextInputProps } from "react-native";

interface InputFieldProps extends TextInputProps {
    placeholder: string;
    additionalClass?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ placeholder, ...props }) => {
    return (
        <TextInput
            placeholder={placeholder}
            placeholderTextColor="#9ca3af"
            className={"w-full bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-4 text-zinc-900 dark:text-white text-base " + props.additionalClass}
            {...props}
        />
    );
};
