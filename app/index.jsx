import { Text, View, Pressable, StyleSheet, ScrollView, TextInput } from "react-native";
import { Link, useLocalSearchParams } from 'expo-router';
import * as SQLite from 'expo-sqlite';
import { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';


export default function Index() {
  const db=SQLite.openDatabaseSync('example.db');
  const [isLoading, setIsLoading]=useState(true);
  const [gnames, setGnames]=useState([])
  const { refreshKey } = useLocalSearchParams();
  const [refresh, setRefresh] = useState(0);
  //const [currentName, setCurrentName]=useState(undefined);

  useFocusEffect(
    useCallback(() => {
      // Increment the state to trigger a re-render
      Call();
      setRefresh(prev => prev + 1);
      
      // Optionally, you can return a cleanup function if needed
      return () => {
        // Cleanup code (if necessary)
      };
    }, [])
  );

  function Call(){
    try {
      
        db.execAsync(
          `CREATE TABLE IF NOT EXISTS tasks (
            tid INTEGER PRIMARY KEY AUTOINCREMENT, 
            gid INTEGER NOT NULL,
            gname TEXT,
            tname TEXT DEFAULT 'Dummy Task',
            stat INTEGER NOT NULL DEFAULT 0,
            CHECK(LENGTH(gname)<=50),
            CHECK(LENGTH(tname)<=100),
            CHECK(stat IN (1,0))
          )`,
        );
      
      const allRows = db.getAllSync('SELECT DISTINCT gname, gid FROM tasks');
      setGnames(allRows);
    } catch (error) {
      return(
        <Text>Error: {error.message}</Text>
      );
    }
  }

  useEffect(()=>{
    
    //console.log("hi1");
    //db.runAsync('INSERT INTO tasks (gid,gname,tname) VALUES (?, ?, ?)', 1, 'Test Group', 'Test task');
    Call();
      //db.runSync('DROP TABLE IF EXISTS tasks');
    setIsLoading(false);
    
  },[refreshKey])

  if(isLoading){
    return(
      <View
        style={styles.container}
      >
        <Text style={styles.heading}>ToDo App</Text>
        <Text style={{fontWeight:'semibold',fontSize:20}}>Loading...</Text>
      

      </View>
    );
  }

  // const addName = async()=>{
  //   const statement = await db.prepareAsync(
  //     'INSERT INTO names (name) VALUES ($value)'
  //   );
  //   try {
  //     let result = await statement.executeAsync({ $value: currentName});
  //     let existing=[...names];
  //     existing.push({id:result.lastInsertRowId, name:currentName});
  //     setNames(existing);
  //     console.log(names);
  //     setCurrentName(undefined);
      
  //   } finally {
  //     await statement.finalizeAsync();
  //   }

  // }

  const showNames=()=>{
    console.log(gnames);
    return gnames.map((gname,index)=>{
      return(
        <Link style={styles.taskItem} href={{ pathname: `/details`, params: {gid:JSON.stringify(gname.gid)}  }} key={index}>{gname.gid}-{gname.gname}</Link>
      );
    });
  }
  
  
  return (
    <View
      style={styles.container}
    >
      <Text style={styles.heading}>ToDo App</Text>
      <Link style={[styles.taskItem,{height:68, width:320, fontSize:16, backgroundColor:'#9cc2ff'}]} href={{ pathname: '/groupcreation'}}>Add a Group</Link>
      
      <ScrollView style={styles.taskContainer}>
      {showNames()}
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
