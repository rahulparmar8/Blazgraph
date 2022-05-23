import request from 'request';
import querystring from 'querystring';

var resourcePrefix = 'http://local.demo.com/#/knowledge/'
var prefix = 'https://ontology.demo.com/2016/04/demo#';

//  Unique ID Function  //
function create_UUID() {
    var dt = new Date().getTime();
    return dt;
}

//  Query Generate  //
function Category_query(req, cb) {

    const { Name, description } = req.body
    console.log(req.body)
    var tmpRecordId = create_UUID();
    var tableType = '<' + prefix + 'Category>';
    var CategoryId = '<' + resourcePrefix + 'Category/' + tmpRecordId + '>';
    var data_field = {}

    data_field.Name = Name
    if (description)
        data_field.Description = description
    data_field.id = CategoryId



    var q1 = 'prefix dc: <http://purl.org/dc/elements/1.1/>' +
        ' INSERT  { ' +
        CategoryId + ' a ' + tableType + '. '
    for (var key in data_field) {
        if (data_field.hasOwnProperty(key)) {

            var q1 = q1 + CategoryId + ' dc:' + key + '"' + data_field[key] + '".'
        }
    }
    var q1 = q1 + '} WHERE { BIND(NOW() as ?created )}';
    var query = querystring.stringify({ 'update': q1 });
    // console.log("query-----", q1,);


    send_request(query, "post", function (err, user) {
        // return res.json({ user })
        if (err) {
            cb(err, null)
        }
        cb(null, user)
    });
}


//  Request Send    //

function send_request(request_query, request_type, cb) {
    // console.log('request_query',request_query)
    request.post(
        {
            headers: {
                'Accept': 'application/sparql-results+json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            url: 'http://localhost:9999/blazegraph/namespace/test/sparql',
            body: request_query
        }, function (error, response, body) {

            if (error) {
                cb(error, null)
            }
            cb(null, body)
            // console.log("**************", response, "**************", body)
            // return data

        });
}

export { send_request, Category_query, create_UUID }