import {Redirect} from 'expo-router';
import { useAppSelector } from "@/store";

export default function HomeScreen() {
    const auth = useAppSelector(x => x.auth);

    if (auth == null) {
        return <Redirect href='/login' />;
    }
    else {
        return <Redirect href="/chat/home"/>;
    }
}

