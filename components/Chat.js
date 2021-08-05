import React from 'react';
import { View, Text, Button, TextInput, StyleSheet, Platform, KeyboardAvoidingView } from 'react-native';

import { Bubble, GiftedChat, InputToolbar } from 'react-native-gifted-chat';

import { AsyncStorage } from 'react-native';
import NetInfo from '@react-native-community/netinfo'; //is user on- or offline? 

import firebase from 'firebase';
import firestore from 'firebase';

import MapView from 'react-native-maps';
// import { MapView } from 'expo';

import CustomActions from './CustomActions';

// const firebase = require('firebase');
//   require('firebase/firestore');
//   require('firebase/auth')

export default class Chat extends React.Component {

  constructor() {
    super();

    this.state = {
      messages: [],
      uid: 0,
      // _id: 0,
      user: {
        _id: '',
        name: '',
      },
      image: null,
      isConnected: false,
  };
    
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyDnp6rpY0OtWDoktSNC-j8rBAuwkxNqQh0",
        authDomain: "chatapp-77405.firebaseapp.com",
        projectId: "chatapp-77405",
        storageBucket: "chatapp-77405.appspot.com",
        messagingSenderId: "487738307478",
        appId: "1:487738307478:web:72844aa99ca1604718e3b7",
        measurementId: "G-EKRE4BQFH8"
      });
    }
  // create a reference to “messages” collection
    this.referenceChatMessages = firebase.firestore().collection('messages');
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    //go through each document:
    querySnapshot.forEach((doc) => {
      //get the QueryDocumentSnapshot's data:
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        uid: this.state.uid,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
        image: data.image,
        location: data.location
      });
    });
    this.setState({
        messages,
    });
  };

  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({ // add() = firestore method, save object to firestore
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text || '',
      uid: this.state.uid,
      user: message.user,
      image: message.image || null,
      // image: 'https://facebook.github.io/react-native/img/header_logo.png',
      location: message.location || null,
      // location: {
      //     latitude: 48.864601,
      //     longitude: 2.398704,
      // },
    })
  }

  handleConnectivityChange = (state) => {
    const isConnected = state.isConnected;
    if (isConnected == true) {
      this.setState({
        isConnected: true,
      });
      this.unsubscribe = this.referenceChatMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    } else {
      this.setState({
        isConnected: false,
      });
    }
  };

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  };

  async getMessages() { //async await
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  };

  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }),
      // save previous chat log
      () => {
        this.addMessage();
        this.saveMessages();
      }
    );
  }

  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    )
  }

  componentDidMount() {
    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log('online');
        this.authUnsubscribe = firebase.auth()
          .onAuthStateChanged(async (user) => {
            if (!user) {
              await firebase.auth().signInAnonymously();
            }

            this.setState({
              // isConnected: true,
              uid: user.uid,
              messages: [],
              user: {
                _id: user.uid,
                name: this.props.route.params.name,
              },
            });
            // this.referenceChatMessages = firebase.firestore().collection('messages');
            this.unsubscribe = this.referenceChatMessages
              .orderBy('createdAt', 'desc')
              .onSnapshot(this.onCollectionUpdate);
          });
      } else {
        console.log('offline');
        this.setState({
          isConnected: false
        });
        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
      this.authUnsubscribe();
      this.unsubscribe(); //stop listening for changes
  }


  //create the circle button
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  //render map view
  renderCustomView (props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  } 

  render() {
    let { name, backgroundColor } = this.props.route.params;
    this.props.navigation.setOptions({ title: name });

    return (
      //rendering chat interface
      //Gifted Chat provides its own component, comes with its own props
      //provide GiftedChat with custom messages, information, function etc.
      <View style={{ flex: 1, backgroundColor: backgroundColor }} >
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderCustomActions={this.renderCustomActions}
          renderActions={this.renderCustomActions}
          renderCustomView={this.renderCustomView}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          isConnected={this.state.isConnected}
          user={this.state.user}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      </View>
      );
    };
}

const styles = StyleSheet.create({
  text: {
    color: 'black',
    fontSize: 36,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
  },
  button: {
    paddingTop: 30,
    alignSelf: "center",
    width: "100%",
  },
});
