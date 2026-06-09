import {TouchableOpacity, Text, Image} from "react-native";

interface ImagePickerButtonProps {
    imageUri: string | null;
    onPress: () => void;
}

export const ImagePickerButton: React.FC<ImagePickerButtonProps> =
    ({imageUri, onPress}) => {
        return (
            <TouchableOpacity
                activeOpacity={0.8}
                className={"w-36 h-36 rounded-full bg-emerald-500/10 items-center justify-center"}
                onPress={onPress}
            >
                {imageUri ? (
                    <Image source={{uri: imageUri}} className="w-36 h-36 rounded-full"/>
                ) : (
                    <Text className="text-8xl">📷</Text>
                )
                }
            </TouchableOpacity>
        )
    }