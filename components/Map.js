import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Modal,
  DatePickerIOS,
  TouchableHighlight,
  Alert
} from "react-native";
import { MapView } from "expo";
import { Callout, Marker, ProviderPropType, PROVIDER_GOOGLE } from "react-native-maps";
import * as firebase from "firebase";

// import {createStackNavigator, createAppContainer} from 'react-navigation';
import EventForm from "./EventForm";
import { Form } from "./Form";
import { HitTestResultTypes } from "expo/build/AR";
import DateTimeInput from "./DateTimeInput";

const { width, height } = Dimensions.get("window");
const firebaseConfig = {
  apiKey: "AIzaSyAomUzviEzRitHhTK1IR9LJbfhU6_9CzBk",
  authDomain: "justpincase-c0785.firebaseapp.com",
  databaseURL: "https://justpincase-c0785.firebaseio.com",
  projectId: "justpincase-c0785",
  storageBucket: "justpincase-c0785.appspot.com",
  messagingSenderId: "357323316713"
};
//import this through config file later
var mapStyle = [
    {
        "featureType": "administrative",
        "elementType": "all",
        "stylers": [
            {
                "saturation": "-100"
            }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": 65
            },
            {
                "visibility": "on"
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "lightness": "50"
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            {
                "saturation": "-100"
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "all",
        "stylers": [
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "all",
        "stylers": [
            {
                "lightness": "30"
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "all",
        "stylers": [
            {
                "lightness": "40"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "all",
        "stylers": [
            {
                "saturation": -100
            },
            {
                "visibility": "simplified"
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "hue": "#ffff00"
            },
            {
                "lightness": -25
            },
            {
                "saturation": -97
            }
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels",
        "stylers": [
            {
                "lightness": -25
            },
            {
                "saturation": -100
            }
        ]
    }
]
const ASPECT_RATIO = width / height;
const LATITUDE = 41.5075;
const LONGITUDE = -81.60844;
const LATITUDE_DELTA = 0.007;
const LONGITUDE_DELTA = 0.01; //LATITUDE_DELTA * ASPECT_RATIO;
let id = 0;
if (!firebase.app.length) {
  firebase.initializeApp(firebaseConfig);
}
function randomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
}

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.setState = this.setState.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.readMarkers = this.readMarkers.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
    this.addEvent = this.addEvent.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.setColor = this.setColor.bind(this);
    this.toDateTime = this.toDateTime.bind(this);
    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      },
      markers: [],
      all_markers: [],
      markerButtonPressed: false,
      modalVisible: false,
      retrieved_markers: false
    };
  }

  setColor(category) {
    var color = "";
    if (category == "Free Food") {
      color = "green";
    }
    if (category == "Danger Zone") {
      color = "red";
    }
    if (category == "Sports") {
      color = "orange";
    }
    if (category == "Social") {
      color = "blue";
    }
    if (category == "Miscellaneous") {
      color = "grey";
    }
    return color;
  }

  addEvent(form) {
    firebase
      .database()
      .ref("events/")
      .push({
        form
      })
      .then(data => {
        console.log("addEventItself:" + data);
      });
  }

  componentDidMount() {
    this.readMarkers();
  }

  readMarkers() {
    var leadsRef = firebase.database().ref("events");
    leadsRef.once(
      "value",
      function(snapshot) {
        snapshot.forEach(
          function(childSnapshot) {
            var childData = childSnapshot.val();
            var formObj = Object.keys(childData.form).map(function(key) {
              return childData.form[key];
            });
            console.log(formObj);
            this.setState({
              all_markers: [
                ...this.state.all_markers,
                {
                  category: formObj[0],
                  coordinate: formObj[1],
                  description: formObj[2],
                  end_date: formObj[3],
                  group: formObj[4],
                  name: formObj[5],
                  start_date: formObj[6],
                  users: formObj[7]
                }
              ]
            });
          }.bind(this)
        );
      }.bind(this)
    );
  }

  onRegionChange(region) {
    this.setState({ region });
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  eventPopup() {}

  onMapPress(e) {
    this.setState({
      markers: [
        //...this.state.markers,
        {
          coordinate: e.nativeEvent.coordinate,
          key: id++,
          color: randomColor()
        }
      ],
      modalVisible: true
    });
  }

  onSubmit(form) {
    console.log(form);
    form["start_date"] = +form["start_date"];
    form["end_date"] = +form["end_date"];
    form["coordinate"] = this.state.markers[0].coordinate;
    this.addEvent(form);
    this.setModalVisible(false);
    this.setState({ markerButtonPressed: false });
    this.readMarkers();
  }

  markerClick() {
    Alert.alert(
      "Brings up popup with more detailed information about the event!"
    );
  }

  toDateTime(milliseconds) {
    var d = new Date(parseInt(milliseconds, 10));
    var ds = d.toString("MM/dd/yy HH:mm:ss");
    var dateTime = ds.substring(0, 21);
    if (
      dateTime[16] == "2" ||
      (dateTime[16] == "1" && parseInt(dateTime[17], 10) > 2)
    ) {
      var new_hr = (parseInt(dateTime[16] + dateTime[17], 10) - 12).toString();
      var fixedDateTime =
        dateTime.substring(0, 16) + new_hr + dateTime.substring(18, 21) + " PM";
      return fixedDateTime;
    } else if (dateTime[16] == "0" && dateTime[17] == "0") {
      var fixedDateTime =
        dateTime.substring(0, 16) + "12" + dateTime.substring(18, 21) + " AM";
      return fixedDateTime;
    } else if (parseInt(dateTime.substring(16, 18), 10) < 12) {
      if (dateTime[16] == "0") {
        return dateTime.substring(0, 16) + dateTime.substring(17, 21) + " AM";
      }
      return dateTime + " AM";
    } else if (parseInt(dateTime.subString(16, 18), 10) == 12) {
      return dateTime + " PM";
    }
  }

  render() {
    //this.setState({ retrieved_markers: true });
    if (this.state.markerButtonPressed) {
      return (
        <View style={styles.container}>
          <MapView
            provider={PROVIDER_GOOGLE}
            customMapStyle={mapStyle}
            style={styles.map}
            initialRegion={this.state.region}
            onPress={e => this.onMapPress(e)}
            showsUserLocation
          >
            {this.state.markers.map(marker => (
              <Marker
                key={marker.key}
                coordinate={marker.coordinate}
                pinColor={marker.color}
              />
            ))}
          </MapView>

          <View style={styles.formContainer}>
            <Modal
              visible={this.state.modalVisible}
              animationType="slide"
              transparent={false}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
              }}
            >
              <Form
                onSubmit={this.onSubmit}
                onCancel={() => this.setModalVisible(false)}
              />
            </Modal>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => this.setState({ markerButtonPressed: false })}
              style={styles.bubble_red}
            >
              <Text> Cancel </Text>
            </TouchableOpacity>
            <View
              // onPress={() => this.setState({ markers: [] })}
              style={styles.bubble}
            >
              <Text> Tap map to set marker </Text>
            </View>
          </View>
        </View>
      );
    } else {
      //this.readMarkers();
      return (
        <View style={styles.container}>
          <MapView
            provider={PROVIDER_GOOGLE}
            customMapStyle={mapStyle}
            style={styles.map}
            initialRegion={this.state.region}
            onRegionChange={this.onRegionChange}
            showsUserLocation
            showsMyLocationButton
          >
            {this.state.all_markers.map(marker => (
              <Marker
                title={marker.name}
                description={marker.description}
                coordinate={marker.coordinate}
                pinColor={this.setColor(marker.category)}
              >
                <MapView.Callout>
                  <TouchableHighlight
                    onPress={() => this.markerClick()}
                    underlayColor="white"
                  >
                    <View style={styles.calloutText}>
                      <Text>{marker.name}</Text>
                      <Text>{marker.description}</Text>
                      <Text>
                        {"Starts on " + this.toDateTime(marker.start_date)}
                      </Text>
                      <Text>
                        {"Ends on " + this.toDateTime(marker.end_date)}
                      </Text>
                    </View>
                  </TouchableHighlight>
                </MapView.Callout>
              </Marker>
            ))}
          </MapView>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => this.setState({ markerButtonPressed: true })}
              style={styles.bubble}
            >
              <Text> Create Marker </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bubble}>
              <Text> Filter </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }
}

Map.propTypes = {
  provider: ProviderPropType
};

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
    marginVertical: 20,
    backgroundColor: "transparent"
  },
  formContainer: {
    flexDirection: "column",
    marginVertical: "auto",
    backgroundColor: "transparent"
  }
});

export default Map;

// export default class Map extends Component {
//   constructor(props){
//     super(props);
//     this.setState = this.setState.bind(this);
//     this.state = {
//       region: {
//         latitude: 41.5075,
//         longitude: -81.60844,
//         latitudeDelta: 0.007,
//         longitudeDelta: 0.019,
//       },
//     }
//   }
//   getInitialState() {
//     return {
//         region: {
//         latitude: 41.5075,
//         longitude: -81.60844,
//         latitudeDelta: 0.007,
//         longitudeDelta: 0.019,
//       },
//     };
//   }
//   render() {
//     return (
//       <View style={styles.container}>
//         <MapView
//           style={styles.container}
//           region = {this.state.region}
//           onRegionChange = {this.onRegionChange}
//           style={{ flex: 1 }}
//           showsUserLocation
//           showsMyLocationButton
//         />
//           <SetMarker />
//       </View>
//     )
//   };
// }
// const styles = StyleSheet.create({
//   container: {
//     width: '100%',
//     height: '80%',
//   },
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
//   bubble: {
//     backgroundColor: 'rgba(255,255,255,0.7)',
//     paddingHorizontal: 18,
//     paddingVertical: 12,
//     borderRadius: 20,
//   },
//   latlng: {
//     width: 200,
//     alignItems: 'stretch',
//   },
//   button: {
//     width: 80,
//     paddingHorizontal: 12,
//     alignItems: 'center',
//     marginHorizontal: 10,
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     marginVertical: 20,
//     backgroundColor: 'transparent',
//   },
// });
