import express from 'express'
import bodyParser from 'body-parser';
import web from './src/routes/web.js';


const app = express();
const port = 3005
app.use(express.json());

//  Routes    //
app.use('/', web);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));


app.listen(port, () => {
    console.log(`Server is runing... ${port}`);
})
