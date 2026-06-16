import { useState } from "react";

export function useForm<T extends Record<string, any>>(initialState: T) {
    const [form, setForm] = useState<T>(initialState);

    const onChange =
        <K extends keyof T>(key: K) =>
            (value: T[K]) => {
                setForm((prev) => ({
                    ...prev,
                    [key]: value,
                }));
            };

    return {
        form,
        setForm,
        onChange,
    };
}
