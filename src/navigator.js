import React from 'react';
import { View, BackHandler, LogBox } from 'react-native';
import { Scene, Stack, Router, Tabs, Actions } from 'react-native-router-flux';
import Splash from './screens/splash-screen'
import CalendarView from './screens/calendar-view'
import Setting from './screens/setting'
import Text from './screens/text'

class App extends React.Component {
    onBackHandler(){
        const scene = Actions.currentScene;
        if(scene === 'landing' || scene === 'home'){
            BackHandler.exitApp();
            return true;
        }
        Actions.pop();
        return true;
    }

    render(){
        return (
            <Router
                backAndroidHandler={() => this.onBackHandler()}
            >
                <Stack key="root">
                    <Scene back key="setting" component={Setting} title="Setting" />
                    <Scene back key="text" component={Text} title="Text" />
                    <Scene key="home" component={CalendarView} hideNavBar />
                    <Scene key="splash" component={Splash} hideNavBar initial />
                </Stack>
            </Router>
        )
    }
}

export default App