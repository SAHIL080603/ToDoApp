import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{title: 'Home'}}/>
      <Stack.Screen name="details" options={{title: 'Group details'}}/>
      <Stack.Screen name="task" options={{title: 'Task discription'}}/>
      <Stack.Screen name="taskcreation" options={{title: 'Task Creation'}}/>
      <Stack.Screen name="taskedit" options={{title: 'Task Edit'}}/>
      <Stack.Screen name="groupcreation" options={{title: 'Group Creation'}}/>
    </Stack>
  );
}
