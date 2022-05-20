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
function book_query(req, cb) {

    const { BookTitle, price, authorname } = req.body
    // console.log(req.body)
    var tmpRecordId = create_UUID();
    var tableType = '<' + prefix + 'Book>';
    var BookId = '<' + resourcePrefix + 'Book/' + tmpRecordId + '>';

    var data_field = {}

    data_field.BookTitle = BookTitle
    data_field.price = price
    // data_field = Number(price)
    if (authorname)
        data_field.AuthorName = authorname
    data_field.id = BookId



    var q1 = 'prefix dc: <http://purl.org/dc/elements/1.1/>' +
        ' INSERT  { ' +
        BookId + ' a ' + tableType + '. '

    for (var key in data_field) {
        if (data_field.hasOwnProperty(key)) {

            var q1 = q1 + BookId + ' dc:' + key + '"' + data_field[key] + '". '
        }
    }
    // console.log("\nquery-----\n", q1, '\n');
    var q1 = q1 + '} WHERE { BIND(NOW() as ?created )}';
    var query = querystring.stringify({ 'update': q1 });

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

export { send_request, book_query, create_UUID }
