import request from 'request';
import querystring from 'querystring';
import { gen_query, send_request, create_UUID } from '../../request_function.js'

var resourcePrefix = 'http://local.demo.com/#/knowledge/'
var prefix = 'https://ontology.demo.com/2016/04/demo#';


export default class User {

    // Book API //
    Book = (req, res) => {
        try {
            // console.log(req.body);
            const { BookTitle, price } = req.body
            var tmpRecordId = create_UUID();
            var tableType = '<' + prefix + 'Book>';
            var BookId = '<' + resourcePrefix + 'Book/' + tmpRecordId + '>';

            var data_field = {
                'BookTitle': BookTitle,
                'price': price,
            }

            var query = gen_query(data_field, BookId, tableType, "post")
            var bookdata = send_request(query, "post")

            res.status(200).json({ message: "Data Saved", id: BookId })
        } catch (error) {
            console.log(error);
        }
    };

    // GET BOOK ALL DATA //   
    AllBookList = (req, res) => {
        try {
            var query1 = querystring.stringify({
                'query': 'prefix dc: <http://purl.org/dc/elements/1.1/> ' +
                    'SELECT ?BookTitle ?price ' +
                    'WHERE { <http://local.demo.com/#/knowledge/Book/1652274636965> dc:BookTitle ?BookTitle; dc:price  ?price; }'
            });

            var getdata = request.get(
                {
                    headers: {
                        'Accept': 'application/sparql-results+json',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    url: 'http://localhost:9999/blazegraph/namespace/test/sparql',
                    body: query1
                }, function (error, response, body) {
                    console.log(body);
                });
            res.status(200).json({ message: "Data Saved", })
        } catch (error) {
            console.log(error);
        }
    }

    // Car API POST //   
    Car = (req, res) => {
        try {
            const { CarName, price } = req.body
            var tmpRecordId = create_UUID();
            var tableType = '<' + prefix + 'Car>';
            var CarId = '<' + resourcePrefix + 'Car/' + tmpRecordId + '>';

            var Car_Data = {
                'CarName': CarName,
                'price': price
            }

            var query = gen_query(Car_Data, CarId, tableType, "post")
            var cardata = send_request(query, "post")

            res.status(200).json({ message: "Data Saved", id: CarId })
        } catch (error) {
            console.log(error);
        }
    }

}