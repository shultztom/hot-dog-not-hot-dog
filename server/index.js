import {DeleteObjectCommand, S3Client} from '@aws-sdk/client-s3'
import express from 'express';
import cors from 'cors';
import multer from "multer";
import multerS3 from "multer-s3";
import {detectHotDog} from "./src/modules/rekogModule.js";

const app = express()
app.use(cors())

const s3 = new S3Client()

const whitelist = [
    'image/png',
    'image/jpg',
    'image/jpeg',
]

const upload = multer({
    fileFilter: (req, file, cb) => {
        if (!whitelist.includes(file.mimetype)) {
            return cb('file is not allowed', false)
        }

        cb(null, true)
    },
    storage: multerS3({
        s3: s3,
        bucket: process.env.BUCKET_NAME,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            cb(null, `${Date.now().toString()}-${file.originalname}`)
        }
    })
})

app.post('/upload', upload.single('photo'), async function(req, res, next) {
    // Get path from upload
    const path = req.file.key;

    // Check photo from s3
    const response = await detectHotDog(path);

    // delete file
    const input = { // DeleteObjectRequest
        Bucket: process.env.BUCKET_NAME, // required
        Key: path, // required
    };
    const command = new DeleteObjectCommand(input);
    await s3.send(command);

    // Send response to user
    return res.json({
        isHotDog: response
    })
})

app.listen(8080, '0.0.0.0', () => {
    console.log('Listening on port 8080')
});