// ----------------------------------------------------------------//
//                  Cliente para consumo de SP's                   //
//  @ld.matamoros@gmail.com                                        //
//  Author: Luis Matamoros                                         //
//                                                                 //
// ----------------------------------------------------------------//

/* -----------------------------------------------------------------/
    Date:    01-04-2017
    Author:  Luis Matamoros
    Changes:
       First version 
/----------------------------------------------------------------- */
"use strict"

const SpRequestBuilder = require("./spRequestBuilder"),
    MySQLConnection = require("../client/mySQLConnection")

var SpClient = function (dbArgs) {
    this._spRequestBuilder = new SpRequestBuilder()
    this._mySQLConnection = new MySQLConnection(dbArgs)
    this._mysql = null

    this._mySQLConnection.connect().then(function (con) {
        let self = this
        self._mysql = con
        self._mysql.on("error", function (err, result) {
            console.error("Error occurred " + err.toString() + " Reconneting...")
            self.reconnect(self)
        })
    }.bind(this))

    this.errorBuilder = function (err) {
        try {
            let code = err.code
            let errMsg = err.toString().replace("Error: ", "").replace(code + ": ", "")
            return {
                "sqlState": code,
                "errorNo": code,
                "error": errMsg
            }
        } catch (exc) {
            return {
                "sqlState": "90000",
                "errorNo": 90000,
                "error": err.toString()
            }
        }
    }

    this.checkOutParams = function (rows, outs) {
        let resOuts = {}
        let jsonRows = JSON.parse(JSON.stringify(rows))
        let size = jsonRows.length
        if (size > 2 && jsonRows[size - 1].length > 0) {
            let outsRow = jsonRows[size - 1][0]
            for (var i = 0; i < outs.length; i++) {
                let key = outs[i]
                let outKey = "@" + key
                if (outKey in outsRow) {
                    resOuts[key] = outsRow[outKey]
                } else {
                    resOuts[key] = null
                }
            }
        }
        return resOuts
    }
}

SpClient.prototype.execute = function (spTemplate, spValues, response, args) {
    let self = this
    if (self._mysql.query) {
        self.runQuery(spTemplate, spValues, response, args)
    } else {
        self._mySQLConnection.connect().then(function (con) {
            console.log("Connected. Getting new reference")
            self._mysql = con
            if (self._mysql.query) {
                self.runQuery(spTemplate, spValues, response, args)
            } else {
                self.reconnect(self)
            }
            self._mysql.on("error", function (err, result) {
                console.error("Error occurred " + err.toString() + " Reconneting...")
                self.reconnect(self)
            })
        }, function (error) {
            console.error(error)
            console.log("Connection. Try again")
            setTimeout(self.reconnect.bind(null, self), 2000)
        })
    }
}

SpClient.prototype.runQuery = function (spTemplate, spValues, response, args) {
    let self = this
    try {
        self._mysql.query(self._spRequestBuilder.callBuilder(spTemplate, spTemplate.out),
            self._spRequestBuilder.argsBuilder(spTemplate.args, spValues),
            function (err, rows, fields) {
                if (err) {
                    response(self.errorBuilder(err), undefined, args)
                } else if (spTemplate.out.length > 0) {
                    response(undefined, rows, args, self.checkOutParams(rows, spTemplate.out))
                } else {
                    response(undefined, rows, args)
                }
            }
        )
    } catch (exc) {
        response({
            "sqlState": "90001",
            "errorNo": 90001,
            "error": exc.toString()
        }, undefined, args)
    }
}

SpClient.prototype.reconnect = function (self) {
    self._mySQLConnection.connect().then(function (con) {
        console.log("Connected. Getting new reference")
        self._mysql = con
        self._mysql.on("error", function (err, result) {
            console.error("Error occurred " + err.toString() + " Reconneting...")
            self.reconnect(self)
        })
    }, function (error) {
        console.error(error)
        console.log("Connection. Try again")
        setTimeout(self.reconnect.bind(null, self), 2000)
    })
}

module.exports = SpClient 
