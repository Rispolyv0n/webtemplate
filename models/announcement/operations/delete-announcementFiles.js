import ValidateUtils from 'models/common/utils/validate.js';
import {
    File,
} from 'models/announcement/operations/associations.js';
import { announcement, } from 'models/common/utils/connect.js';

/**
 * A function for deleting the associated files of a specific announcement by given IDs of the files.
 *
 * @async
 * @param {number}    announcementId - Id of the announcement. Deciding which announcement file to delete.
 * @param {number []} fileId - IDs of files to be deleted.
 *
 */

export default async ( opt ) => {
    try {
        opt = opt || {};
        const {
            announcementId = null,
            fileId = null,
        } = opt;

        if ( !ValidateUtils.isValidId( announcementId ) ) {
            const error = new Error( 'Invalid announcement id' );
            error.status = 400;
            throw error;
        }

        if ( ValidateUtils.isValidArray( fileId ) ) {
            for ( const id of fileId ) {
                if ( !ValidateUtils.isValidId( id ) ) {
                    const error = new Error( 'Invalid file id' );
                    error.status = 400;
                    throw error;
                }
            }
        }
        else {
            const error = new Error( 'Invalid file id' );
            error.status = 400;
            throw error;
        }

        for ( const id of fileId ) {
            await announcement.transaction( t => File.update( {
                isValid: 0,
            }, {
                where: {
                    announcementId,
                    fileId: id,
                },
                transaction: t,
            } ) ).catch( ( err ) => {
                throw err;
            } );
        }
        return;
    }
    catch ( err ) {
        throw err;
    }
};
