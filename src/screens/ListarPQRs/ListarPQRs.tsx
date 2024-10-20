import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MainHeader from '../../components/Header/MainHeader';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { fetchPqrs } from '../../services/Api';
import { signOut, type SignOutInput} from "aws-amplify/auth";

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'CrearPQRs'>;
type ListarPQRsRouteProp = RouteProp<RootStackParamList, 'ListarPQRs'>;

export default function ListarPQRs(): React.JSX.Element{
  const screen = 'ListarPQRs';
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<ListarPQRsRouteProp>();
  const { userUuid } = route.params;

  // Use a constant for username since it's hardcoded
  const [pqrData, setPqrData] = useState<{ id: string, status: string, channel: string}[]>([]); // null indicates loading state

  // Memoize the fetchData function to prevent unnecessary recreation
  const fetchData = useCallback(async () => {
    try {
      const data: { id: string, status: string, channel: string }[] = await fetchPqrs(userUuid);
      console.log("Fetched PQR data:", data);
      setPqrData(data);
    } catch (error) {
      console.error("Error fetching PQR data:", error);
    }
  }, [userUuid]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoized function for navigation to prevent re-renders
  const handleRegisterPress = useCallback(() => navigation.navigate('CrearPQRs'), [navigation]);

  const handleSignOut = async () => {
    try {
      await signOut({ global: true } as SignOutInput);
      console.log('Se realizó sign out exitosamente');
      navigation.navigate('Login', { userId: userUuid });
    } catch (error) {
      console.log('Error signing out: ', error);
    }
  }

  // Memoized PQR row component to optimize re-renders
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
      <Text style={styles.username} onPress={() => handleSignOut()}>IVAN</Text>
      <Text style={styles.pqrText} testID={`${screen}.MainTitle`}>PQRs</Text>

      {/* Conditionally render based on the state of pqrData */}
      {pqrData === null ? (
        <Text>Cargando PQRs...</Text>
      ) : pqrData.length === 0 ? (
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
