
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv/config');

//Init App
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));


/*---------------------*/
//MongoDB config
//MongoDB-URI
const mongoURI = process.env.mongoURI;

const connection = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true, 
    useUnifiedTopology: true 
});

connection.once('open', () => {

    //Initialising stream
    gfs = Grid(connection.db, mongoose.mongo);

    gfs.collection('uploads');
})
/*--------------------- */

//Create Storage engine
const storage = new GridFsStorage({
    url: mongoURI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
                const fileInfo = {
                    filename: `${Date.now()}-${file.originalname}`,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            }
        });
    }
});

//Setting up middleware
var upload = multer({
    storage: storage
});

//POST Route to upload image
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ file: req.file });
});

/*-----------------------*/
//All Image files GET request route

app.get('/', (req, res) => {


    gfs.files.find().toArray((error, files) => {

        //Check if files exist
        if (!files || files.length === 0) {
            res.json({
                message: "No files exist"
            });
        }
        else {
            res.send({
                files: files
            });
        }
    })
})

/*---------------------*/
/*---------------------*/

//Single image Readstream route

app.get('/files/:filename', (req, res) => {

    gfs.files.findOne({ filename: req.params.filename }, (err, file) => {

        // Check if files exist
        if (!file || file.length === 0) {
            return res.status(404).json({
                err: 'No files exist'
            });
        }

        // Check if image extension is valid
        if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {

            //Creating Readstream
            const readstream = gfs.createReadStream(file.filename);
            readstream.pipe(res);
        }
        else {
            res.status(404).json({
                err: 'Not an Image'
            });
        }

    });
});

/*----------------------*/
/*----------------------*/



//Setting up Port
const port = process.env.PORT || 4040;

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});