import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Chart from './src/components/Chart';
import HeartList from './src/components/HeartList';
import Inform from './src/components/Inform';
import Story from './src/components/Story';
import Write from './src/components/Write';
import CalendarScreen from './src/components/CalendarScreen';

const Stack = createStackNavigator();

const App = () => {
    const [favorites, setFavorites] = useState([]);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Chart">
                <Stack.Screen
                    name="Chart"
                    component={Chart}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="HeartList"
                    component={HeartList}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Inform"
                    component={Inform}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Story"
                    component={Story}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Write"
                    component={Write}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="CalendarScreen"
                    component={CalendarScreen}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
