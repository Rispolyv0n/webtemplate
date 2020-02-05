import {
    Admin,
} from 'models/auth/operations/associations.js';
import ValidateUtils from 'models/common/utils/validate.js';

/**
 * A function for getting a specific user data by a given user account.
 *
 * @async
 * @param {string} account - Id of the requested user.
 * @returns {object} - Related information of the requested user, including:
 * - userId
 * - account
 * - password
 * - role (staff or faculty)
 * - sid
 * - isValid
 * - name
 * - roleId (corresponding ID in staff or faculty table)
 *
 */

export default async ( opt ) => {
    try {
        const {
            account = null,
        } = opt || {};

        if ( !ValidateUtils.isValidString( account ) ) {
            const error = new Error( 'invalid account' );
            error.status = 400;
            throw error;
        }

        const data = await Admin.findOne( {
            attributes: [
                'userId',
                'account',
                'password',
                'role',
                'sid',
                'isValid',
                'name',
                'roleId',
            ],
            where: {
                account,
            },
        } );

        if ( !data ) {
            const error = new Error( 'no result' );
            error.status = 404;
            throw error;
        }

        return {
            userId:     data.userId,
            account:    data.account,
            password:   data.password,
            role:       data.role,
            sid:        data.sid,
            isValid:    data.isValid,
            name:       data.name,
            roleId:     data.roleId,
        };
    }
    catch ( err ) {
        if ( err.status )
            throw err;
        const error = new Error();
        error.status = 500;
        throw error;
    }
};
