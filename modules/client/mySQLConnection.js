// ----------------------------------------------------------------//
//                        Cliente de MySQL                         //
//  @ld.matamoros@gmail.com                                        //
//  Author: Luis Matamoros                                         //
//                                                                 //
// ----------------------------------------------------------------//

/* -----------------------------------------------------------------/
    Date:    20-05-2018
    Author:  Luis Matamoros
    Changes:
       First version 
/----------------------------------------------------------------- */
"use strict"

const mysql = require("mysql"),
    q = require("q")

var MySQLConnection = function (dbArgs) {
    this._dbArgs = dbArgs
}

MySQLConnection.prototype.connect = function () {
    let self = this
    let d = q.defer()
    
    var connection = mysql.createConnection(self._dbArgs)

    connection.connect(function (err) {
        if (err) {
            console.error("Not connected " + err.toString() + " RETRYING...")
            d.reject()
        } else {
            console.log("Connected to Mysql. Exporting..")
            d.resolve(connection)
        }
    })

    connection.on("error", function (err) {
        console.error("Connection error " + err.toString())
    })

    return d.promise
}

module.exports = MySQLConnection
