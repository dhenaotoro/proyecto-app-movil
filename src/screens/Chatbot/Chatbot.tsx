import React, { ReactNode, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { InputText } from '../../components/FormFields/InputText';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { RadioButton } from 'react-native-paper';
import { registerPqr } from '../../services/Api';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/RootNavigator';

//, borderStyle: 'solid', borderWidth: 1, borderColor: 'blue'

type ChatbotRouteProp = RouteProp<RootStackParamList, 'Chatbot'>;

interface ChatbotRenderProps {
    children: ReactNode;
}

interface RadioButtonOptions {
    label: string;
    value: string;
}

function PrivacyOptions({ onSelect }: { onSelect: (value: string) => void }): React.JSX.Element {
    const [selectedValue, setSelectedValue] = useState<string>('');

    const handleSelect = (value: string) => {
        setSelectedValue(value);
        onSelect(value);
    };

    return (<View>
        <Text style={styles.chatbotCommonMessage}>Aceptas el consentimiento informado para uso de datos personales</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
            <RadioButton
                value='Si'
                status={selectedValue === 'Si' ? 'checked' : 'unchecked'}
                onPress={() => handleSelect('Si')}
            />
            <Text style={styles.optionText}>Sí</Text>
            <RadioButton
                value='No'
                status={selectedValue === 'No' ? 'checked' : 'unchecked'}
                onPress={() => handleSelect('No')}
            />
            <Text style={styles.optionText}>No</Text>
        </View>
    </View>);
}

function ChoosingDisclosureType({ onSelect }: { onSelect: (value: string) => void }): React.JSX.Element {
    const options: RadioButtonOptions[] = [
        { label: 'Compensación de dinero', value: 'Compensación de dinero' },
        { label: 'Cambio de producto', value: 'Cambio de producto' },
        { label: 'Aclaración del servicio', value: 'Aclaración del servicio' },
        { label: 'Modificación de una cita', value: 'Modificación de una cita' },
    ];
    const [selectedValue, setSelectedValue] = useState<string>('');

    const handleSelect = (value: string) => {
        setSelectedValue(value);
        onSelect(value);
    };

    return (<View>
        <Text style={styles.chatbotCommonMessage}>Elige el tipo de reclamo a informar.</Text>
        <View>
            {options?.map((option) => (
                <View key={option.value} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                    <RadioButton
                        value={option.value}
                        status={selectedValue === option.value ? 'checked' : 'unchecked'}
                        onPress={() => handleSelect(option.value)}
                    />
                    <Text style={styles.optionText}>{option.label}</Text>
                </View>
            ))}
        </View>
    </View>);
}

function ChoosingRequestType({ onSelect }: { onSelect: (value: string) => void }): React.JSX.Element {
    const options: RadioButtonOptions[] = [
        { label: 'Petición', value: 'Petición' },
        { label: 'Queja', value: 'Queja' },
        { label: 'Reclamo', value: 'Reclamo' },
    ];
    const [selectedValue, setSelectedValue] = useState<string>('');

    const handleSelect = (value: string) => {
        setSelectedValue(value);
        onSelect(value);
    };

    return (<View>
        <Text style={styles.chatbotTitle}>Agente ABCall</Text>
        <Text style={styles.chatbotCommonMessage}>Hola, bienvenido a nuestro servicio. ¿Qué tipo de ayuda necesitas?</Text>
        <View>
            {options?.map((option) => (
                <View key={option.value} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                    <RadioButton
                        testID={`Chatbot.Option.${option.value}`}
                        value={option.value}
                        status={selectedValue === option.value ? 'checked' : 'unchecked'}
                        onPress={() => handleSelect(option.value)}
                    />
                    <Text style={styles.optionText}>{option.label}</Text>
                </View>
            ))}
        </View>
    </View>);
}

function ChatbotRender({ children }: ChatbotRenderProps) {
    return (
        <View style={{ width: '67%', padding: 5 }}>
            {children}
        </View>
    );
}

export function Chatbot(): React.JSX.Element {
    const screen = 'Chatbot';
    const route = useRoute<ChatbotRouteProp>();
    const { userUuid } = route.params;
    const [step, setStep] = useState(0);
    const [input, setInput] = useState("");
    const [requestType, setRequestType] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [transaction, setTransaction] = useState<string>('1234567890');
    const [solveImpact, setSolveImpact] = useState<string>('');
    
    const handlePrivacySelect = (value: string) => {
        if (value === 'No') {
            setMessages([...messages, <Text style={styles.chatbotCommonMessage}>No estas de acuerdo con el tratamiento de información por esta razón no se podrá realizar la solicitud como se espera, cualquier duda sobre el tratamiento de datos por favor consultar el siguiente enlace.</Text>]);
        } else {
            createPQR().then((pqr) => {
                if(![200, 201].includes(pqr?.code || 0)) {
                    setMessages([...messages, <Text style={styles.chatbotCommonMessage}>Hubo una dificultad al momento de crear la solicitud. Por favor intenta en 5 minutos.</Text>]);
                } else {
                    setMessages((messages) => [...messages, <Text style={styles.chatbotCommonMessage}>Gracias por preferir nuestro canal de chat, vuelve pronto.</Text>]);
                }
            });
        }
        setStep(4);  // Avanzar al siguiente paso
    }

    const handleDisclosureTypeSelect = (value: string) => {
        setSolveImpact(value);
        if (value === 'Compensación de dinero') {
            setMessages((messages) => {
                return [...messages, <Text style={styles.chatbotCommonMessage}>Por favor describe la razón de la compensación que requieres comunicarme.</Text>]
            });
            setStep(2); // Avanzar al siguiente paso
        } else if (value === 'Cambio de producto') {
            setMessages((messages) => {
                return [...messages, <Text style={styles.chatbotCommonMessage}>Por favor indica textualmente que producto deseas tener.</Text>];
            }); 
            setStep(2); // Avanzar al siguiente paso
        } else if (value === 'Aclaración del servicio') {
            setMessages((messages) => {
                return [...messages, <Text style={styles.chatbotCommonMessage}>Por favor describe el servicio, producto o transacción que requieres aclarar.</Text>]
            });
            setStep(2); // Avanzar al siguiente paso
        } else if (value === 'Modificación de una cita') {
            setMessages((messages) => {
                return [...messages, <Text style={styles.chatbotCommonMessage}>Por favor define una fecha requerida de la cita en formato YYYY-MM-DD HH:MM:SS</Text>]
            });
            setStep(3); // Avanzar al siguiente paso
        }
    };

    const handleRequestTypeSelect = (value: string) => {
        setRequestType(value);
        if(value === 'Petición' || value === 'Queja') {
            setMessages([...messages, <Text style={{...styles.chatbotCommonMessage}}>Por favor describe la {value.toLocaleLowerCase()} que quieres comunicarme.</Text>]);
        } else if (value === 'Reclamo') {
            setMessages([...messages, <ChoosingDisclosureType onSelect={handleDisclosureTypeSelect}/>]);
        }
        setStep(1); // Avanzar al siguiente paso
    };

    const [messages, setMessages] = useState<ReactNode[]>([<ChoosingRequestType onSelect={handleRequestTypeSelect}/>]);

    const sendMessage = async () => {
        // Agregar mensaje del usuario a la lista de mensajes
        setMessages([...messages, <Text style={styles.userCommonMessage}>{input}</Text>])
        
        // Limpiar el campo de entrada y avanzar al siguiente paso
        setInput('');
        setStep((prevStep) => prevStep + 1);

        // Determinar el próximo mensaje del chatbot en función del paso actual y el tipo de solicitud
        const nextComponent = getNextComponent(step);
        setMessages((prevMessages) => [...prevMessages, nextComponent]);
    };

    // Función que devuelve el próximo componente según el paso y tipo de solicitud
    const getNextComponent = (currentStep: number): ReactNode => {
        console.log('currentStep', currentStep)
        if(["Petición", "Queja"].includes(requestType)) {
            switch (currentStep) {
                case 1:
                    setDescription(input);
                    setSolveImpact('Compensación de dinero');
                    return <Text style={styles.chatbotCommonMessage}>Por favor define una fecha de adquisición en formato YYYY-MM-DD.</Text>;
                case 2:
                    return <Text style={styles.chatbotCommonMessage}>Si lo recuerdas, digita el número de orden de la transacción.</Text>;
                case 3:
                    return <PrivacyOptions onSelect={handlePrivacySelect}/>;
                default:
                    return <></>;
            }
        } else if (requestType === "Reclamo") {
            switch (currentStep) {
                case 2:
                    setDescription(input);
                    return <Text style={styles.chatbotCommonMessage}>Por favor define una fecha de adquisición en formato YYYY-MM-DD.</Text>;
                case 3:
                    return <Text style={styles.chatbotCommonMessage}>Si lo recuerdas, digita el número de orden de la transacción.</Text>;
                case 4:
                    setTransaction(input);
                    return <PrivacyOptions onSelect={handlePrivacySelect}/>;
                default:
                    return <></>;
            }
        } else {
            return <></>;
        }
    };

    const createPQR = async () => {
        const pqrData = {
            uuidUsuario: userUuid,
            tipoSolicitud: requestType,
            descripcion: description,
            numeroTransaccion: transaction,
            impactoProblema: 'Alto',
            impactoSolucion: solveImpact,
            canal: 'Chatbot',
        };

        try {
            const response = await registerPqr(pqrData);
            return response;
        } catch (error) {
            console.debug('error', error);
        }
    }

    return (
        <View style={styles.chatbotContainer} testID={screen}>
            <View style={styles.chatbotContent}>
                <FlatList
                    testID={`${screen}.Content`}
                    style={{width: 490}}
                    data={messages}
                    renderItem={({ item }) => (<ChatbotRender>{item}</ChatbotRender>)}
                    keyExtractor={(_, index) => index.toString()}
                />
            </View>
            <View style={styles.chatbotInputContainer}>
                <InputText label='Mensaje a enviar' required maxLength={1000} value={input} onInputChange={setInput} showIcon iconToShow='send' onIconClick={sendMessage} testID={`${screen}.EnviarMensaje`}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    chatbotContainer: {
        flex: 1,
        backgroundColor: colors.white,
        alignItems: 'center',
    },
    chatbotContent: {
        width: '90%',
        height: '80%',
        top: 11,
        paddingVertical: 16,
        paddingHorizontal: 12,
        borderColor: colors.brand_violet,
        borderWidth: 1,
        borderRadius: 5,
        borderStyle: 'solid',
    },
    chatbotInputContainer: {
        //borderStyle: 'solid', borderWidth: 1, borderColor: 'blue',
        width: '90%',
        top: 0
    },
    chatbotTitle: { 
        fontFamily: typography.nunitoSanzBold,
        fontSize: typography.fontSizeSmall,
        letterSpacing: typography.letterSpacingMedium,
        lineHeight: typography.lineHeightSmall,
        color: colors.black,
    },
    chatbotCommonMessage: {
        width: '90%',
        textAlign: "left",
        fontFamily: typography.nunitoSanzRegular,
        fontSize: typography.fontSizeSmall,
        letterSpacing: typography.letterSpacingMedium,
        lineHeight: typography.lineHeightSmall,
        color: colors.black,
    },
    userCommonMessage: {
        width: '85%',
        marginLeft: 35,
        textAlign: "right",
        fontFamily: typography.nunitoSanzRegular,
        fontSize: typography.fontSizeSmall,
        letterSpacing: typography.letterSpacingMedium,
        lineHeight: typography.lineHeightSmall,
        color: colors.black,
    },
    optionText: {
        fontFamily: typography.nunitoSanzRegular,
        fontSize: typography.fontSizeSmall,
        letterSpacing: typography.letterSpacingMedium,
        lineHeight: typography.lineHeightSmall,
        color: colors.black,
    }
});