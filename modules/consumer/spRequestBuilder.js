// ----------------------------------------------------------------//
//                  Cliente para consumo de SP's                   //
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

var SpRequestBuilder = function () {}

SpRequestBuilder.prototype.callBuilder = function (spTemplate, spOut) {
    function addOuts (outs) {
        outs = outs.map(function (lOut) {
            return "@" + lOut
        })
        let params = outs.join(",")
        return "," + params + "); SELECT " + params + ";"
    }

    let size = Object.keys(spTemplate.args).length
    return "CALL " + spTemplate.name + "(" + "?,".repeat(size).slice(0, -1) +
        (spOut.length > 0 ? addOuts(spOut) : ")")
}

SpRequestBuilder.prototype.argsBuilder = function (spArgs, spValues) {
    let values = []
    for (let key in spArgs) {
        if (key in spValues) {
            values.push(spValues[key])
        } else {
            values.push(null)
        }
    }
    return values
}

module.exports = SpRequestBuilder
