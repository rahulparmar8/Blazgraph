import request from 'request';
import querystring from 'querystring';
import { toUnicode } from 'punycode';
import { Category_query, send_request, create_UUID, } from '../routes/category_fun.js'
import { validationResult } from "express-validator";

let resourcePrefix = 'http://local.demo.com/#/knowledge/'
let prefix = 'https://ontology.demo.com/2016/04/demo#';

export default class Category {

    //  GET Category    //
    getCategory = (req, res) => {
        try {
            return res.render("addCategory", {
                bodyData: req.body
            })

        } catch (error) {
            console.log(error);
        }
    }
    //  POST Add Category   //
    addCategory = (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render("category", {
                    alert: errors.array(),
                    bodyData: req.body,
                });
            }
            Category_query(req, function (err, response) {
                if (err) {
                    res.status(400).json({ message: "error", })
                }
                return res.redirect("/categorylist/1")
            })
        } catch (error) {
            console.log(error);
        }
    }


    //  Get All Category Data   //

    allCategoryList = (req, res) => {
        try {
            const perPage = 5;
            const page = req.params.page || 1;
            const startingIndex = perPage * (page - 1)
            const endingIndex = startingIndex + (perPage)
            let tableType = '<' + prefix + 'Category>';

            let query1 = querystring.stringify({
                'query': 'prefix dc: <http://purl.org/dc/elements/1.1/> ' +
                    'SELECT ?categoryId ?Name  ?Description ' +
                    'WHERE { ' +
                    '?categoryId a ' + tableType + ' .' +
                    '?categoryId dc:Name ?Name. ' +
                    '?categoryId dc:Description  ?Description. }'
            });
            // console.log('====', query1)
            // console.log(id);
            send_request(query1, "get", function (err, user) {
                // console.log("*************", user);
                if (err) {
                    res.status(400).json({ message: "error", })
                }
                let arr = []

                user = JSON.parse(user);
                if (user.results.bindings) {
                    let response = user.results.bindings;
                    // console.log(response);
                    for (let i = startingIndex; i < endingIndex; i++) {
                        if (i > response.length - 1) {
                            break;
                        }

                        arr.push({
                            'CategoryId': response[i]['categoryId']['value'],
                            'Name': response[i]['Name']['value'],
                            'Description': response[i]['Description']['value']
                        })
                    }
                    let totalPage = response.length / perPage
                    if (totalPage - parseInt(totalPage) != 0) {
                        totalPage = parseInt(totalPage) + 1
                    }

                    res.render("categoryList", {
                        data: arr,
                        current: page,
                        pages: totalPage
                    })
                }
                // res.status(200).json({ response: arr })
                // console.log(arr);
            });
        } catch (error) {
            console.log(error)
        }
    }

    //  Get Edit Category Data  //

    editCategory = (req, res) => {
        try {
            // console.log("body params", req.params)

            let id = '<' + resourcePrefix + 'Category/' + req.params.id + '>';
            let tableType = '<' + prefix + 'Category>';
            let getCategory_query = 'prefix dc: <http://purl.org/dc/elements/1.1/> ' +
                'SELECT  ?Name ?Description ' +
                'WHERE { ' +
                id + ' a ' + tableType + ' .' +
                id + ' dc:Name ?Name. ' +
                'OPTIONAL {' + id + ' dc:Description  ?Description. }}'
// console.log(getCategory_query);
            let final_update_query = querystring.stringify({
                'query': getCategory_query
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
                  
                    if (error) {
                        // cb(error, null, null)
                        return res.status(400).json({ message: error, })
                    }
                    // console.log("**************", response, "**************", body)
                    // res.status(200).json({ message:response})
                    if (body) {
                        let data = JSON.parse(body).results.bindings[0];
                        console.log('data----------', data)
                        return res.render("editCategory", {
                            bodyData: data
                        })
                    }
                });
        } catch (error) {
            console.log(error)
        }
    }

    //  POST Edit CategoryData  //

    editCategoryData = (req, res) => {
        try {
            let id = req.params.id
            let Name = req.body.Name
            let Description = req.body.Description
            let prefixId = "<http://local.demo.com/#/knowledge/Category/"
            //  console.log(id);
            //    console.log(Description);
            var data_field = {}
            data_field.Name = Name
            if (Description)
                data_field.Description = Description


            let edit_query = 'prefix dc: <http://purl.org/dc/elements/1.1/> ' +
                'DELETE { '
            edit_query += prefixId + id + '> dc:Name ?Name .'
            edit_query += prefixId + id + '> dc:Description ?Description .'

            edit_query += '} INSERT {'
            for (var key in data_field) {
                if (data_field.hasOwnProperty(key)) {
                    edit_query += prefixId + id + '> dc:' + key + '"' + data_field[key] + '". '
                }
            }
            edit_query += '}' + 'WHERE { '
            edit_query += prefixId + id + '> dc:Name ?Name .'
            edit_query += 'OPTIONAL {' + prefixId + id + '> dc:Description  ?Description. }}'

            let edit_data = querystring.stringify({
                'update': edit_query
            })
            console.log("query----------",edit_query)
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
                        res.status(400).json({ message: error, })
                    }
                    // console.log("**************", response, "**************", body)
                    return res.redirect("/categorylist/1")
                });
            // console.log('editData', editData)
        } catch (error) {
            console.log(error);
        }
    }

    // Delete Category Data API //

    deleteCategory = (req, res) => {
        try {
            const id = req.params.id
            let tmpRecordId = create_UUID();
            let tableType = '<' + prefix + 'Category>';
            let CategoryId = '<' + resourcePrefix + 'Category/' + tmpRecordId + '>';
            let prefixId = "<http://local.demo.com/#/knowledge/Category/"

            //  console.log("************", id);

            let deletCategory_query = 'prefix dc: <http://purl.org/dc/elements/1.1/> ' +
                'DELETE { ' +
                prefixId + id + '> ?a  ?b .' +
                '}' +
                'WHERE { ' +
                prefixId + id + '> ?a ?b .' +
                '}'

            let final_deletCategory_query = querystring.stringify({
                'update': deletCategory_query
            })

            request.post(
                {
                    headers: {
                        'Accept': 'application/sparql-results+json',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    url: 'http://localhost:9999/blazegraph/namespace/test/sparql',
                    body: final_deletCategory_query
                }, function (error, response, body) {
                    // console.log('body', body)
                    if (error) {
                        // cb(error, null, null)
                        res.status(400).json({ message: error, })
                    }
                    // console.log("**************", response, "**************", body)
                    // res.status(200).json({ message: "Delete data Successfully  ", })
                    return res.redirect("/categorylist/1")
                });
            // console.log('deletData', deletData)

        } catch (error) {
            console.log(error);
        }
    }

    // Get One Category Record API //

    oneRecordCategory = (req, res) => {
        try {
            const id = req.params.id
            let tmpRecordId = create_UUID();
            let tableType = '<' + prefix + 'Category>';
            let prefixId = "<http://local.demo.com/#/knowledge/Category/"
            // console.log(id);
            let getCategory_query = querystring.stringify({
                'query': 'prefix dc: <http://purl.org/dc/elements/1.1/> ' +
                    'SELECT ?Name ?Description ' +
                    'WHERE { ' +
                    prefixId + id + '> dc:Name ?Name. ' +
                    'OPTIONAL {' + prefixId + id + '> dc:Description  ?Description. }}'
            });

            let getData = request.post(
                {
                    headers: {
                        'Accept': 'application/sparql-results+json',
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    url: 'http://localhost:9999/blazegraph/namespace/test/sparql',
                    body: getCategory_query
                },
                function (error, response, body) {
                    let data = JSON.parse(body)['results']['bindings'][0]
                    // console.log("Data------", data);
                    if (error) {
                        return res.status(400).json({ message: "Error", })
                    }
                    // console.log(data);
                    return res.render("viewCategory", {
                        data: data
                    })
                });
        } catch (error) {
            console.log(error);
        }

    }
}





