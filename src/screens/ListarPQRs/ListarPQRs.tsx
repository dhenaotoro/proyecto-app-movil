import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import MainHeader from '../../components/Header/MainHeader';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { fetchPqrs } from '../../services/Api';
import { signOut, type SignOutInput} from "aws-amplify/auth";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'CrearPQRs'>;
type ListarPQRsRouteProp = RouteProp<RootStackParamList, 'ListarPQRs'>;

export default function ListarPQRs(): React.JSX.Element {
  const screen = 'ListarPQRs';
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<ListarPQRsRouteProp>();
  const { userUuid, name } = route.params;

  const [pqrData, setPqrData] = useState<{ id: string, status: string, channel: string }[]>([]);

  const fetchData = async () => {
    try {
      console.log("UUID", userUuid);
      const response = await fetchPqrs(userUuid);
      console.log("Response from fetchPqrs:", response);
  
      // Check if response code is 200 and data is an array
      if (response.code === 200) {
        if (Array.isArray(response.data) && response.data.length > 0) {
          console.log("Fetched PQR data:", response.data);
          setPqrData(response.data);
        } else {
          console.warn("No PQR data found for this UUID");
          setPqrData([]); // Optionally set to an empty array or handle accordingly
        }
      } else {
        console.error("Failed to fetch PQR data:", response.message || "No data available");
      }
    } catch (error) {
      console.error("Error fetching PQR data:", error);
    }
  };

  fetchData(); // Call fetchData when userUuid changes

  const handleRegisterPress = () => navigation.navigate('CrearPQRs', { userUuid, name });

  const handleSignOut = async () => {
    try {
      await signOut({ global: true } as SignOutInput);
      console.log('Se realizó sign out exitosamente');
      navigation.navigate('Login', { userId: userUuid });
    } catch (error) {
      console.log('Error signing out: ', error);
    }
  }

  const PQRRow = React.memo(({ pqr }) => (
    <View style={styles.row}>
      <View style={styles.cell}>
        <TouchableOpacity style={styles.openButton} onPress={() => {}}>
          <View style={styles.rowContainer}>
            <Text style={pqr.status === 'Abierto' ? styles.openBulletPoint : styles.closedBulletPoint}>•</Text>
            <Text style={pqr.status === 'Abierto' ? styles.openButtonText : styles.closedButtonText}>
              {pqr.status}
            </Text>
          </View>
          <Text style={styles.openCode}>{pqr.id}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cell}>
        <Text style={styles.appText}>{pqr.channel}</Text>
      </View>
    </View>
  ));

  return (
    <View style={styles.container} testID={screen}>
      <MainHeader />
      <Text style={styles.welcomeText}>Bienvenido</Text>
      <Text style={styles.username} onPress={() => handleSignOut()}>{name}</Text>
      <Text style={styles.pqrText} testID={`${screen}.MainTitle`}>PQRs</Text>

      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      {pqrData.length === 0 ? (
        <Text>No hay PQR solicitados, por favor crear tu primer PQR usando la opción de Registra tu PQR</Text>
      ) : (
        <View style={styles.table}>     
          {pqrData.map((pqr, index) => (
            <PQRRow key={index} pqr={pqr} />
          ))}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.registerButton} onPress={handleRegisterPress} testID="CrearPQRs.Button">
          <Text style={styles.registerButtonText}>Registra tu PQR</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    color: '#CC430A',
    fontSize: 34,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  welcomeText: {
    color: 'black',
    fontSize: 18,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#000000',
    paddingVertical: 20,
  },
  pqrText: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#000000',
  },
  table: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 5,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
  },
  openButton: {
    padding: 10,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  rowContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  openButtonText: {
    color: '#CC430A',
    fontWeight: 'bold',
  },
  openBulletPoint: {
    color: '#CC430A',
    fontSize: 24,
    marginRight: 5,
  },
  closedBulletPoint: {
    color: '#4DCC0A',
    fontSize: 24,
    marginRight: 5,
  },
  closedButton: {
    backgroundColor: '#4DCC0A',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closedButtonText: {
    color: '#4DCC0A',
    fontWeight: 'bold',
  },
  openCode: {
    color: 'black',
    marginTop: 5,
  },
  appText: {
    fontWeight: 'bold',
    color: 'black',
  },
  buttonContainer: {
    marginTop: 40,
  },
  registerButton: {
    borderWidth: 2,
    borderColor: '#4DCC0A',
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});
