import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import {useLocalSearchParams,useRouter} from 'expo-router'
import * as SQLite from 'expo-sqlite';
import { useState, useEffect } from 'react';

export default function Taskcreation() {
  const router=useRouter();
    const {groupId}=useLocalSearchParams();
    const gId=JSON.parse(groupId);
    console.log(gId);

    const db=SQLite.openDatabaseSync('example.db');
    const [currentName, setCurrentName]=useState(undefined);
    const [gname, setGname]=useState(undefined);

    function Call(){
      const allRows=db.getFirstSync(`SELECT gname FROM tasks WHERE gid=${gId}`)
      console.log(allRows.gname);
      setGname(allRows.gname);
    }

    useEffect(()=>{
      Call();
    },[gname])

    const addName = async()=>{
      if(currentName){
        console.log(currentName);
        const statement = await db.prepareAsync(
          'INSERT INTO tasks (gid,gname,tname) VALUES ($gid,$gname,$tname)'
        );
        try {
          let result = await statement.executeAsync({ $gid:gId,$gname: gname,$tname: currentName});
          await result.resetAsync();
          setCurrentName(undefined);
          Call();
          router.back();
  
        } finally {
          await statement.finalizeAsync();
        }
      }
  
    }

  return (
    <View>
        <Text style={styles.heading}>Enter your Task</Text>
        <Text style={{textAlign:'center'}}>(Max length 100 characters)</Text>
        <TextInput multiline style={styles.input} maxLength={100} placeholder="Input Here" value={currentName} onChangeText={setCurrentName}/>
        <Pressable style={styles.button} onPress={addName}><Text>Create Task</Text></Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
    heading:{
        fontSize:30,
        color:"#000",
        fontWeight:"bold",
        marginVertical:20,
        textAlign:'center'
      },
    input:{
        borderColor:'black',
        borderWidth:2,
        borderRadius:10,
        padding:10,
        fontSize:18,
        marginHorizontal:20,
    },
    button: {
        backgroundColor : '#9cc2ff',
        borderRadius: 10,
        
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        height:50,
        margin:20,
      },
})
