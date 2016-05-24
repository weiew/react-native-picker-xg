/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    View,
    Text,
    StyleSheet,
    Platform,
    PickerIOS,
    TouchableOpacity,
    TextInput,
    TouchableHighlight
} from 'react-native';
import Tpicker from './app/setup3';


let TPicker = Platform.OS === 'ios' ? PickerIOS : Tpicker;
let PickerItem = TPicker.Item;


let CAR_MAKES_AND_MODELS = {
    amc: {
        name: 'AMC',
    },
    alfa: {
        name: 'Alfa-Romeo',
    },
    aston: {
        name: 'Aston Martin',
    },
    audi: {
        name: 'Audi',
    },
    austin: {
        name: 'Austin',
    },
    borgward: {
        name: 'Borgward',
    },
    buick: {
        name: 'Buick',
    },
    cadillac: {
        name: 'Cadillac',
    },
    chevrolet: {
        name: 'Chevrolet',
    },
};
let CAR_MAKES_AND_MODELS1 = {
    amc1: {
        name: 'AMC1',
    },
    alfa1: {
        name: 'Alfa-Romeo1',
    },
    aston1: {
        name: 'Aston Martin1',
    },
    audi1: {
        name: 'Audi1',
    },
};


class TpickerEx extends Component {
    constructor(props, context){
        super(props, context);
        this.state = {
            carMake: 'cadillac',
            modelIndex: 3,
        }
    }


    render() {
        return (
            <View style={testStyle.container}>
                            <TPicker
                                selectedValue={this.state.carMake}
                                onValueChange={(carMake) => this.setState({carMake, modelIndex: 0})}
                                ref={(picker) => { this.picker = picker }} >

                                {Object.keys(CAR_MAKES_AND_MODELS).map((carMake) => (
                                    <PickerItem
                                        key={carMake}
                                        value={carMake}
                                        label={CAR_MAKES_AND_MODELS[carMake].name}
                                    />
                                ))}
                            </TPicker>
                <TPicker
                    inputStyle = {testStyle.inputStyle}
                    selectedValue={'audi1'}
                    onValueChange={(carMake) => this.setState({carMake, modelIndex: 0})}
                    ref={(picker) => { this.picker = picker }} >

                    {Object.keys(CAR_MAKES_AND_MODELS1).map((carMake) => (
                        <PickerItem
                            key={carMake}
                            value={carMake}
                            label={CAR_MAKES_AND_MODELS1[carMake].name}
                        />
                    ))}
                </TPicker>
                <TPicker
                    enable = {false}
                    inputValue = {'暂时不可选择'}
                    inputStyle = {testStyle.inputStyle2}
                    selectedValue={this.state.carMake}
                    onValueChange={(carMake) => this.setState({carMake, modelIndex: 0})}
                    ref={(picker) => { this.picker = picker }} >

                    {Object.keys(CAR_MAKES_AND_MODELS1).map((carMake) => (
                        <PickerItem
                            key={carMake}
                            value={carMake}
                            label={CAR_MAKES_AND_MODELS1[carMake].name}
                        />
                    ))}
                </TPicker>
            </View>

        );
    }
}

const testStyle = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    inputStyle: {
        marginTop: -200,
        backgroundColor: 'pink',
    },
    inputStyle2: {
        marginTop: -400,
        backgroundColor: 'lightblue',
    }

})
AppRegistry.registerComponent('widgets', () => TpickerEx);
