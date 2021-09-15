/*
 * Copyright 2015 Telefonica Investigación y Desarrollo, S.A.U
 *
 * This file is part of sigfox-iotagent
 *
 * sigfox-iotagent is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * sigfox-iotagent is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with sigfox-iotagent.
 * If not, seehttp://www.gnu.org/licenses/.
 *
 * For those usages not covered by the GNU Affero General Public License
 * please contact with::[daniel.moranjimenez at telefonica.com]
 */

const conversions = {
    uint: 'readUIntBE'
};
/* eslint-disable no-unused-vars */
const context = {
    op: 'IoTAgentSIGFOX.SigfoxParser'
};

function createParser(key) {
    const rawFields = key.replace(/\s+/g, ' ').split(' ');
    const fields = rawFields.reduce(function (previousValue, currentValue) {
        const field = currentValue.split('::');
        const size = field[1].split(':');

        previousValue.push({
            name: field[0],
            type: size[0],
            size: size[1] / 8
        });

        return previousValue;
    }, []);

    return function parse(rawData, callback) {
        const buf = Buffer.from(rawData, 'hex');
        let offset = 0;
        let fieldIndex = 0;
        const data = {};

        while (offset < buf.length) {
            const field = fields[fieldIndex];

            data[field.name] = buf[conversions[field.type]](offset, field.size);

            fieldIndex++;
            offset += field.size;
        }

        callback(null, data);
    };
}

exports.createParser = createParser;
