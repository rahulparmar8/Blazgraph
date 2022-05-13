import request from 'request';
import querystring from 'querystring';
import { book_query, send_request, create_UUID, } from '../../request_function.js'

let resourcePrefix = 'http://local.demo.com/#/knowledge/'
let prefix = 'https://ontology.demo.com/2016/04/demo#';



export default class User {

    //  AddBook API //
    addBook = (req, res) => {
        try {
            book_query(req, function (err, response) {
                if (err) {
                    res.status(400).json({ message: "error", })
                }
                // console.log('response', response)
                res.status(200).json({ response: response, })
            })

        } catch (error) {
            console.log(error);
        }
    };

    // GET ALL BOOK DATA //   
    AllBookList = (req, res) => {
        try {
            let tableType = '<' + prefix + 'Book>';
            let query1 = querystring.stringify({
                'query': 'prefix dc: <http://purl.org/dc/elements/1.1/> ' +
                    'SELECT ?bookId ?BookTitle ?price ' +
                    'WHERE { ' +
                    '?bookId a ' + tableType + ' .' +
                    '?bookId dc:BookTitle ?BookTitle. ' +
                    '?bookId dc:price  ?price. }'
            });
            console.log('====', query1)

            send_request(query1, "get", function (err, user) {
                // console.log("*************",user);
                if (err) {
                    res.status(400).json({ message: "error", })
                }
                let arr = [];

                user = JSON.parse(user);
                if (user.results.bindings) {
                    let response = user.results.bindings;
                    for (let i = 0; i < response.length; i++) {

                        arr.push({
                            'BookId': response[i]['bookId']['value'],
                            'BookTitle': response[i]['BookTitle']['value'],
                            'BookPrice': response[i]['price']['value']
                        })
                    }
                }
                res.status(200).json({ response: arr })
            });
        } catch (error) {
            console.log(error);
        }
    }

    // Delete Data API //

    bookDataDelete = (req, res) => {
        try {
            const id = req.body.id
            let tmpRecordId = create_UUID();
            let tableType = '<' + prefix + 'Book>';
            let BookId = '<' + resourcePrefix + 'Book/' + tmpRecordId + '>';

            // let tableType = '<' + prefix + 'Book>';
            // let delet_query = querystring.stringify({
            //     'update': 
            let delet_query = 'prefix dc: <http://purl.org/dc/elements/1.1/> ' +
                'DELETE { ' +
                id + ' ?a ?b.' +
                '}' +
                'WHERE { ' +
                id + ' ?a ?b .' +
                '}'
            // });
            // console.log('query', delet_query)
            let final_delet_query = querystring.stringify({
                'update': delet_query
            })

            request.post(
                {
                    headers: {
                        'Accept': 'application/sparql-results+json',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    url: 'http://localhost:9999/blazegraph/namespace/test/sparql',
                    body: final_delet_query
                }, function (error, response, body) {
                    // console.log('body', body)
                    if (error) {
                        // cb(error, null, null)
                        res.status(400).json({ message: error, })
                    }
                    // console.log("**************", response, "**************", body)
                    res.status(200).json({ message: "Delete data Successfully  ", })
                });
            // console.log('deletData', deletData)

        } catch (error) {

        }
    }

    //  Update Data //
    editData = (req, res) => {
        try {
            const id = req.body.id
            let tmpRecordId = create_UUID();
            let tableType = '<' + prefix + 'Book>';
            let BookId = req.body.id
            let BookTitle = req.body.BookTitle
            let price = req.body.price

            console.log(BookTitle);
            console.log(price);
            let edit_query = 'prefix dc: <http://purl.org/dc/elements/1.1/> ' +
                'DELETE { '
            if ("BookTitle" in req.body) {
                edit_query += BookId + 'dc:BookTitle ?BookTitle .'
            }
            if ("price" in req.body) {
                edit_query += BookId + 'dc:price ?price .'
            }
            edit_query += '}' + 'WHERE { '
            if ("BookTitle" in req.body) {
                edit_query += BookId + 'dc:BookTitle ?BookTitle .'
            }
            if ("price" in req.body) {
                edit_query += BookId + 'dc:price ?price .'
            }
            edit_query += '}; INSERT {'
            if ("BookTitle" in req.body) {
                edit_query += BookId + 'dc:BookTitle "' + BookTitle + '" .'
            }
            if ("price" in req.body) {
                edit_query += BookId + 'dc:price "' + price + '" .'
            }
            edit_query += '} WHERE { BIND(NOW() as ?created) }'


            // console.log('query', edit_query)

            let edit_data = querystring.stringify({
                'update': edit_query
            })
            request.post(
                {
                    headers: {
                        'Accept': 'application/sparql-results+json',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    url: 'http://localhost:9999/blazegraph/namespace/test/sparql',
                    body: edit_data
                }, function (error, response, body) {
                    console.log('body', body)
                    if (error) {
                        // cb(error, null, null)
                        res.status(400).json({ message: error, })
                    }
                    // console.log("**************", response, "**************", body)
                    res.status(200).json({ message: "Update data Successfully  ", })
                });
            // console.log('editData', editData)
        } catch (error) {

        }
    }

    // Get One Record API //

    oneRecordGet = (req, res) => {
        try {
            const { id } = req.body
            let tmpRecordId = create_UUID();
            let tableType = '<' + prefix + 'Book>';
            //  BookId = '<' + resourcePrefix + 'Book/' + tmpRecordId + '>';
            // console.log();
            // let tableType = '<' + prefix + 'Book>';
            let get_query = querystring.stringify({
                'query': 'prefix dc: <http://purl.org/dc/elements/1.1/> ' +
                    'SELECT ?bookId ?BookTitle ?price ' +
                    'WHERE { ' +
                    id + ' dc:BookTitle ?BookTitle. ' +
                    id + ' dc:price  ?price. }'
            });

            let getData = request.post(
                {
                    headers: {
                        'Accept': 'application/sparql-results+json',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    url: 'http://localhost:9999/blazegraph/namespace/test/sparql',
                    body: get_query
                },
                function (error, response, body) {
                    let data = JSON.parse(body)['results']['bindings']
                    // let data = body
                    let arr = []
                    let bookTitle = data[0]['BookTitle']['value']
                    let bookPrice = data[0]['price']['value']

                    if (error) {
                        return res.status(400).json({ message: "Error", })
                    }
                    return res.status(200).json({ message: "oneRecord Successfully Get ", data: { 'Book Title': bookTitle, 'Book Price': bookPrice } })

                });
        } catch (error) {
        }
    }
}