import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Dimensions, Alert, ImageBackground } from 'react-native';
import { toDoTheme } from "./colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import BouncyCheckbox from "react-native-bouncy-checkbox";
import IMGBG from './Images/ToDoBg.jpg';

const STORAGE_KEY = "@toDos";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const mon = {
  "0" : "JAN",
  "1" : "FEB",
  "2" : "MAR",
  "3" : "APR",
  "4" : "MAY",
  "5" : "JUN",
  "6" : "JUL",
  "7" : "AUG",
  "8" : "SEP",
  "9" : "OCT",
  "10" : "NOV",
  "11" : "DEC",
};

export default function Todo() {
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const onChangeText = (payload) => setText(payload);

  const today = new Date();
  const month = today.getMonth();
  const date = today.getDate();

  const handleCheck = (key) => {
    if(toDos[key].checked === false) {
      toDos[key] = { ...toDos[key], checked: true };
    } else{
      toDos[key] = { ...toDos[key], checked: false };
    }
    const newToDos = { ...toDos, [key]: toDos[key] };
    setToDos(newToDos);
    saveToDos(newToDos);
  };


  const saveToDos = async(toSave) => {
    //convert toDos to string
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  };
  const loadToDos = async() => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    //make items object
    setToDos(JSON.parse(s));
  };
  
  useEffect(() => { //component가 mount될때 실행
    loadToDos();
  }, []);
  const addToDo = async() => {
    if(text === ""){
      return;
    }
    const newToDos = {
      ...toDos,
      [Date.now()]: {text, checked: false},
    };
    //save to do
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  const deleteToDo = (key) => {
    Alert.alert("Delete To Do", "Are you sure?", [
      {text: "Cancel", style: "destructive"},
      {text: "Yes", onPress: () => {
        const newToDos = {...toDos};
        delete newToDos[key];
        setToDos(newToDos);
        saveToDos(newToDos);
        },
      },
    ]);    
  };

  
    
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ImageBackground source={IMGBG} style={styles.image}>
      <View style={styles.date}>
        <Text style={styles.dateText}>{mon[month]}. {date}</Text>
      </View>
      
      <View style={styles.toDoBox}>
        <TextInput 
        onSubmitEditing={addToDo}
        returnKeyType="done"
        onChangeText={onChangeText}
        value={text}
        placeholder={"Add a To Do"} 
        style={styles.addToDo} />
      
        <ScrollView>
          {Object.keys(toDos).map((key) => 
            <View key={key} style={styles.toDo}>
              <BouncyCheckbox 
                isChecked={toDos[key].checked} 
                onPress={() => handleCheck(key)}
                size={20}
                text={toDos[key].text}
                textStyle={{ color: "black" }}
                iconStyle={{ borderColor: "black" }}
                fillColor="black"
              />
              <View style={styles.icons}>
                <TouchableOpacity
                  onPress={() => deleteToDo(key)}
                  hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }} >
                  <Feather name="delete" size={20} color={toDoTheme.deleteIcon} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
    </View>
    </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  date: {
    flex: 1.5,
    paddingVertical: 10,
    marginLeft: 10,
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    borderBottomWidth: 1,
  },
  dateText: {
    fontSize: 28,
    fontWeight: "600",
  },
  toDoBox: {
    flex: 9.5,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  addToDo: {
    backgroundColor: toDoTheme.addToDoBox,
    width: SCREEN_WIDTH-10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: toDoTheme.toDoBg,
    width: SCREEN_WIDTH-10,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  toDoText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },
  icons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});