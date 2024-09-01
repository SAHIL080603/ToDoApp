import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import {useLocalSearchParams, useRouter} from 'expo-router'
import * as SQLite from 'expo-sqlite';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export default function Taskcreation() {
    const router=useRouter();
    const {taskId}=useLocalSearchParams();
    const tId=JSON.parse(taskId);
    //console.log(tId);

    const db=SQLite.openDatabaseSync('example.db');
    const [task,setTask]=useState();
    const [currentName, setCurrentName]=useState(undefined);
    const [refresh, setRefresh] = useState(0);

    useFocusEffect(
      useCallback(() => {
        // Increment the state to trigger a re-render
        setRefresh(prev => prev + 1);
  
        // Optionally, you can return a cleanup function if needed
        return () => {
          // Cleanup code (if necessary)
        };
      }, [])
    );

    useEffect(()=>{
      Call();
      if(currentName==undefined){
        setCurrentName(task);
      }
    },[task])

    async function Call(){
      //console.log(GID);
      const statement = await db.prepareAsync('SELECT tname FROM tasks WHERE tid = $value');
      try{
        const result=await statement.executeAsync({$value:tId});
        const allRows = await result.getFirstAsync();
        setTask(allRows.tname);
        //setGroup(allRows[0].gname);
        //console.log(allRows);
        await result.resetAsync();
      }catch(error){
        console.log(error);
      }
    }

    const addName = async()=>{
      if(currentName){
        console.log(currentName);
        const statement = await db.prepareAsync(
          'UPDATE tasks SET tname=$tname WHERE tid=$tid'
        );
        try {
          let result = await statement.executeAsync({ $tname: currentName, $tid:tId});
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
        <Text style={styles.heading}>Edit your Task</Text>
        <Text style={{textAlign:'center'}}>(Max length 100 characters)</Text>
        <TextInput multiline style={styles.input} maxLength={100} placeholder="Input Here" value={currentName} onChangeText={setCurrentName}/>
        <Pressable style={styles.button} onPress={addName}><Text>Save Task</Text></Pressable>
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
