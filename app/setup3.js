import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    PropTypes,
    Dimensions,
    PixelRatio,
    PanResponder,
    TouchableOpacity,
    TextInput,
    Animated,
    Modal
} from 'react-native';



class TPicker extends Component {

    static propTypes = {
        inputValue: PropTypes.string || PropTypes.number,
        animationType: PropTypes.string,
        transparent: PropTypes.bool,
        visible: PropTypes.bool,
        inputStyle: PropTypes.any,
        onValueChange: PropTypes.func,
        selectedValue: PropTypes.any,
        enable: PropTypes.bool
    };

    constructor(props, context){
        super(props, context);
        this.state = this._stateFromProps(props);
    }

    _stateFromProps(props){
        let selectedIndex = 0;
        let items = [];
        let pickerStyle = props.pickerStyle;
        let itemStyle = props.itemStyle;
        let onValueChange = props.onValueChange;
        let animationType = props.animationType||'none';
        let transparent = typeof props.transparent==='undefined'?true:props.transparent;
        let visible = typeof props.visible==='undefined'?false:props.visible;
        let inputValue = props.inputValue||'please chose';
        let enable = typeof props.enable==='undefined'?true:props.enable;
        React.Children.forEach(props.children, (child, index) => {
            child.props.value === props.selectedValue && ( selectedIndex = index );
            items.push({value: child.props.value, label: child.props.label});
        });
        return {
            selectedIndex,
            items,
            pickerStyle,
            itemStyle,
            onValueChange,
            animationType,
            transparent,
            visible,
            inputValue,
            enable
        };
    }

    _move(dy){
        let index = this.index;
        this.middleHeight = Math.abs(-index * 40 + dy);
        this.up && this.up.setNativeProps({
            style: {
                marginTop: (3 - index) * 30 + dy * .75,
            },
        });
        this.middle && this.middle.setNativeProps({
            style: {
                marginTop: -index * 40 + dy,
            },
        });
        this.down && this.down.setNativeProps({
            style: {
                marginTop: (-index - 1) * 30 + dy * .75,
            },
        });
    }

    _moveTo(index){
        let _index = this.index;
        let diff = _index - index;
        let marginValue;
        let that = this;
        if(diff && !this.isMoving) {
            marginValue = diff * 40;
            this._move(marginValue);
            this.index = index;
            this._onValueChange();
        }
    }

    _handlePanResponderMove(evt, gestureState){
        let dy = gestureState.dy;
        if(this.isMoving) {
            return;
        }
        // turn down
        if(dy > 0) {
            this._move(dy > this.index * 40 ? this.index * 40 : dy);
        }else{
            this._move(dy < (this.index - this.state.items.length + 1) * 40 ? (this.index - this.state.items.length + 1) * 40 : dy);
        }
    }

    _handlePanResponderRelease(evt, gestureState){
        let middleHeight = this.middleHeight;
        this.index = middleHeight % 40 >= 20 ? Math.ceil(middleHeight / 40) : Math.floor(middleHeight / 40);
        this._move(0);
        this._onValueChange();
    }

    componentWillMount(){
        this._panResponder = PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderRelease: this._handlePanResponderRelease.bind(this),
            onPanResponderMove: this._handlePanResponderMove.bind(this)
        });
        this.isMoving = false;
        this.index = this.state.selectedIndex;
    }


    _renderItems(items){
        let upItems = [], middleItems = [], downItems = [];
        items.forEach((item, index) => {

            upItems[index] = <Text
                key={'up'+index}
                style={[styles.upText, this.state.itemStyle]}
                onPress={() => {
									this._moveTo(index);
								}} >
                {item.label}
            </Text>;

            middleItems[index] = <Text
                key={'mid'+index}
                style={[styles.middleText, this.state.itemStyle]}>{item.label}
            </Text>;

            downItems[index] = <Text
                key={'down'+index}
                style={[styles.downText, this.state.itemStyle]}
                onPress={() => {
										this._moveTo(index);
									}} >
                {item.label}
            </Text>;

        });
        return { upItems, middleItems, downItems, };
    }

    _onValueChange(){
        var curItem = this.state.items[this.index];
        this.setState({selectedIndex:this.index});
        this.state.onValueChange && this.state.onValueChange(curItem.value, curItem.label);
    }




    confirmChose(){
        this.setState({text: (this.state.items[this.index]).label});
    }

    _setModalVisible(visible) {
        this.setState({visible: visible});
    }
    _setInputValue(value) {
        this.setState({inputValue: value});
    }
    _setEventBegin(){
        if(this.state.enable){
        this._setModalVisible(true)
        this.refs.test.blur()}
    }
    render(){
        let index = this.state.selectedIndex;
        let length = this.state.items.length;
        let items = this._renderItems(this.state.items);


        var modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : '#f5fcff',
        };
        var innerContainerTransparentStyle = this.state.transparent
            ? {backgroundColor: '#fff', padding: 20}
            : null;

        let upViewStyle = {
            marginTop: (3 - index) * 30,
            height: length * 30,
        };
        let middleViewStyle = {
            marginTop:  -index * 40,
        };
        let downViewStyle = {
            marginTop: (-index - 1) * 30,
            height:  length * 30,
        };
        return (
            <View style={testStyle.container}>
                <Modal
                    animationType={this.state.animationType}
                    transparent={this.state.transparent}
                    visible={this.state.visible}
                    onRequestClose={() => {this._setModalVisible(false)}}
                >
                    <View style={[testStyle.container, modalBackgroundStyle]}>
                        <View style={[testStyle.innerContainer, innerContainerTransparentStyle]}>

                            <View style={[styles.container, this.state.pickerStyle]} {...this._panResponder.panHandlers}>
                                <  View style={styles.nav}>
                                    <TouchableOpacity onPress={this.confirmChose}>
                                        <Text onPress={() => {this._setInputValue(this.state.items[this.state.selectedIndex].label)
                    this._setModalVisible(false)}}
                                              style={styles.confirm}>Confirm</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity>
                                        <Text onPress={() => {this._setModalVisible(false)
                    }}
                                              style={styles.cancel} >Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.up}>
                                    <View style={[styles.upView, upViewStyle]} ref={(up) => { this.up = up }} >
                                        { items.upItems }
                                    </View>
                                </View>

                                <View style={styles.middle}>
                                    <View style={[styles.middleView, middleViewStyle]} ref={(middle) => { this.middle = middle }} >
                                        { items.middleItems }
                                    </View>
                                </View>

                                <View style={styles.down}>
                                    <View style={[styles.downView, downViewStyle]} ref={(down) => { this.down = down }} >
                                        { items.downItems }
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
                <TextInput
                    editable = {this.state.enable}
                    style = {this.props.inputStyle}
                    ref = 'test'
                    onFocus={() => { this._setEventBegin()
                   }}
                    placeholder={this.state.inputValue}
                    value={this.state.inputValue}
                />
            </View>
        );
    }
}


let width = Dimensions.get('window').width;
let height = Dimensions.get('window').height;
let top = height - 250;
let ratio = PixelRatio.get();
let styles = StyleSheet.create({

    container: {

        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    nav: {
        paddingLeft:10,
        paddingRight:10,
        width: width,
        flex: 1,
        flexDirection: 'row',
        height: 28,
        justifyContent: 'space-between'
    },
    confirm: {
        alignSelf: 'center',
    },
    cancel: {
        alignSelf: 'center',
    },
    up: {
        height: 90,
        overflow: 'hidden'
    },
    upView: {
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    upText: {
        paddingTop: 0,
        height: 30,
        fontSize: 20,
        color: '#000',
        opacity: .5,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0
    },
    middle: {
        height: 40,
        width: width,
        overflow: 'hidden',
        borderColor: '#aaa',
        borderTopWidth: 1/ratio,
        borderBottomWidth: 1/ratio
    },
    middleView: {
        height: 40,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    middleText: {
        paddingTop: 0,
        height: 40,
        color: '#000',
        fontSize: 28,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0
    },
    down: {
        height: 90,
        overflow: 'hidden'
    },
    downView: {
        overflow: 'hidden',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    downText: {
        paddingTop: 0,
        height: 30,
        fontSize: 16,
        color: '#000',
        opacity: .5,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0
    }

});

const testStyle = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    innerContainer: {
        marginTop:top,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    row: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        marginBottom: 20,
    },
    rowTitle: {
        flex: 1,
        fontWeight: 'bold',
    },

})

export default TPicker;
