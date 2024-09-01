import { Text, View, Pressable, StyleSheet } from "react-native";
import { Link, router, useLocalSearchParams } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';


export default function Task() {
  const { tid } = useLocalSearchParams();
  const TID = JSON.parse(tid);
  //console.log(TID);
  const [tname, setTask]=useState();
  const [stat, setStat]=useState();
  const [refresh, setRefresh] = useState(0);
  
  const db = SQLite.openDatabaseSync('example.db');

  async function Call(){
    const statement = await db.prepareAsync('SELECT tname, stat FROM tasks WHERE tid = $value');
    try{
      const result=await statement.executeAsync({$value:TID});
      const row = await result.getAllAsync();
      setTask(row[0].tname);
      setStat(row[0].stat);
      //console.log(row[0]);
      //console.log('hi');
      //console.log(tname);
      await result.resetAsync();
    }catch(error){
      console.log(error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      // Increment the state to trigger a re-render
      setRefresh(prev => prev + 1);
      Call();
      // Optionally, you can return a cleanup function if needed
      return () => {
        // Cleanup code (if necessary)
      };
    }, [])
  );

  useEffect(()=>{
    //console.log("hi1");
    //db.runAsync('INSERT INTO tasks (gid,gname,tname) VALUES (?, ?, ?)', 1, 'Test Group', 'Test task');
    const k=Call();
    //console.log(task);
    //console.log('hi from useeffect');
    //db.runSync('DROP TABLE IF EXISTS names');
    //setIsLoading(false);
    
  },[])

  function markAndUnmrk(){
    console.log(stat);
    if(!stat){
      db.runAsync('UPDATE tasks SET stat = 1 WHERE tid = ?', TID);
      alert("Task maked as Done");
    }else{
      db.runAsync('UPDATE tasks SET stat = 0 WHERE tid = ?', TID);
      alert("Task unmarked as Done");
    }
    Call();
  }

  function deleteTask(){
    if(TID){
      db.runAsync('DELETE FROM tasks WHERE tid = ?', TID);
      alert("Task Deleted");
      Call();
      router.back();
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{fontSize:20, marginBottom:10}}>{TID}-{tname} - <Text style={[{color:stat?'green':'red'}]}>{stat ? "Completed" : "Pending"}</Text></Text>
      
      
      <View style={styles.buttonContainer}>
        <Pressable style={[styles.button,{backgroundColor : stat?'#9cc2ff':'#6bffab'}]} onPress={markAndUnmrk}>
          <Text style={styles.buttonLabel}>{!stat?'Mark it Done':'Unmark as Done'}</Text>
        </Pressable>
      </View>
      <Link style={[styles.taskItem]} href={{ pathname: '/taskedit', params:{taskId:JSON.stringify(TID)}}}>Edit</Link>
      
      <View style={styles.buttonContainer}>
        <Pressable style={[styles.button,{backgroundColor : "#fc7474"}]} onPress={deleteTask}>
          <Text style={styles.buttonLabel}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles=StyleSheet.create({
  taskItem:{
    fontSize:16,
    width:315,
    height:58,
    backgroundColor:'#9cc2ff',
    justifyContent:'center',
    alignItems:'center',
    textAlign:'center',
    textAlignVertical:'center',
    marginVertical:5,
    borderRadius:10,
    marginHorizontal:5,
  },
  buttonLabel: {
    color: 'black',
    fontSize: 16,
  },
  buttonContainer: {
    width: 320,
    height: 68,
    marginHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  button: {
    backgroundColor : '#9cc2ff',
    borderRadius: 10,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
})