import Sequelize from 'sequelize';
import {
    Announcement,
    AnnouncementI18n,
    Tag,
} from 'models/announcement/operations/associations.js';
import LanguageUtils from 'models/common/utils/language.js';
import ValidateUtils from 'models/common/utils/validate.js';
import tagUtils from 'models/announcement/utils/tag.js';

const op = Sequelize.Op;

/**
 * A function for getting all tv announcements to be shown in the main page.
 *
 * @async
 * @param   {number[]} [tags = []] - Specifying the pinned announcements with the given tags.
 * @param   {number}   amount      - Specifying the number of requested tv announcements.
 * @param   {number}   languageId  - Language option of the announcements.
 * @returns {object[]}               Requested pinned announcements, including:
 * - id
 * - title
 * - content
 * - image
 *
 */

export default async ( opt ) => {
    try {
        const {
            tags = [],
            amount = null,
            languageId = null,
        } = opt || {};

        if ( !tags.every( tagUtils.isSupportedId, tagUtils ) ) {
            const error = new Error( 'invalid tag id' );
            error.status = 400;
            throw error;
        }
        if ( !ValidateUtils.isPositiveInteger( amount ) ) {
            const error = new Error( 'invalid amount' );
            error.status = 400;
            throw error;
        }
        if ( !LanguageUtils.isSupportedLanguageId( languageId ) ) {
            const error = new Error( 'invalid language id' );
            error.status = 400;
            throw error;
        }

        let data = await Announcement.findAll( {
            attributes: [
                'announcementId',
            ],
            where: {
                isPublished: true,
                image:       {
                    [ op.not ]: null,
                },
            },
            include: [
                {
                    model:      Tag,
                    as:         'tag',
                    attributes: [],
                    where:      {
                        typeId: {
                            [ op.in ]: tags,
                        },
                    },
                },
            ],
            order:  [
                [
                    'updateTime',
                    'DESC',
                ],
            ],
            limit:    amount,

            /**
             * Sequelize have some issue when using limit, currently solving hack can use `subQuery: fasle`.
             */

            subQuery: false,
        } );

        if ( !data.length ) {
            const error = new Error( 'no result' );
            error.status = 404;
            throw error;
        }

        data = await Promise.all( data.map( ( { announcementId, } ) => Announcement.findOne( {
            attributes: [
                'announcementId',
                'image',
            ],
            where: {
                announcementId,
            },
            include: [
                {
                    model:      AnnouncementI18n,
                    as:         'announcementI18n',
                    attributes: [
                        'title',
                        'content',
                    ],
                    where: {
                        languageId,
                    },
                },
            ],
        } ) ) );

        data = data.map( announcement => ( {
            announcementId: announcement.announcementId,
            content:        announcement.announcementI18n[ 0 ].content,
            title:          announcement.announcementI18n[ 0 ].title,
            image:          announcement.image,
        } ) );

        return data;
    }

    catch ( err ) {
        console.error( err );
        if ( err.status )
            throw err;
        const error = new Error();
        error.status = 500;
        throw error;
    }
};
