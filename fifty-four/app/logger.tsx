import NetworkLogger from 'react-native-network-logger';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoggerScreen = () => {
    return (
        <>
            <SafeAreaView style={{flex: 1}}>
                <NetworkLogger/>
            </SafeAreaView>
        </>
    )
}

export default LoggerScreen;