import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Encuestas' | 'EncuestaBot'>;
type EncuestasRouteProp = RouteProp<RootStackParamList, 'Encuestas'>;

export function Encuestas(): React.JSX.Element {
  const screen = 'Encuestas';
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<EncuestasRouteProp>();
  const { userUuid, userName, executeList } = route.params;
  const staticData = [
    { id: '1', description: 'Encuesta satisfacción', channel: 'Seguros Automóvil' },
    { id: '2', description: 'Encuesta atención al usuario', channel: 'Seguros Hogar' },
    { id: '3', description: 'Encuesta producto tecnología AVR', channel: 'Supermarket Ahorro' },
  ];

  const openEncuestaBot = () => navigation.navigate('EncuestaBot', { userUuid });

  const SurveyRow = React.memo((survey: { key: string; value: { description: string; channel: string; } }) => (
    <View style={styles.surveyListRow}>
      <View style={styles.surveyListCell}>
        <TouchableOpacity onPress={openEncuestaBot} testID={`${screen}.EncuestaBot.${survey.value.description}`}>
          <Text style={styles.surveyDescription}>{survey.value.description}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.surveyListCell}>
        <Text style={styles.surveyChannel}>{survey.value.channel}</Text>
      </View>
    </View>
  ));

  return (
    <View style={styles.encuestasContainer}>
      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.encuestasScrollContainer}
      >
        <View style={styles.encuestasInnerContainer}>
          <Text style={styles.encuestasTitle}>Encuestas</Text>
          <View style={styles.surveyListTable}>
            {staticData.map((survey) => (
              <SurveyRow key={survey.id} value={survey} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  encuestasContainer: {
    flex: 1,
    padding: 20,
  },
  encuestasScrollContainer: {
    padding: 15,
  },
  encuestasInnerContainer: {
    marginTop: 8,
    paddingHorizontal: 10,
    backgroundColor: colors.white,
    borderColor: colors.white,
    borderWidth: 0.2,
    borderRadius: 4,
    alignItems: 'center',
  },
  encuestasTitle: {
    marginLeft: -185,
    marginTop: 13,
    letterSpacing: typography.letterSpacingMedium,
    lineHeight: typography.lineHeightXYZSmall,
    fontFamily: typography.nunitoSanzBold,
    fontSize: typography.fontSizeXYZSmall,
    color: colors.black,
  },
  surveyListTable: {
    marginTop: 20,
    width: '100%',
  },
  surveyListRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: colors.black,
    paddingVertical: 5,
  },
  surveyListCell: {
    padding: 5,
    flex: 1,
    alignItems: 'center',
  },
  surveyDescription: {
    color: colors.brand_brown,
    fontFamily: typography.nunitoSanzRegular,
    fontSize: typography.fontSizeSmall,
    lineHeight: typography.lineHeightSmall,
  },
  surveyChannel: {
    color: colors.black,
    fontFamily: typography.nunitoSanzRegular,
    fontSize: typography.fontSizeSmall,
    lineHeight: typography.lineHeightSmall,
  },
});
