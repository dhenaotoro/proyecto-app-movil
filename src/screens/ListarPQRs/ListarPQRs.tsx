import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../navigation/RootNavigator";
import { fetchPqrs } from '../../services/Api';
import colors from '../../styles/colors';
import typography from '../../styles/typography';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'CrearPQRs' | 'ListarPQRs'>;
type ListarPQRsRouteProp = RouteProp<RootStackParamList, 'ListarPQRs'>;

export default function ListarPQRs(): React.JSX.Element {
  const screen = 'ListarPQRs';
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<ListarPQRsRouteProp>();
  const { userUuid, userName, executeList } = route.params;
  const [pqrData, setPqrData] = useState<{ id: string; status: string; channel: string; }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () : Promise<void> => {
    try {
      console.log("UUID", userUuid);
      setIsLoading(true);
      const response = await fetchPqrs(userUuid);
      console.log("Response from fetchPqrs:", response);
  
      // Check if response code is 200 and data is an array
      if (response.code === 200 || response.code === 202) {
        if (Array.isArray(response.data) && response.data.length > 0) {
          console.log("Fetched PQR data:", response.data);
          setPqrData(response.data);
        } else {
          console.info("There is no PQR data");
          setPqrData([]);
        }
      } else {
        console.info("Failed to fetch PQR data:", response.message || "No data available");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching PQR data:", error);
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (executeList) {
        fetchData();
        navigation.setParams({ executeList: false }); // Resetea para evitar nuevas ejecuciones automáticas
      }
    }, [executeList])
  );

  const handleRegisterPress = () => navigation.navigate('CrearPQRs', { userUuid, userName });

  const openChatbot = () => navigation.navigate('Chatbot', { userUuid, userName });

  const PQRRow = React.memo((pqrRow: {
    key: string;
    value: { id: string; status: string; channel: string; }
  }) : React.JSX.Element => (
    <View style={styles.pqrListRow}>
      <View style={styles.pqrListCell}>
        <TouchableOpacity style={styles.pqrListOpenButton} onPress={() => {}}>
          <View style={styles.pqrListRowContainer}>
            <Text style={pqrRow.value.status === 'Abierto' ? styles.openBulletPoint : styles.closedBulletPoint}>•</Text>
            <Text style={pqrRow.value.status === 'Abierto' ? styles.openButtonText : styles.closedButtonText}>
              {pqrRow.value.status}
            </Text>
          </View>
          <Text style={styles.pqrListOpenCode}>{pqrRow.value.id}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.pqrListCell}>
        <View style={styles.pqrListRowContainer}>
          <Text style={styles.pqrListAppText}>{pqrRow.value.channel}</Text>
        </View>
      </View>
    </View>
  ));

  return (
    <View style={{...styles.listarPqrsContainer}} testID={screen}>
      <Text style={styles.pqrListWelcomeText}>Bienvenido</Text>
      <Text style={styles.pqrListUsername}>{userName.toUpperCase()}</Text>
      <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={styles.listarPqrsScrollContainer}>
        <View style={styles.listarPqrsInnerContainer}>
          <Text style={styles.pqrText} testID={`${screen}.MainTitle`}>PQRs</Text>
            { pqrData.length === 0 
              ? (<Text style={styles.listarPqrsEmptyText}>{ isLoading 
                  ? 'Cargando datos...' 
                  : 'No hay PQR solicitados, por favor crear tu primer PQR usando la opción de Registra tu PQR.' }
                </Text>)
              : (
                <View style={styles.pqrListTable}>     
                  {pqrData.map((pqr: { id: string; status: string; channel: string; }, _) => ( <PQRRow key={pqr.id} value={pqr} /> ))}
                </View>)
            }

            <View style={styles.listarPqrsEmptyButtonContainer}>
              {<TouchableOpacity style={styles.listarPqrsButton} onPress={handleRegisterPress} testID="CrearPQRs.Button">
                <Text style={styles.listarPqrButtonText}>Registra tu PQR</Text>
              </TouchableOpacity>}
            </View>
        </View>
        <View style={{height: 182, flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{justifyContent: 'center'}}>
            <Text style={styles.seePollsLink}>Ver encuestas</Text>
          </View>
          <View>
            {<TouchableOpacity style={styles.listarPqrChatbot} onPress={openChatbot} testID="CrearPQRs.ChatbotButton">
              <Text style={styles.listarPqrBotText}>BOT</Text>
            </TouchableOpacity>}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  listarPqrsContainer: {
    flex: 1,
    padding: 20,
  },
  listarPqrsScrollContainer: {
    padding: 15
  },
  listarPqrsEmptyText: {
    marginTop: 88,
    width: 216,
    fontFamily: typography.nunitoSanzRegular,
    fontSize: typography.fontSizeSmall,
    letterSpacing: typography.letterSpacingMedium,
    lineHeight: typography.lineHeightSmall,
    color: colors.black
  },
  listarPqrsInnerContainer: {
    marginTop: 38,
    paddingHorizontal: 10,
    height: 'auto',
    elevation: 2,
    backgroundColor: colors.white,
    borderColor: colors.white,
    borderWidth: 0.2,
    borderRadius: 4,
    borderStyle: 'solid',
    alignItems: 'center',
  },
  pqrListWelcomeText: {
    marginTop: 0,
    letterSpacing: typography.letterSpacingMedium,
    lineHeight: typography.lineHeightSmall,
    fontFamily: typography.nunitoSanzRegular,
    fontSize: typography.fontSizeSmall,
    color: colors.black,
  },
  pqrListUsername: {
    marginTop: 0,
    letterSpacing: typography.letterSpacingMedium,
    lineHeight: typography.lineHeightXYZSmall,
    fontFamily: typography.nunitoSanzBold,
    fontSize: typography.fontSizeXYZSmall,
    color: colors.black,
  },
  pqrText: {
    marginLeft: -255,
    marginTop: 13,
    letterSpacing: typography.letterSpacingMedium,
    lineHeight: typography.lineHeightXYZSmall,
    fontFamily: typography.nunitoSanzBold,
    fontSize: typography.fontSizeXYZSmall,
    color: colors.black,
  },
  pqrListTable: {
    marginTop: 20,
    width: '100%'
  },
  pqrListRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
    paddingVertical: 5,
  },
  pqrListCell: {
    padding: 5,
    flex: 1,
    alignItems: 'center',
  },
  pqrListOpenButton: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  pqrListRowContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
  },
  openBulletPoint: {
    color: colors.brand_brown,
    letterSpacing: typography.letterSpacingNothing,
    lineHeight: typography.lineHeightSmall,
    fontFamily: typography.nunitoSanzRegular,
    fontSize: typography.fontSizeSmall,
    marginRight: 5,
  },
  openButtonText: {
    color: colors.brand_brown,
    letterSpacing: typography.letterSpacingNothing,
    lineHeight: typography.lineHeightSmall,
    fontFamily: typography.nunitoSanzRegular,
    fontSize: typography.fontSizeSmall,
  },
  closedBulletPoint: {
    color: colors.brand_green,
    lineHeight: typography.lineHeightSmall,
    fontFamily: typography.nunitoSanzRegular,
    fontSize: typography.fontSizeSmall,
    marginRight: 5,
  },
  closedButton: {
    color: colors.brand_green,
    letterSpacing: typography.letterSpacingNothing,
    lineHeight: typography.lineHeightSmall,
    fontFamily: typography.nunitoSanzRegular,
    fontSize: typography.fontSizeSmall,
  },
  closedButtonText: {
    color: colors.brand_green,
    letterSpacing: typography.letterSpacingNothing,
    lineHeight: typography.lineHeightSmall,
    fontFamily: typography.nunitoSanzRegular,
    fontSize: typography.fontSizeSmall,
  },
  pqrListOpenCode: {
    color: colors.black,
    letterSpacing: typography.letterSpacingNothing,
    lineHeight: typography.lineHeightSmall,
    fontFamily: typography.nunitoSanzRegular,
    fontSize: typography.fontSizeSmall,
    marginTop: 5,
  },
  pqrListAppText: {
    color: colors.black,
    letterSpacing: typography.letterSpacingNothing,
    lineHeight: typography.lineHeightSmall,
    fontFamily: typography.nunitoSanzRegular,
    fontSize: typography.fontSizeSmall,
    top: 0
  },
  listarPqrsEmptyButtonContainer: {
    marginTop: 75,
    width: 228,
    height: 150
  },
  listarPqrsButton: {
    marginTop: 0,
    height: 36,
    backgroundColor: colors.white,
    borderColor: colors.brand_green,
    borderWidth: 1,
    borderRadius: 4,
    borderStyle: 'solid',
    alignItems: 'center',
  },
  listarPqrButtonText: {
    fontFamily: typography.nunitoSanzBold,
    fontSize: typography.fontSizeMedium,
    letterSpacing: typography.letterSpacingMedium,
    lineHeight: typography.lineHeightXMedium,
    color: colors.black,
  },
  seePollsLink: {
    fontFamily: typography.nunitoSanzBold,
    fontSize: typography.fontSizeSmall,
    letterSpacing: typography.letterSpacingMedium,
    lineHeight: typography.lineHeightXYSmall,
    color: colors.black,
    textDecorationLine: 'underline',
    marginLeft: 122
  },
  listarPqrChatbot: {
    marginTop: 66,
    width: 60,
    backgroundColor: colors.brand_brown,
    borderColor: colors.brand_brown,
    height: 50,
    borderWidth: 1,
    borderRadius: 100,
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center'
  },
  listarPqrBotText: {
    fontFamily: typography.nunitoSanzBold,
    fontSize: typography.fontSizeSmall,
    letterSpacing: typography.letterSpacingMedium,
    lineHeight: typography.lineHeightXXMedium,
    color: colors.white,
  }
});
