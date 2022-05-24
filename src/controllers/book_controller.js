import request from 'request';
import querystring from 'querystring';
import { book_query, send_request, create_UUID, } from '../routes/request_function.js'
import { validationResult } from "express-validator";

let resourcePrefix = 'http://local.demo.com/#/knowledge/'
let prefix = 'https://ontology.demo.com/2016/04/demo#';


let catListData;

export default class User {

    //  AddBook page //
    addBookpage = (req, res) => {
        try {
            let tableType = "<" + prefix + "Category>";


            let query1 = querystring.stringify({
                'query': 'prefix dc: <http://purl.org/dc/elements/1.1/> ' +
                    'SELECT ?categoryId ?Name ?Description ' +
                    'WHERE { ' +
                    '?categoryId a ' + tableType + ' .' +
                    '?categoryId dc:Name ?Name. ' +
                    // '?categoryId dc:Description  ?Description. }'
                    'OPTIONAL { ?categoryId dc:Description  ?Description .}}'
            });
            // console.log(query1);
            send_request(query1, "get", function (err, user) {

                if (err) {
                    res.status(400).json({ message: "error" });
                }
                let arr = [];
                // console.log(user);
                user = JSON.parse(user);

                if (user.results.bindings) {
                    let response = user.results.bindings;
                    // console.log(response);


                    const data = response.map(res => {
                        return {
                            Name: res.Name.value,
                            Description: res.Description?.value,
                            CategoryId: res.categoryId?.value
                        }
                    })
                    // console.log(data)
                    catListData = data;

                    return res.render("addBook", {
                        bodyData: req.body,
                        catList: data,
                    })

                }
            });

        } catch (error) {
            console.log(error);
        }
    };



    //  AddBook API //
    addBook = (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render("addBook", {
                    alert: errors.array(),
                    bodyData: req.body,
                    catList: catListData

                });
            }

            book_query(req, function (err, response) {
                if (err) {
                    res.status(400).json({ message: "error", })
                }
                // console.log('response', response)
                // res.status(200).json({ response: response, })
                return res.redirect("/newlist/1")
            })
        } catch (error) {
            console.log(error);
        }
    };

    //  GET USE  CONSTRUCT All BookList Data    //

    newAllBookList = (req, res) => {
        try {
            const perPage = 5;
            const page = req.params.page || 1;
            const startingIndex = perPage * (page - 1) * 3
            const endingIndex = ((page * perPage) * 3) - 1
            let tableType = '<' + prefix + 'Book>';


            let query1 = querystring.stringify({
                'query': 'prefix dc: <http://purl.org/dc/elements/1.1/> ' +
                    'CONSTRUCT {' +
                    '?BookId  dc:BookTitle ?BookTitle .' +
                    '?BookId  dc:price ?price .' +
                    '?BookId  dc:AuthorName ?AuthorName ;}' +
                    'WHERE { ' +
                    '?BookId a ' + tableType + ' .' +
                    '?BookId  dc:BookTitle ?BookTitle. ' +
                    '?BookId  dc:price  ?price.' +
                    'OPTIONAL { ?BookId dc:AuthorName  ?AuthorName .}}'
            });
            // console.log('query====', query1)
            send_request(query1, "get", function (err, user) {
                // console.log("*************",user);
                if (err) {
                    res.status(400).json({ message: "error", })
                }


                let arr = []
                // console.log('user====',user)
                user = JSON.parse(user);
                var tempArray = []
                // console.log(user);
                if (user.results.bindings) {
                    let response = user.results.bindings;
                    // console.log(response);
                    response.map((res) => {
                        var BookTitle1 = res['predicate']['value']
                        let tempBook, tempPrice, tempAuth = '';

                        if (BookTitle1.includes('BookTitle')) {
                            tempBook = res['object']['value']
                            // console.log(tempBook);
                            tempArray['Id'] = res['subject']['value']
                            tempArray['BookId'] = res.predicate.value
                            tempArray['BookTitle'] = tempBook
                        }
                        if (BookTitle1.includes('price')) {
                            tempPrice = res['object']['value']
                            tempArray['BookPrice'] = tempPrice

                            arr.push(tempArray)
                            // console.log("IN PRICE: ", tempArray);
                            tempArray = []

                        }
                        if (BookTitle1.includes('AuthorName')) {
                            tempAuth = res['object']['value']
                            arr[arr.length - 1]['AuthorName'] = tempAuth
                            // console.log("IN AUTHOR: ", tempArray);
                        }
                    })
                    let totalPage = (response.length / 3) / perPage
                    if (totalPage - parseInt(totalPage) != 0) {
                        totalPage = parseInt(totalPage) + 1
                    }
                    res.render("bookList", {
                        data: arr,
                        current: page,
                        pages: totalPage
                    })
                }
            });
        } catch (error) {
            console.log(error);
        }
    }


    // GET ALL BOOK DATA //   
    AllBookList = (req, res) => {
        try {
            const perPage = 5;
            const page = req.params.page || 1;
            const startingIndex = perPage * (page - 1)
            const endingIndex = startingIndex + (perPage)
            let tableType = '<' + prefix + 'Book>';

            let query1 = querystring.stringify({
                'query': 'prefix dc: <http://purl.org/dc/elements/1.1/> ' +
                    'SELECT ?bookId ?BookTitle ?price ?AuthorName ' +
                    'WHERE { ' +
                    '?bookId a ' + tableType + ' .' +
                    '?bookId dc:BookTitle ?BookTitle. ' +
                    '?bookId dc:price  ?price.' +
                    '?bookId dc:AuthorName  ?AuthorName. }'
            });
            // console.log('====', query1)
            // console.log(id);
            send_request(query1, "get", function (err, user) {
                // console.log("*************",user);
                if (err) {
                    res.status(400).json({ message: "error", })
                }
                let arr = []

                user = JSON.parse(user);
                if (user.results.bindings) {
                    let response = user.results.bindings;

                    for (let i = startingIndex; i < endingIndex; i++) {
                        if (i > response.length - 1) {
                            break;
                        }

                        arr.push({
                            'BookId': response[i]['bookId']['value'],
                            'BookTitle': response[i]['BookTitle']['value'],
                            'BookPrice': response[i]['price']['value'],
                            'AuthorName': response[i]['AuthorName']['value']
                        })
                    }
                    let totalPage = response.length / perPage
                    if (totalPage - parseInt(totalPage) != 0) {
                        totalPage = parseInt(totalPage) + 1
                    }
                    // console.log(totalPage);

                    res.render("bookList", {
                        data: arr,
                        current: page,
                        pages: totalPage
                    })
                }
                // res.status(200).json({ response: arr })
                // console.log(arr);
            });
        } catch (error) {
            console.log('====', error)
        }

    }

    // Delete Data API //

    bookDataDelete = (req, res) => {
        try {
            const id = req.params.id
            let tmpRecordId = create_UUID();
            let tableType = '<' + prefix + 'Book>';
            let BookId = '<' + resourcePrefix + 'Book/' + tmpRecordId + '>';
            let prefixId = "<http://local.demo.com/#/knowledge/Book/"

            //  console.log("************", id);

            let delet_query = 'prefix dc: <http://purl.org/dc/elements/1.1/> ' +
                'DELETE { ' +
                prefixId + id + '> ?a  ?b .' +
                '}' +
                'WHERE { ' +
                prefixId + id + '> ?a ?b .' +
                '}'

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
                    // res.status(200).json({ message: "Delete data Successfully  ", })
                    return res.redirect("/newlist/1")
                });
            // console.log('deletData', deletData)

        } catch (error) {

        }
    }

    //  Update Data GET //
    editData = (req, res) => {
        try {
            // console.log("body params",req.params)

            let id = '<' + resourcePrefix + 'Book/' + req.params.id + '>';
            let tableType = '<' + prefix + 'Book>';
            let get_query = 'prefix dc: <http://purl.org/dc/elements/1.1/> ' +
                'SELECT  ?BookTitle ?price ?catId ?AuthorName ' +
                'WHERE { ' +
                id + ' a ' + tableType + ' .' +
                id + ' dc:BookTitle ?BookTitle. ' +
                id + ' dc:price  ?price. ' +
                id + ' dc:catId  ?catId. ' +
                id + ' dc:AuthorName  ?AuthorName. }'

            let final_update_query = querystring.stringify({
                'query': get_query
            })

            request.post(
                {
                    headers: {
                        'Accept': 'application/sparql-results+json',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    url: 'http://localhost:9999/blazegraph/namespace/test/sparql',
                    body: final_update_query
                }, function (error, response, body) {
                    // console.log('body========', get_query)
                    if (error) {
                        // cb(error, null, null)
                        return res.status(400).json({ message: error, })
                    }
                    // console.log("**************", response, "**************", body)
                    // res.status(200).json({ message:response})
                    // return res.redirect("edit")
                    let bodydata = JSON.parse(body).results.bindings[0];

                    let tableType = "<" + prefix + "Category>";

                    let query1 = querystring.stringify({
                        'query': 'prefix dc: <http://purl.org/dc/elements/1.1/> ' +
                            'SELECT ?categoryId ?Name ?Description ' +
                            'WHERE { ' +
                            '?categoryId a ' + tableType + ' .' +
                            '?categoryId dc:Name ?Name. ' +
                            // '?categoryId dc:Description  ?Description. }'
                            'OPTIONAL { ?categoryId dc:Description  ?Description .}}'
                    });
                    // console.log(query1);
                    send_request(query1, "get", function (err, user) {

                        if (err) {
                            res.status(400).json({ message: "error" });
                        }
                        let arr = [];
                        // console.log(user);
                        user = JSON.parse(user);
                        // let selectedCat = []

                        if (user.results.bindings) {
                            let response = user.results.bindings;
                            // console.log(response);

                            const data = response.map(res => {

                                return {
                                    Name: res.Name.value,
                                    Description: res.Description?.value,
                                    CategoryId: res.categoryId?.value
                                }
                            })

                            // console.log('data', bodydata)
                            // console.log('lisrt', data)


                            res.render("edit", {
                                data: bodydata,
                                catList: data,
                                // selectedCat: selectedCat[0]
                            })
                        }
                    });

                    // if (body) {
                    //     let data = JSON.parse(body).results.bindings[0];
                    //     console.log('data', data)
                    //     return res.render("edit", {
                    //         data: data
                    //     })
                    // }
                });
            // console.log('editData', editData)
        } catch (error) {
            console.log(error)
        }
    }

    //  Edit BookData POST  //

    editBookData = (req, res) => {
        try {
            let id = req.params.id
            let BookTitle = req.body.BookTitle
            let price = req.body.price
            let AuthorName = req.body.AuthorName
            let prefixId = "<http://local.demo.com/#/knowledge/Book/"
            //  console.log(id);

            var data_field = {}
            data_field.BookTitle = BookTitle
            data_field.price = price
            if (AuthorName)
                data_field.AuthorName = AuthorName

            // console.log(BookTitle);
            let edit_query = 'prefix dc: <http://purl.org/dc/elements/1.1/> ' +
                'DELETE { '
            edit_query += prefixId + id + '> dc:BookTitle ?BookTitle .'
            edit_query += prefixId + id + '> dc:price ?price .'
            edit_query += prefixId + id + '> dc:AuthorName ?AuthorName .'

            edit_query += '} INSERT {'
            for (var key in data_field) {
                if (data_field.hasOwnProperty(key)) {
                    edit_query += prefixId + id + '> dc:' + key + '"' + data_field[key] + '". '
                }
            }
            edit_query += '}' + 'WHERE { '
            edit_query += prefixId + id + '> dc:BookTitle ?BookTitle .'
            edit_query += prefixId + id + '> dc:price ?price .'
            edit_query += 'OPTIONAL {' + prefixId + id + '> dc:AuthorName  ?AuthorName. }}'
            // edit_query += prefixId + id + '> dc:AuthorName ?AuthorName .}'

            // edit_query += prefixId + id + '> dc:BookTitle "' + BookTitle + '" .'
            // edit_query += prefixId + id + '> dc:price "' + price + '" .'
            // 'OPTIONAL {' + edit_query + prefixId + id + '> dc:AuthorName  ?AuthorName. }}'
            // edit_query += prefixId + id + '> dc:AuthorName "' + AuthorName + '

            // console.log("\n", edit_query, "\n");
            let edit_data = querystring.stringify({
                'update': edit_query
            })
            // console.log("query----------",edit_query)
            request.post(
                {
                    headers: {
                        'Accept': 'application/sparql-results+json',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    url: 'http://localhost:9999/blazegraph/namespace/test/sparql',
                    body: edit_data
                }, function (error, response, body) {
                    // console.log('body', body)
                    if (error) {
                        // cb(error, null, null)
                        res.status(400).json({ message: error, })
                    }
                    // console.log("**************", response, "**************", body)
                    // res.status(200).json({ message: "Update data Successfully" })
                    return res.redirect("/newlist/1")
                });
            // console.log('editData', editData)
        } catch (error) {
            console.log(error);
        }
    }

    // Get One Record API //

    oneRecordGet = (req, res) => {
        try {
            const id = req.params.id
            let tmpRecordId = create_UUID();
            let tableType = '<' + prefix + 'Book>';
            let prefixId = "<http://local.demo.com/#/knowledge/Book/"

            let get_query = querystring.stringify({
                'query': 'prefix dc: <http://purl.org/dc/elements/1.1/> ' +
                    'SELECT ?BookTitle ?price ?AuthorName ' +
                    'WHERE { ' +
                    prefixId + id + '> dc:BookTitle ?BookTitle. ' +
                    prefixId + id + '> dc:price  ?price. ' +
                    'OPTIONAL {' + prefixId + id + '> dc:AuthorName  ?AuthorName. }}'
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
                    let data = JSON.parse(body)['results']['bindings'][0]

                    if (error) {
                        return res.status(400).json({ message: "Error", })
                    }
                    // return res.status(200).json({ message: "oneRecord Successfully Get ", data: { 'Book Title': bookTitle, 'Book Price': bookPrice } })
                    // console.log(data);
                    return res.render('view', {
                        data: data
                    })
                });
        } catch (error) {
            console.log(error);
        }
    }
}