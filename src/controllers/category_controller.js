import request from "request";
import querystring from "querystring";

import {
    Category_query,
    send_request,
    create_UUID,
} from "../routes/category_fun.js";
import { validationResult } from "express-validator";

let resourcePrefix = "http://local.demo.com/#/knowledge/";
let prefix = "https://ontology.demo.com/2016/04/demo#";

export default class Category {

    //  GET Category    //

    getCategory = (req, res) => {
        try {
            return res.render("addCategory", {
                bodyData: req.body,
            });
        } catch (error) {
            console.log(error);
        }
    };

    //  POST Add Category   //

    addCategory = (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.render("addCategory", {
                    alert: errors.array(),
                    bodyData: req.body,
                });
            }
            Category_query(req, function (err, response) {
                if (err) {
                    res.status(400).json({ message: "error" });
                }
                return res.redirect("/categorylist/1");
            });
        } catch (error) {
            console.log(error);
        }
    };

    //  GET USE  CONSTRUCT  All Category Data   //

    // newAllCategoryList = (req, res) => {
    //     try {

    //         const perPage = 5;
    //         const page = req.params.page || 1;
    //         const startingIndex = perPage * (page - 1) * 3
    //         const endingIndex = ((page * perPage) * 3) - 1
    //         let tableType = '<' + prefix + 'Category>';


    //         let query1 = querystring.stringify({
    //             'query': 'prefix dc: <http://purl.org/dc/elements/1.1/> ' +
    //                 'CONSTRUCT {' +
    //                 '?CategoryId  dc:Name ?Name .' +
    //                 '?CategoryId  dc:Description ?Description ;}' +
    //                 'WHERE { ' +
    //                 '?CategoryId a ' + tableType + ' .' +
    //                 '?CategoryId  dc:Name ?Name. ' +
    //                 'OPTIONAL { ?CategoryId dc:Description  ?Description .}}'
    //         });
    //         console.log('query====', query1)
    //         send_request(query1, "get", function (err, user) {
    //             // console.log("*************",user);
    //             if (err) {
    //                 res.status(400).json({ message: "error", })
    //             }

    //             let arr = []
    //             // console.log('user====',user)
    //             user = JSON.parse(user);
    //             var tempArray = []
    //             console.log(user);
    //             if (user.results.bindings) {
    //                 let response = user.results.bindings;
    //                 // console.log(response);
    //                 response.map((res) => {
    //                     var Name1 = res['predicate']['value']
    //                     let tempName, tempDes = '';

    //                     if (Name1.includes('Name')) {
    //                         tempName = res['object']['value']
    //                         // console.log(tempName);
    //                         tempArray['Id'] = res['subject']['value']
    //                         tempArray['NameId'] = res.predicate.value
    //                         tempArray['Name'] = tempName
    //                     }
    //                     if (Name1.includes('Description')) {
    //                         tempDes = res['object']['value']
    //                         arr[arr.length - 1]['Description'] = tempDes
    //                         // console.log("IN Description: ", tempArray);
    //                     }
    //                 })
    //                 let totalPage = (response.length / 3) / perPage
    //                 if (totalPage - parseInt(totalPage) != 0) {
    //                     totalPage = parseInt(totalPage) + 1
    //                 }
    //                 res.render("categoryList", {
    //                     data: arr,
    //                     current: page,
    //                     pages: totalPage
    //                 })
    //             }
    //         });
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }


    //  Get All Category Data   //

    allCategoryList = (req, res) => {
        try {
            const perPage = 5;
            const page = req.params.page || 1;
            const startingIndex = perPage * (page - 1);
            const endingIndex = startingIndex + perPage;
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

                    let totalPage = (response.length / 3) / perPage
                    if (totalPage - parseInt(totalPage) != 0) {
                        totalPage = parseInt(totalPage) + 1
                    }
                    res.render("categoryList", {
                        // data: arr,
                        data: data,
                        current: page,
                        pages: totalPage
                    })
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    //  Get Edit Category Data  //

    editCategory = (req, res) => {
        try {
            let id = "<" + resourcePrefix + "Category/" + req.params.id + ">";
            let tableType = "<" + prefix + "Category>";
            let getCategory_query =
                "prefix dc: <http://purl.org/dc/elements/1.1/> " +
                "SELECT  ?Name ?Description " +
                "WHERE { " +
                id +
                " a " +
                tableType +
                " ." +
                id +
                " dc:Name ?Name. " +
                "OPTIONAL {" +
                id +
                " dc:Description  ?Description. }}";

            let final_update_query = querystring.stringify({
                query: getCategory_query,
            });

            request.post(
                {
                    headers: {
                        Accept: "application/sparql-results+json",
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    },
                    url: "http://localhost:9999/blazegraph/namespace/test/sparql",
                    body: final_update_query,
                },
                function (error, response, body) {
                    if (error) {
                        return res.status(400).json({ message: error });
                    }
                    if (body) {
                        let data = JSON.parse(body).results.bindings[0];
                        return res.render("editCategory", {
                            bodyData: data,
                        });
                    }
                }
            );
        } catch (error) {
            console.log(error);
        }
    };

    //  POST Edit CategoryData  //

    editCategoryData = (req, res) => {
        try {
            let id = req.params.id;
            let Name = req.body.Name;
            let Description = req.body.description;
            // console.log(Description);
            let prefixId = "<http://local.demo.com/#/knowledge/Category/";

            var data_field = {};
            data_field.Name = Name;
            if (Description) data_field.Description = Description;
            // console.log("id++++++++++", id);
            let edit_query =
                "prefix dc: <http://purl.org/dc/elements/1.1/> " + "DELETE { ";
            edit_query += prefixId + id + "> dc:Name ?Name .";
            edit_query += prefixId + id + "> dc:Description ?Description .";

            edit_query += "} INSERT {";
            for (var key in data_field) {
                if (data_field.hasOwnProperty(key)) {
                    edit_query +=
                        prefixId + id + "> dc:" + key + '"' + data_field[key] + '". ';
                }
            }
            edit_query += "}" + "WHERE { ";
            edit_query += prefixId + id + "> dc:Name ?Name .";
            edit_query +=
                "OPTIONAL {" + prefixId + id + "> dc:Description  ?Description. }}";
            // console.log(edit_query);
            let edit_data = querystring.stringify({
                update: edit_query,
            });

            request.post(
                {
                    headers: {
                        Accept: "application/sparql-results+json",
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    },
                    url: "http://localhost:9999/blazegraph/namespace/test/sparql",
                    body: edit_data,
                },
                function (error, response, body) {

                    if (error) {
                        res.status(400).json({ message: error });
                    }

                    return res.redirect("/categorylist/1");
                }
            );
        } catch (error) {
            console.log(error);
        }
    };

    //  Delete Category Data API    //

    deleteCategory = (req, res) => {
        try {
            const id = req.params.id;
            let tmpRecordId = create_UUID();
            let tableType = "<" + prefix + "Category>";
            let CategoryId = "<" + resourcePrefix + "Category/" + tmpRecordId + ">";
            let prefixId = "<http://local.demo.com/#/knowledge/Category/";

            let deletCategory_query =
                "prefix dc: <http://purl.org/dc/elements/1.1/> " +
                "DELETE { " +
                prefixId +
                id +
                "> ?a  ?b ." +
                "}" +
                "WHERE { " +
                prefixId +
                id +
                "> ?a ?b ." +
                "}";

            let final_deletCategory_query = querystring.stringify({
                update: deletCategory_query,
            });

            request.post(
                {
                    headers: {
                        Accept: "application/sparql-results+json",
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    },
                    url: "http://localhost:9999/blazegraph/namespace/test/sparql",
                    body: final_deletCategory_query,
                },
                function (error, response, body) {
                    if (error) {
                        res.status(400).json({ message: error });
                    }
                    return res.redirect("/categorylist/1");
                }
            );
        } catch (error) {
            console.log(error);
        }
    };

    // Get One Category Record API //

    oneRecordCategory = (req, res) => {
        try {
            const id = req.params.id;
            let tmpRecordId = create_UUID();
            let tableType = "<" + prefix + "Category>";
            let prefixId = "<http://local.demo.com/#/knowledge/Category/";

            let getCategory_query = querystring.stringify({
                query:
                    "prefix dc: <http://purl.org/dc/elements/1.1/> " +
                    "SELECT ?Name ?Description " +
                    "WHERE { " +
                    prefixId +
                    id +
                    "> dc:Name ?Name. " +
                    "OPTIONAL {" +
                    prefixId +
                    id +
                    "> dc:Description  ?Description. }}",
            });

            let getData = request.post(
                {
                    headers: {
                        Accept: "application/sparql-results+json",
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    },
                    url: "http://localhost:9999/blazegraph/namespace/test/sparql",
                    body: getCategory_query,
                },
                function (error, response, body) {
                    let data = JSON.parse(body)["results"]["bindings"][0];
                    if (error) {
                        return res.status(400).json({ message: "Error" });
                    }
                    return res.render("viewCategory", {
                        data: data,
                    });
                }
            );
        } catch (error) {
            console.log(error);
        }
    };
}
