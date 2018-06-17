// ----------------------------------------------------------------//
//                     DB Actions controller                       //
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

var SpClient = require("./modules/consumer/spClient")

var MysqlInterface = function (dbArgs) {
    this._spClient = new SpClient(dbArgs)

    this.request = function (action, reqArgs) {
        this[action](reqArgs)
    }
}

MysqlInterface.prototype.execute = function (spTemplate, spValues, callback, resArgs) {
    let self = this
    self._spClient.execute(spTemplate, spValues, callback, resArgs)
}

module.exports = MysqlInterface
