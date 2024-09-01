import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Link, useLocalSearchParams,useRouter } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

export default function Details() {
  const db=SQLite.openDatabaseSync('example.db');
  const [tasks, setTasks]=useState([]);
  const [group, setGroup]=useState();
  const { gid } = useLocalSearchParams();
  const GID = JSON.parse(gid);
  const [refresh, setRefresh] = useState(0);
  const route=useRouter();

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

  async function Call(){
    //console.log(GID);
    const statement = await db.prepareAsync('SELECT tid, gname, tname, stat FROM tasks WHERE gid = $value');
    try{
      const result=await statement.executeAsync({$value:GID});
      const allRows = await result.getAllAsync();
      if(allRows.length==0){
        route.back();
      }
      setTasks(allRows);
      setGroup(allRows[0].gname);
      //console.log(allRows);
      await result.resetAsync();
    }catch(error){
      console.log(error);
    }
  }

  useEffect(()=>{
    //console.log("hi1");
    //db.runAsync('INSERT INTO tasks (gid,gname,tname) VALUES (?, ?, ?)', 1, 'Test Group', 'Test task');
    const k=Call();
    
    //console.log(tasks);
    //db.runSync('DROP TABLE IF EXISTS names');
    //setIsLoading(false);
    
  },[])
    
    
    //console.log(parsedTasks);
  return (
    <View
      style={styles.container}
    >
      <Text style={styles.heading}>{group} Tasks</Text>
      <Link href={{ pathname: '/taskcreation', params: { groupId: JSON.stringify(GID) } }} style={styles.taskItem}>
          Add a New Task
      </Link>
      <ScrollView style={styles.taskContainer}>
      {tasks.map((item,index)=>(
        <Link href={{ pathname: '/task', params: { tid: JSON.stringify(item.tid) } }} key={index} style={styles.taskItem}>
          {item.tid} - {item.tname} - <Text style={[{color:item.stat?'green':'red'}]}>{item.stat ? "Completed" : "Pending"}</Text>
        </Link>
      ))}
      </ScrollView>
      
      
    </View>
  );
}

const styles=StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center",
    alignItems: "center",
    marginTop:100,

  },
  heading:{
    fontSize:30,
    color:"#000",
    fontWeight:"bold",
    marginBottom:20
    
  },
  taskContainer:{
    //width:"100%",
    height:500,
    marginTop:20,
    
  },
  taskItem:{
    width:300,
    height:50,
    backgroundColor:'#63d2f7',
    justifyContent:'center',
    alignItems:'center',
    textAlign:'center',
    textAlignVertical:'center',
    marginVertical:5,
    borderRadius:5,
    marginHorizontal:5,
  }
})