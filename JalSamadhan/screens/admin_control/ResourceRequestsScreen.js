import React, { useContext, useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, StyleSheet } from 'react-native';
import Context from '../../ContextAPI';
function ResReqScreen({ navigation, route }) {
  const context = useContext(Context);
  const { cat } = route.params;
  const [data, setdata] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    async function getdata() {
      const response = await context.GetResReq(cat);
      setdata(response);
    }
    getdata();
  }, [refreshing]);

  const onRefresh = () => {
    setRefreshing(true);
    // You can also add logic here to fetch updated data from an API
    // After fetching data, set refreshing to false to stop the loading indicator
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // Simulated delay for refreshing
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Request History</Text>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {data.length !== 0 ? (
          data.map((item, index) => (
            <View key={index} style={styles.requestContainer}>
              <Text>Details: {item.details}</Text>
              <Text>Address: {item.add}</Text>
              <Text>latitude: {item.latitude}</Text>
              <Text>longitude: {item.longitude}</Text>
              <Text>Status : {item.solved === 0 ? "Pending" : "Solved"}</Text>
              {item.solved === 0 && (
                <TouchableOpacity
                  style={{
                    backgroundColor: "green",
                    padding: 10,
                    marginVertical: 10,
                  }}
                  onPress={async () => {
                    const response = await context.ApproveReq(item.id, 1);
                    onRefresh();
                  }}
                >
                  <Text style={{ textAlign: "center", color: "white" }}>
                    Mark As Resolved
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        ) : (
          <Text>No Requests present Data</Text>
        )}
      </ScrollView>

      {/* Approve Button */}
      {/* {true && (

      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  requestContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    paddingVertical: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ResReqScreen;
