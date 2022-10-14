import React from "react";
import { View, SafeAreaView } from "react-native";
import { Provider } from "react-redux";

import {store} from "./redux";
import Navigator from "./navigator";

class index extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <Provider store={store}>
                <SafeAreaView style={{flex: 1}}>
                    <Navigator/>
                </SafeAreaView>
            </Provider>
        )
    }
}

export default index;