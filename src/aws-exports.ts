import { ResourcesConfig } from "aws-amplify";

const awsconfig : ResourcesConfig = { 
    Auth: {
        Cognito: {
            userPoolClientId: '',
            userPoolId: '',
            loginWith: {
                email: true
            }
        }
    }
};

export default awsconfig;