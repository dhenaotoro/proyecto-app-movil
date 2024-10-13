import { ResourcesConfig } from "aws-amplify";

const awsconfig : ResourcesConfig = { 
    Auth: {
        Cognito: {
            userPoolClientId: "22o1kuvojsmonp8f45icq953uf",
            userPoolId: "us-east-1_pK9k1hZDm"
        }
    }
};

export default awsconfig;