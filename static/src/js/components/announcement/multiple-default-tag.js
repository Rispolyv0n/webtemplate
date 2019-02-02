import TagUtils from 'models/announcement/utils/tag.js';
import tagsHTML from 'static/src/pug/components/announcement/tags.pug';
import config from 'static/src/js/components/announcement/filter/default-value.js';
import { classAdd, classRemove, } from 'static/src/js/utils/class-name.js';
import DefaultTagFilter from 'static/src/js/components/announcement/default-tag.js';

export default class MultipleDefaultTagFilter extends DefaultTagFilter{
    constructTagHTML(){
        let tags = [{
            color: 'yellow',
            tagId: -1,
            tag: TagUtils.getTagAll(this.state.languageId),
        }];
        this.tagId.supported.forEach(tagId => {
            tags.push({
                color: TagUtils.getTagColorById( tagId ),
                tagId,
                tag:   TagUtils.getTagById( { tagId, languageId: this.state.languageId, } ),
            });
        });
        this.tagId.default.forEach(tagId => {
            tags.push({
                color: TagUtils.getTagColorById( tagId ),
                tagId,
                tag:   TagUtils.getTagById( { tagId, languageId: this.state.languageId, } ),
            });
        });

        this.DOM.filter.tags.innerHTML = tagsHTML( {
            tags,
        } );
    }

    subscribeTimeFromEvent(){
        [
            'year',
            'month',
            'date',
        ].forEach( ( key ) => {
            this.DOM.filter.from[ key ].addEventListener( 'change', () => {
                const year  = this.DOM.filter.from.year.value;
                const month = this.DOM.filter.from.month.value;
                const date  = this.DOM.filter.from.date.value;
                this.state.page = config.page;

                /**
                 * @todo add date validation.
                 */

                this.state.from = new Date( `${ year }/${ month }/${ date }` );
                if (this.state.selectAll){
                    this.getPage(this.tagId.default).then(()=>{
                        this.getPinnedAnnouncement(this.tagId.default);
                    }).then(()=>{
                        this.getNormalAnnouncement(this.tagId.default);
                    });
                }else{
                    this.getPage(this.state.tags).then(() => {
                        this.getPinnedAnnouncement(this.state.tags);
                    }).then(() => {
                        this.getNormalAnnouncement(this.state.tags);
                    });
                }
            } );
        } );
    }

    subscribeTimeToEvent(){
        [
            'year',
            'month',
            'date',
        ].forEach( ( key ) => {
            this.DOM.filter.to[ key ].addEventListener( 'change', () => {
                const year  = this.DOM.filter.to.year.value;
                const month = this.DOM.filter.to.month.value;
                const date  = this.DOM.filter.to.date.value;
                this.state.page = config.page;

                /**
                 * @todo add date validation.
                 */

                this.state.to = new Date( `${ year }/${ month }/${ date }` );
                if (this.state.selectAll){
                    this.getPage(this.tagId.default).then(()=>{
                        this.getPinnedAnnouncement(this.tagId.default);
                    }).then(()=>{
                        this.getNormalAnnouncement(this.tagId.default);
                    });
                }else{
                    this.getPage(this.state.tags).then(() => {
                        this.getPinnedAnnouncement(this.state.tags);
                    }).then(() => {
                        this.getNormalAnnouncement(this.state.tags);
                    });
                }
            } );
        } );
    }

    subscribeTagEvent(){
        const tagDOMArr = Array.from( this.DOM.filter.tags.querySelectorAll( '.tags__tag' ) );
        tagDOMArr.forEach( ( tagDOM ) => {
            const tagId = Number( tagDOM.getAttribute( 'data-tag-id' ) );

            /* Default tag event subscribe */
            if(tagId === -1){
                /* Default tag should be always active. */
                classAdd( tagDOM, 'tags__tag--active' );
                tagDOM.addEventListener( 'click', () => {
                    tagDOMArr.forEach( ( tagDOM ) => {
                        classRemove( tagDOM, 'tags__tag--active' );
                    } );
                    classAdd( tagDOM, 'tags__tag--active' );
                    this.state.selectAll = true;
                    this.state.tags = [];
                    this.state.tags.push(tagId);
                    this.state.page = config.page;
                    this.getPage(this.tagId.default).then(()=>{
                        this.getPinnedAnnouncement(this.tagId.default);
                    }).then(()=>{
                        this.getNormalAnnouncement(this.tagId.default);
                    });
                } );
            }else{
                tagDOM.addEventListener( 'click', () => {
                    const index = this.state.tags.indexOf( tagId );
                    if ( index >= 0 ) {
                        this.state.tags.splice( index, 1 );
                        classRemove( tagDOM, 'tags__tag--active' );
                    }
                    else {
                        this.state.tags.push( tagId );
                        classAdd( tagDOM, 'tags__tag--active' );
                    }
                    this.state.selectAll = false;
                    this.state.page = config.page;
                    this.getPage(this.state.tags).then(() => {
                        this.getPinnedAnnouncement(this.state.tags);
                    }).then(() => {
                        this.getNormalAnnouncement(this.state.tags);
                    });
                } );
            }
        } );
        this.getPage(this.tagId.default).then(()=>{
            this.getPinnedAnnouncement(this.tagId.default);
        }).then(()=>{
            this.getNormalAnnouncement(this.tagId.default);
        });
    }
}
