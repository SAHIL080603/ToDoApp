import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import * as SQLite from 'expo-sqlite';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router'


export default function Groupcreation() {
  const db=SQLite.openDatabaseSync('example.db');
  const [currentName, setCurrentName]=useState(undefined);
  const [gid, setGid]=useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  

  function Call(){
    const allRows = db.getFirstSync('SELECT MAX(gid) AS max_gid FROM tasks');
    console.log(allRows.max_gid);
    if(allRows.max_gid!=null){
      console.log(allRows.max_gid+1);
      setGid(allRows.max_gid+1);
      console.log(gid);
    }
  }

  useEffect(()=>{
    Call();
    
  },[gid])

  const addName = async()=>{
    if(currentName){
      console.log(currentName);
      const statement = await db.prepareAsync(
        'INSERT INTO tasks (gid,gname) VALUES ($gid,$gname)'
      );
      try {
        let result = await statement.executeAsync({ $gid:gid,$gname: currentName});
        await result.resetAsync();
        setCurrentName(undefined);
        setRefreshKey(prevKey => prevKey + 1);
        Call();
        router.back();

      } finally {
        await statement.finalizeAsync();
      }
    }

  }

  return (
    <View>
        <Text style={styles.heading}>Enter name of new Group</Text>
        <Text style={{textAlign:'center'}}>(Max length 50 characters)</Text>
        <TextInput multiline style={styles.input} maxLength={50} placeholder="Input Here" value={currentName} onChangeText={setCurrentName}/>
        <Pressable style={styles.button} onPress={addName}><Text>Create Group</Text></Pressable>
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
