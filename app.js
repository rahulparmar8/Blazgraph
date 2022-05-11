import express from 'express'
import request from 'request';
import querystring from 'querystring';
import bodyParser from 'body-parser';
import web from './src/routes/web.js';


// var resourcePrefix = 'http://local.demo.com/#/knowledge/'
// var prefix = 'https://ontology.demo.com/2016/04/demo#';

const app = express();
const port = 3005
app.use(express.json());
//  Routes    //
app.use('/', web);

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

// function save_DATA(insert_fields, id, tableType) {

//     var q1 = 'prefix dc: <http://purl.org/dc/elements/1.1/>' +
//         ' INSERT  { ' +
//         id + ' a ' + tableType + '. '

//     for (var key in insert_fields) {
//         q1 = q1 + id + ' dc:' + key + '"' + insert_fields[key] + '". '
//     }

//     q1 = q1 + '} WHERE { BIND(NOW() as ?created )}';
//     var query = querystring.stringify({ 'update': q1 });

//     request.post(
//         {
//             headers: {
//                 'Accept': 'application/sparql-results+json',
//                 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
//             },
//             url: 'http://localhost:9999/blazegraph/namespace/test/sparql',
//             body: query
//         }, function (error, response, body) {
//             //  console.log(body);
//         });
// }

// //  Unique ID Function  //
// function create_UUID() {
//     var dt = new Date().getTime();
//     return dt;
// }



// app.get('/booklist', (req, res) => {
    // res.send("hello")
//     var query1 = querystring.stringify({
//         'query': 'prefix dc: <http://purl.org/dc/elements/1.1/> ' +
//             'SELECT ?BookTitle ?price ' +
//             'WHERE { <http://local.demo.com/#/knowledge/Book/1652258385336> dc:BookTitle ?BookTitle; dc:price  ?price; }'
//     });

//     var getdata = request.get(
//         {
//             headers: {
//                 'Accept': 'application/sparql-results+json',
//                 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
//             },
//             url: 'http://localhost:9999/blazegraph/namespace/test/sparql',
//             body: query1
//         }, function (error, response, body) {
//             // console.log('error:',error);
//             //  console.log(response);
//             console.log(body);
//         });
//     // console.log(getdata);
// })


// Book API //
// app.post('/book', (req, res) => {
//     try {
//         console.log(req.body);
//         const { BookTitle, price } = req.body
//         var tmpRecordId = create_UUID();
//         var tableType = '<' + prefix + 'Book>';
//         var BookId = '<' + resourcePrefix + 'Book/' + tmpRecordId + '>';

//         var data_field = {
//             'BookTitle': BookTitle,
//             'price': price,
//         }

//         var save_data = save_DATA(data_field, BookId, tableType)

//         res.status(200).json({ message: "Data Saved", id: BookId })
//     } catch (error) {
//         console.log(error);
//     }
// });

// Car API //   
// app.post('/car', (req, res) => {
//     try {
//         const { CarName, price } = req.body
//         var tmpRecordId = create_UUID();
//         var tableType = '<' + prefix + 'Car>';
//         var CarId = '<' + resourcePrefix + 'Car/' + tmpRecordId + '>';

//         var Car_Data = {
//             'CarName': CarName,
//             'price': price
//         }
//         var save_data = save_DATA(Car_Data, CarId, tableType);
//         res.status(200).json({ message: "Data Saved", id: CarId })
//     } catch (error) {
//         console.log(error);
//     }
// })



app.listen(port, () => {
    console.log(`Server is runing... ${port}`);
})

