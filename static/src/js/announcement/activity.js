import GetHeader from 'static/src/js/components/common/header.js';
import MultipleDefaultTagFilter from 'static/src/js/components/announcement/multiple-default-tag-filter.js';
import WebLanguageUtils from 'static/src/js/utils/language.js';

window.addEventListener( 'load', () => {
    const header = new GetHeader( {
        headerDOM: document.getElementById( 'header' ),
    } );

    const filter = new MultipleDefaultTagFilter( {
        defaultTag: [
            'competition',
            'conference',
            'exhibition',
            'speech',
        ],
        supportedTag:          [],
        filterDOM:             document.getElementById( 'filter' ),
        announcementPinnedDOM: document.getElementById( 'announcement--pinned' ),
        announcementNormalDOM: document.getElementById( 'announcement--normal' ),
        pagesDOM:              document.getElementById( 'pages' ),
        scrollTopDOM:          document.getElementById( 'announcement--normal' ),
        amount:                6,
        from:                  new Date( '2019/01/01' ),
        to:                    new Date( Date.now() ),
        page:                  1,
        visiblePageNum:        2,
        currentLanguageId:     WebLanguageUtils.currentLanguageId,
    } );
    filter.getAll();
} );
