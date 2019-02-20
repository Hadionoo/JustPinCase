import { MapView } from "expo";
import { Marker, ProviderPropType } from "react-native-maps";
import {
  FormLabel,
  FormInput,
  FormValidationMessage
} from "react-native-elements";

import React from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  Modal
} from "react-native";
import RegisterForm from "./RegisterForm";
import Map from "./Map";
import * as firebase from "firebase";

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.setState = this.setState.bind(this);
    this.state = {
      email: "",
      password: "",
      error: "",
      modalVisible: false
    };
  }

  onSubmit = (email, password) => {
    firebase.auth().createUserWithEmailAndPassword(email, password);
    Alert.alert("You've signed up!");
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  loginUser = (email, password) => {
    try {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(function(user) {
          Alert.alert("You've successfully logged in!");
        });
    } catch (err) {
      console.log(err.toString());
      Alert.alert(
        "The email and password you have entered are not formatted properly"
      );
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text>Login</Text>
        <TextInput
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Email"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
        />
        <TextInput
          secureTextEntry
          style={styles.textInput}
          autoCapitalize="none"
          placeholder="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
        />
        <Button
          title="Login"
          onPress={() => this.loginUser(this.state.email, this.state.password)}
        />
        <Button
          title="Don't have an account? Sign Up"
          onPress={() => this.setModalVisible(true)}
        />
        <View style={styles.formContainer}>
          <Modal
            visible={this.state.modalVisible}
            animationType="slide"
            transparent={false}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <RegisterForm
              onSubmit={this.onSubmit}
              onCancel={() => this.setModalVisible(false)}
            />
          </Modal>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  textInput: {
    height: 40,
    width: "90%",
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 8,
    textAlign: "center"
  }
});
