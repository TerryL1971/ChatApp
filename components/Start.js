import React from 'react';
import { View, Text, Button, TextInput, StyleSheet, Image, ImageBackground, TouchableOpacity } from 'react-native';

export default class Start extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        name: '',
        backgroundColor: '',
    }
  }

  render() {
    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        <ImageBackground source={require('../assets/BackgroundImage.png')} resizeMode="cover" style={styles.image} >
        <Text style={styles.text}>Hello Start!</Text>
        <TextInput
          style={{ height: 60, borderColor: "gray", borderWidth: 1 }}
          onChangeText={(name) => this.setState({ name })}
          value={ this.state.name}
          placeholder="Type your name ..."
        />
        <Text style={styles.selectorText}>Choose your background colour</Text>
        <View style={styles.selectorsView}>
            <View style={styles.selectorsContainer}>
              <TouchableOpacity
                style={[styles.selector, { backgroundColor: '#090C08' }]}
                onPress={() => this.setState({ backgroundColor: '#090C08' })}
              />
            </View>
            <View style={styles.selectorsContainer}>
              <TouchableOpacity
                style={[styles.selector, { backgroundColor: '#474056' }]}
                onPress={() => this.setState({ backgroundColor: '#474056' })}
              />
            </View>
            <View style={styles.selectorsContainer}>
              <TouchableOpacity
                style={[styles.selector, { backgroundColor: '#8A95A5' }]}
                onPress={() => this.setState({ backgroundColor: '#8A95A5' })}
              />
            </View>
            <View style={styles.selectorsContainer}>
              <TouchableOpacity
                style={[styles.selector, { backgroundColor: '#B9C6AE' }]}
                onPress={() => this.setState({ backgroundColor: '#B9C6AE' })}
              />
            </View>
        </View>
        <Button
          style={styles.button}
          title="Go to Chat Screen"
          onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, backgroundColor: this.state.backgroundColor })} 
          // The navigation prop is passed to every component included in the Stack.Navigator
        />
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "stretch",
    justifyContent: "space-around",
  },
  text: {
    color: 'black',
    fontSize: 36,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
  },
  selectorText: {
    color: "black",
    textAlign: "center",
    paddingTop: 30,
    paddingBottom: 8,
  },
  selectorsView: {
    alignSelf: "center",
    flexDirection: 'row',
  },
  selectorsContainer: {
    padding: 2,
  },
  selector: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  button: {
    paddingTop: 30,
    alignSelf: "center",
    width: "100%",
  },
});