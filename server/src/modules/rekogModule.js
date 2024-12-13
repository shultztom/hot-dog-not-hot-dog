// Import required AWS SDK clients and commands for Node.js
import { DetectLabelsCommand } from  "@aws-sdk/client-rekognition";
import  { RekognitionClient } from "@aws-sdk/client-rekognition";

// Set the AWS Region.
const REGION = process.env.AWS_REGION; //e.g. "us-east-1"
const BUCKET = process.env.BUCKET_NAME

// Create SNS service object.
const rekogClient = new RekognitionClient({
    region: REGION
});

const detectHotDog = async (photoName) => {
    // Set params
    const params = {
        Image: {
            S3Object: {
                Bucket: BUCKET,
                Name: photoName
            },
        },
    }

    try {
        const response = await rekogClient.send(new DetectLabelsCommand(params));
        let isHotDog = false;
        response.Labels.forEach(label =>{
            const {Confidence, Name} = label;
            if(Confidence > 95 && Name.toLowerCase() === 'hot dog'){
                isHotDog = true;
            }
        })
        return isHotDog;
    } catch (err) {
        console.log("Error; Unable to determine if Hot Dog", err);
        return false;
    }
};

export { detectHotDog };