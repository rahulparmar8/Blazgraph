// AddCar API POST //   
//     addCar = (req, res) => {
//         try {
//             const { CarName, price } = req.body
//             var tmpRecordId = create_UUID();
//             var tableType = '<' + prefix + 'Car>';
//             var CarId = '<' + resourcePrefix + 'Car/' + tmpRecordId + '>';

//             var query2 = querystring.stringify({
//                 'update': 'prefix dc: <http://purl.org/dc/elements/1.1/> ' +
//                     'INSERT {?CarId  a ' + tableType + ' .' +
//                     '?CarId dc:CarName "' + CarName + '" .' +
//                     '?CarId dc:price "' + price + '".' +
//                     'WHERE { BIND(NOW() as ?created) '
//             });
//             console.log(query2);
//             var query = car(query)

//             res.status(200).json({ message: "Data Saved", id: CarId })
//         } catch (error) {
//             console.log(error);
//         }
//     }






//  Car function  //
// function car(req, query, cb) {

//     var q1 = 'prefix dc: <http://purl.org/dc/elements/1.1/>' +

//         send_request(query, function (err, resp, body,) {
//             if (err) {
//                 cb(err, null);
//             }
//             console.log('query', q1)
//             cb(null, body);
//         })
// }
