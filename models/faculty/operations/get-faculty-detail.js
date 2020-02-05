import LanguageUtils from 'models/common/utils/language.js';
import degreeUtils from 'models/faculty/utils/degree.js';
import departmentUtils from 'models/faculty/utils/department.js';
import nationUtils from 'models/faculty/utils/nation.js';
import researchGroupUtils from 'models/faculty/utils/research-group.js';
import ValidateUtils from 'models/common/utils/validate.js';
import {
    AwardI18n,
    Award,
    ConferenceI18n,
    Conference,
    Department,
    EducationI18n,
    Education,
    ExperienceI18n,
    Experience,
    PatentI18n,
    Patent,
    ProfileI18n,
    Profile,
    ProjectI18n,
    Project,
    PublicationI18n,
    Publication,
    ResearchGroup,
    SpecialtyI18n,
    StudentAwardI18n,
    StudentAward,
    StudentI18n,
    Student,
    TechnologyTransferPatentI18n,
    TechnologyTransferPatent,
    TechnologyTransferI18n,
    TechnologyTransfer,
    Title,
    TitleI18n,
} from 'models/faculty/operations/associations.js';

/**
 * A function for getting full information (not including data id in databases) of a specific faculty by given profileId and language.
 *
 * @async
 * @param   {number} profileId  - ProfileId of the faculty. Deciding which user information to get.
 * @param   {number} languageId - The ID of language. Deciding the langauge of the requested information.
 * @returns {object}            - Information of the faculty. Including:
 * - award
 * - conference
 * - department
 * - education
 * - experience
 * - patent
 * - profile
 * - project
 * - publication
 * - researchGroup
 * - specialty
 * - studentAward
 * - technologyTransfer
 * - title
 *
 */

export default async ( opt ) => {
    try {
        opt = opt || {};
        const {
            languageId = null,
            profileId = null,
        } = opt;

        if ( !LanguageUtils.isSupportedLanguageId( languageId ) ) {
            const error = new Error( 'invalid language id' );
            error.status = 400;
            throw error;
        }
        if ( !ValidateUtils.isValidId( profileId ) ) {
            const error = new Error( 'invalid profile id' );
            error.status = 400;
            throw error;
        }

        const [
            award,
            conference,
            department,
            education,
            experience,
            patent,
            profile,
            profileI18n,
            project,
            publication,
            researchGroup,
            specialtyI18n,
            studentAward,
            technologyTransfer,
            title,
        ] = await Promise.all( [
            Award.findAll( {
                attributes: [
                    'receivedYear',
                ],
                where: {
                    profileId,
                },
                include: [
                    {
                        model:      AwardI18n,
                        as:         'awardI18n',
                        attributes: [
                            'award',
                        ],
                        where: {
                            language: languageId,
                        },
                    },
                ],
            } ),
            Conference.findAll( {
                attributes: [
                    'hostYear',
                ],
                where: {
                    profileId,
                },
                include: [
                    {
                        model:      ConferenceI18n,
                        as:         'conferenceI18n',
                        attributes: [
                            'conference',
                            'title',
                        ],
                        where: {
                            language: languageId,
                        },
                    },
                ],
            } ),
            Department.findAll( {
                attributes: [
                    'type',
                ],
                where: {
                    profileId,
                },
            } ),
            Education.findAll( {
                attributes: [
                    'degree',
                    'from',
                    'nation',
                    'to',
                ],
                where: {
                    profileId,
                },
                include: [
                    {
                        model:      EducationI18n,
                        as:         'educationI18n',
                        attributes: [
                            'major',
                            'school',
                        ],
                        where: {
                            language: languageId,
                        },
                    },
                ],
            } ),
            Experience.findAll( {
                attributes: [
                    'from',
                    'to',
                ],
                where: {
                    profileId,
                },
                include: [
                    {
                        model:      ExperienceI18n,
                        as:         'experienceI18n',
                        attributes: [
                            'department',
                            'organization',
                            'title',
                        ],
                        where: {
                            language: languageId,
                        },
                    },
                ],
            } ),
            Patent.findAll( {
                attributes: [
                    'applicationDate',
                    'certificationNumber',
                    'expireDate',
                    'issueDate',
                    'nation',
                ],
                where: {
                    profileId,
                },
                include: [
                    {
                        model:      PatentI18n,
                        as:         'patentI18n',
                        attributes: [
                            'inventor',
                            'patent',
                            'patentOwner',
                        ],
                        where: {
                            language: languageId,
                        },
                    },
                ],
            } ),
            Profile.findOne( {
                attributes: [
                    'email',
                    'fax',
                    'labTel',
                    'labWeb',
                    'nation',
                    'officeTel',
                    'personalWeb',
                    'photo',
                ],
                where: {
                    profileId,
                },
            } ),
            ProfileI18n.findOne( {
                attributes: [
                    'labAddress',
                    'labName',
                    'name',
                    'officeAddress',
                ],
                where: {
                    language: languageId,
                    profileId,
                },
            } ),
            Project.findAll( {
                attributes: [
                    'category',
                    'from',
                    'to',
                ],
                where: {
                    profileId,
                },
                include: [
                    {
                        model:      ProjectI18n,
                        as:         'projectI18n',
                        attributes: [
                            'name',
                            'support',
                        ],
                        where: {
                            language: languageId,
                        },
                    },
                ],
            } ),
            Publication.findAll( {
                attributes: [
                    'category',
                    'issueMonth',
                    'issueYear',
                    'international',
                    'refereed',
                ],
                where: {
                    profileId,
                },
                include: [
                    {
                        model:      PublicationI18n,
                        as:         'publicationI18n',
                        attributes: [
                            'authors',
                            'title',
                        ],
                        where: {
                            language: languageId,
                        },
                    },
                ],
            } ),
            ResearchGroup.findAll( {
                attributes: [
                    'type',
                ],
                where: {
                    profileId,
                },
            } ),
            SpecialtyI18n.findAll( {
                attributes: [
                    'specialty',
                ],
                where: {
                    profileId,
                    language: languageId,
                },
            } ),
            StudentAward.findAll( {
                attributes: [
                    'receivedYear',
                ],
                where: {
                    profileId,
                },
                include: [
                    {
                        model:      Student,
                        as:         'student',
                        attributes: [
                            'degree',
                        ],
                        include: [
                            {
                                model:      StudentI18n,
                                as:         'studentI18n',
                                attributes: [
                                    'name',
                                ],
                                where: {
                                    language: languageId,
                                },
                            },
                        ],
                    },
                    {
                        model:      StudentAwardI18n,
                        as:         'studentAwardI18n',
                        attributes: [
                            'award',
                        ],
                        where: {
                            language: languageId,
                        },
                    },
                ],
            } ),
            TechnologyTransfer.findAll( {
                attributes: [
                    'from',
                    'to',
                ],
                where: {
                    profileId,
                },
                include: [
                    {
                        model:      TechnologyTransferPatent,
                        as:         'technologyTransferPatent',
                        include:    [
                            {
                                model:      TechnologyTransferPatentI18n,
                                as:         'technologyTransferPatentI18n',
                                attributes: [
                                    'patent',
                                ],
                                where: {
                                    language: languageId,
                                },
                            },
                        ],
                    },
                    {
                        model:      TechnologyTransferI18n,
                        as:         'technologyTransferI18n',
                        attributes: [
                            'authorizedParty',
                            'authorizingParty',
                            'technology',
                        ],
                        where: {
                            language: languageId,
                        },
                    },
                ],
            } ),
            Title.findAll( {
                attributes: [
                    'from',
                    'to',
                ],
                where: {
                    profileId,
                },
                include: [
                    {
                        model:      TitleI18n,
                        as:         'titleI18n',
                        attributes: [
                            'title',
                        ],
                        where: {
                            language: languageId,
                        },
                    },
                ],
            } ),
        ] );

        /**
         * Profile not found.
         * Handle with 404 not found.
         */

        if ( !profile ) {
            const error = new Error( 'profile not found' );
            error.status = 404;
            throw error;
        }

        return {
            award: award.map( award => ( {
                award:         award.awardI18n[ 0 ].award,
                receivedYear:  award.receivedYear,
            } ) ),
            conference: conference.map( conference => ( {
                conference: conference.conferenceI18n[ 0 ].conference,
                hostYear:   conference.hostYear,
                title:      conference.conferenceI18n[ 0 ].title,
            } ) ),
            department: department.map( department => departmentUtils.getValueById( {
                id: department.type,
                languageId,
            } ) ),
            education:  education.map( education => ( {
                degree: degreeUtils.getValueById( {
                    id: education.degree,
                    languageId,
                } ),
                from:   education.from,
                major:  education.educationI18n[ 0 ].major,
                nation: nationUtils.getOptionById( education.nation ),
                school: education.educationI18n[ 0 ].school,
                to:     education.to,
            } ) ),
            experience: experience.map( experience => ( {
                department:   experience.experienceI18n[ 0 ].department,
                from:         experience.from,
                organization: experience.experienceI18n[ 0 ].organization,
                title:        experience.experienceI18n[ 0 ].title,
                to:           experience.to,
            } ) ),
            patent: patent.map( patent => ( {
                applicationDate:     patent.applicationDate,
                certificationNumber: patent.certificationNumber,
                expireDate:          patent.expireDate,
                inventor:            patent.patentI18n[ 0 ].inventor,
                issueDate:           patent.issueDate,
                nation:              nationUtils.getOptionById( patent.nation ),
                patent:              patent.patentI18n[ 0 ].patent,
                patentOwner:         patent.patentI18n[ 0 ].patentOwner,
            } ) ),
            profile: {
                email:         profile.email,
                fax:           profile.fax,
                labAddress:    profileI18n.labAddress,
                labName:       profileI18n.labName,
                labTel:        profile.labTel,
                labWeb:        profile.labWeb,
                name:          profileI18n.name,
                nation:        nationUtils.getValueById( {
                    id: profile.nation,
                    languageId,
                } ),
                officeAddress: profileI18n.officeAddress,
                officeTel:     profile.officeTel,
                personalWeb:   profile.personalWeb,
                photo:         profile.photo,
                profileId,
            },
            project: project.map( project => ( {
                category: project.category,
                from:     project.from,
                name:     project.projectI18n[ 0 ].name,
                support:  project.projectI18n[ 0 ].support,
                to:       project.to,
            } ) ),
            publication: publication.map( publication => ( {
                authors:       publication.publicationI18n[ 0 ].authors,
                category:      publication.category,
                international: publication.international,
                issueDate:     publication.issueDate,
                issueYear:     publication.issueYear,
                refereed:      publication.refereed,
                title:         publication.publicationI18n[ 0 ].title,
            } ) ),
            researchGroup: researchGroup.map( researchGroup => researchGroupUtils.getValueById( {
                id: researchGroup.type,
                languageId,
            } ) ),
            specialty:     specialtyI18n.map( specialty => specialty.specialty ),
            studentAward:  studentAward.map( studentAward => ( {
                award:        studentAward.studentAwardI18n[ 0 ].award,
                receivedYear: studentAward.receivedYear,
                student:      studentAward.student.map( student => ( {
                    degree: degreeUtils.getValueById( {
                        id: student.degree,
                        languageId,
                    } ),
                    name:   student.studentI18n[ 0 ].name,
                } ) ),
            } ) ),
            technologyTransfer: technologyTransfer.map( technologyTransfer => ( {
                authorizingParty: technologyTransfer.technologyTransferI18n[ 0 ].authorizingParty,
                authorizedParty:  technologyTransfer.technologyTransferI18n[ 0 ].authorizedParty,
                from:             technologyTransfer.from,
                patent:           technologyTransfer.technologyTransferPatent.map( patent => patent.technologyTransferPatentI18n[ 0 ].patent ),
                to:               technologyTransfer.to,
                technology:       technologyTransfer.technologyTransferI18n[ 0 ].technology,
            } ) ),
            title: title.map( title => ( {
                from:  title.from,
                title: title.titleI18n[ 0 ].title,
                to:    title.to,
            } ) ),
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
