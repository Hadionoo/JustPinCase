import React from "react";
import {
  Button,
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Modal,
  DatePickerIOS,
  TextInput,
  Picker,
  ScrollView
} from "react-native";
import { MapView } from "expo";
import { Marker, ProviderPropType } from "react-native-maps";
import {
  FormLabel,
  FormInput,
  FormValidationMessage
} from "react-native-elements";
import DropDownInput from "./DropDownInput";
import DateTimeInput from "./DateTimeInput";

export class Form extends React.Component {
  constructor(props) {
    super(props);
    this.setState = this.setState.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.state = {
      name: "",
      start_date: new Date(),
      end_date: new Date(),
      description: "",
      tags: [],
      category: "Miscellaneous",
      users: "",
      group: ""
    };
  }

  changeFormState(name) {
    return value => this.setState({ [name]: value });
  }

  submitForm() {
    this.setState({ start_date: this.state.start_date });
    this.setState({ end_date: this.state.end_date });
    this.props.onSubmit(this.state);
  }
  render() {
    return (
      <ScrollView style={{ marginTop: 30 }}>
        <View style={styles.formContainer}>
          <Input label="Name">
            <TextInput
              placeholder="Lets go to Jolly!"
              value={this.state.name}
              onChangeText={this.changeFormState("name")}
            />
          </Input>
          <Input label="Description">
            <TextInput
              placeholder="Description"
              value={this.state.description}
              onChangeText={this.changeFormState("description")}
            />
          </Input>
          <Input label="Start Date">
            <DateTimeInput
              value={this.state.start_date}
              onChange={this.changeFormState("start_date")}
            />
          </Input>
          <Input label="End Date">
            <DateTimeInput
              value={this.state.end_date}
              onChange={this.changeFormState("end_date")}
            />
          </Input>
          <Input label="Category">
            <DropDownInput
              items={[
                "Sports",
                "Social",
                "Free Food",
                "Danger Zone",
                "Miscellaneous"
              ]}
              value={this.state.category}
              style={{ height: 50, width: 100 }}
              onChange={this.changeFormState("category")}
            />
          </Input>
          <Input label="Add User">
            <TextInput
              placeholder="Jane Doe"
              value={this.state.users}
              onChangeText={this.changeFormState("users")}
            />
          </Input>
          <Input label="Add Group">
            <TextInput
              placeholder="Hack CWRU 6"
              value={this.state.group}
              onChangeText={this.changeFormState("group")}
            />
          </Input>
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={this.props.onCancel} title="Cancel" />
          <Button onPress={() => this.submitForm()} title="Submit" />
        </View>
      </ScrollView>
    );
  }
}

const Input = ({ label, error, children }) => (
  <View style={{ marginBottom: 10, marginTop: 10, marginHorizontal: 10 }}>
    {label && <Text style={{ fontWeight: "bold" }}>{label}</Text>}
    <View
      style={{
        paddingLeft: 2,
        paddingVertical: 10,
        borderRadius: 4,
        borderColor: error ? "red" : "black",
        borderWidth: 1
      }}
    >
      {children}
    </View>
    {error && <Text style={{ color: "red" }}>{error}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
  bubble: {
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20
  },
  bubble_red: {
    backgroundColor: "rgba(255,0,0,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20
  },
  latlng: {
    width: 200,
    alignItems: "stretch"
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10
  },
  exit_button: {
    width: 20,
    paddingHorizontal: 12,
    alignItems: "flex-start",
    marginHorizontal: 10
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    backgroundColor: "transparent"
  },
  formContainer: {
    flexDirection: "column",
    marginVertical: "auto",
    backgroundColor: "transparent"
  }
});

export default Form;
