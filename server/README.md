# server for hot-dog-not-hot-dog

Flow:
1. User to uploads photo to API
2. Photo is uploaded to s3
3. Path is passed to rekognition, determines if hot dog or not
4. Image is then deleted from s3
5. User is informed of decision

## Running locally
1. Sign into AWS CLI
2. Ensure your account has access to s3 and rekognition
3. `npm i`
4. `npm run start:dev`