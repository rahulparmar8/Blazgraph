import request from 'request';
import querystring from 'querystring';


//  Unique ID Function  //
function create_UUID() {
    var dt = new Date().getTime();
    return dt;
}

function gen_query(insert_fields, id, tableType, query_type) {
    if (query_type == "post") {
        var q1 = 'prefix dc: <http://purl.org/dc/elements/1.1/>' +
            ' INSERT  { ' +
            id + ' a ' + tableType + '. '
        for (var key in insert_fields) {
            if (insert_fields.hasOwnProperty(key)) {
                var q1 = q1 + id + ' dc:' + key + '"' + insert_fields[key] + '". '
            }
        }
        var q1 = q1 + '} WHERE { BIND(NOW() as ?created )}';
        var query = querystring.stringify({ 'update': q1 });

        return query;
    }
}



function send_request(request_query, request_type) {
    if (request_type == "get") {
        request.get(
            {
                headers: {
                    'Accept': 'application/sparql-results+json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                url: 'http://localhost:9999/blazegraph/namespace/test/sparql',
                body: request_query
            }, function (error, response, body) {
                // console.log(body);
            });
    } else if (request_type == "post") {
        request.post(
            {
                headers: {
                    'Accept': 'application/sparql-results+json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                url: 'http://localhost:9999/blazegraph/namespace/test/sparql',
                body: request_query
            }, function (error, response, body) {
                //  console.log(body);
            });
    } else if (request_type == "delete") {

    } else {

    }
}

export { send_request, gen_query, create_UUID }
// module.exports = send_request;