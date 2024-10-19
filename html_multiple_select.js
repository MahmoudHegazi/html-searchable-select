/* small lib for create Multiple select input displayed nice and with search and native html input so easy to use the orginal select input and add any events to it and direct access it value so this html class only not related to any handle or even needed after just use your original html select (who can use this lib any html developer only) no need js exp to control the HTML Mutiple With Search element*/
let hssIndex = 0;
class HTMLSearchableSelect {
    constructor(selectSelector) {
        /* required Args */
        const select = $(selectSelector);
        // validateRequiredArgs or throw error stop creation
        if (!select.length) {
            console.error(`HMWS Error select element with selector ${selectSelector} not found`);
            this.ready = false;
            this.shown = false;

        } else {
            this.index = ++hssIndex;
            this._select = selectSelector;
            this.select = select;
            this.id = `hss_${this.index}`;

            this.searchId = `${this.id}_search`;
            this.searchSelector = `#${this.searchId}`;

            this.mainContId = `${this.id}_mcont`;
            this.mainContSelector = `#${this.mainContId}`;

            this.selectContid = `${this.id}_scont`;
            this.selectContSelector = `#${this.selectContid}`;

            this.totalSelectedId = `${this.id}_total`;
            this.totalSelectedSelector = `#${this.totalSelectedId}`;

            this.miniId = `${this.id}_mini`;
            this.miniSelector = `#${this.miniId}`;

            this.minContId = `${this.id}_mincont`;
            this.minContSelector = `#${this.minContId}`;

            this.minimizedHSSContId = `${this.id}_mhsscont`;
            this.minimizedHSSContSelector = `#${this.minimizedHSSContId}`;

            this.minimizedHSSId = `${this.id}_mhsswraper`;
            this.minimizedHSSSelector = `#${this.minimizedHSSId}`;




            this.hiddenClass = `${this.id}_hidden`;
            this.hiddenSelector = `.${this.hiddenClass}`;


            /* optional label */
            this.name = select.attr('data-name') ? select.attr('data-name') : '';

            this.label = select.attr('data-label');
            /* optional placeholder */
            this._searchPlaceholder = select.attr('data-search-placeholder');
            this._searchStyle = select.attr('data-search-style');
            this._contStyle = select.attr('data-cont-style');
            this._labelStyle = select.attr('data-label-style');
            this._counterStyle = select.attr('data-counter-style');
            this._counter = select.attr('data-counter');
            this._minimizable = select.attr('data-minimizable');
            this.setOptions();

            // display the HTMLMultipleWithSearch element
            /* ready for display */
            this.ready = true;
            this.displayAsHMWS();

        }
    }

    getOptionalVal(thisVar, defaultVal, templateCB = (val) => {
        return val;
    }) {
        /* optional placeholder for search input */
        if (thisVar) {
            /* attr exist with value */
            return templateCB(thisVar);

        } else if (typeof(thisVar) !== 'undefined') {
            /* attr defined but with null or empty val default */
            return templateCB(defaultVal);

        } else {
            /* attr not exist */
            return '';
        }
    }
    setOptions() {
        /* apply html provided options and select between display val or display default or omit default all controlled by html only (attr with val) (attr empty or exist) (attr not defined)
         */

        this.searchStyle = this.getOptionalVal(this._searchStyle, `font-size:0.750rem;`);
        this.labelStyle = this.getOptionalVal(this._labelStyle, ``);


        const placeHolderStr = (this.name) ? ` ${this.name}` : this.name;
        this.searchPlaceholder = this.getOptionalVal(this._searchPlaceholder, `Search${placeHolderStr}:`);

        this.contStyle = this.getOptionalVal(this._contStyle, `background:lavender !important;`);

        this.counterStyle = this.getOptionalVal(this._counterStyle, '');

        /* 2options only attrs lower level programing */
        if (this._counter || typeof(this._counter) !== 'undefined') {
            this.counter = `<span class="badge" style="color: #fff; background-color: #6c757d;position:absolute;z-Index:100;right:0;top:0;${this.counterStyle}" title="Total Selected" id="${this.totalSelectedId}">0</span>`;
        } else {
            this.counter = '';
        }

        if (this._minimizable || typeof(this._minimizable) !== 'undefined') {
            this.minimizeBtn = `<i class="btn btn-sm btn-outline-light" style="font-size:0.725rem;padding:4px;" title="display minimized select" id="${this.miniId}">&#128229;</i>`;
            this.minimizedHSS = `<div style="display:none;" id="${this.minimizedHSSContId}" class="p-0 m-0 w-100">
              <button class="d-flex wrapper justify-content-between align-items-stretch w-100 btn btn-light text-white min_cont" id="${this.minContId}" title="display maximized select">
                 <div class="min_content d-flex" id="${this.minimizedHSSId}"></div>
                 <div class="btn btn-sm btn-outline-light" style="font-size:0.725rem;padding:4px;" >&#128228;</div>
              </button>
           </div>`;
            this.minimizeMr = 'mr-1';

        } else {
            this.minimizeBtn = '';
            this.minimizedHSS = '';
            this.minimizeMr = '';
        }


        /* optional create html label if user set data-label with value */
        let labelStr = this.label || this.name;
        labelStr = (labelStr) ? ` ${labelStr}` : '';
        this.labelHTML = this.getOptionalVal(this.label, `Select${labelStr}:`, (val) => {
            return `<div class="col-sm-12 m-0 p-0" style="position:relative;"><label style="${this.labelStyle}">${val}</label>${this.counter}</div>`
        });


    }
    addEvents() {
        /* search input */
        if ($(this.searchSelector).length) {
            $(this.searchSelector).on('input.hss', () => {
                this.search();
            });
        }
        if ($(this.miniSelector).length) {
            $(this.miniSelector).on('click.hss', () => {
                this.minimize();
            });
        }
        if ($(this.minContSelector).length) {
            $(this.minContSelector).on('click.hss', () => {
                this.maximize();
            });
        }

        /* select change (select element in state change not removed like the search input (show or hide select not removed so here off prev event) */
        if (this.select.length) {
            this.select.off('change.hss');
            this.select.on('change.hss', () => {
                this.updateVal()
            });
        }

    }
    displayAsHMWS() {
        if (this.ready) {
            this.hss = $(`
            <div class="hss-select row m-1 p-1 border rounded" style="${this.contStyle}" id="${this.mainContId}">
                ${this.labelHTML} <!-- optional label -->
                ${this.minimizedHSS} <!-- optional minimizedHSS -->
                <div class="col-sm-12 row m-0 p-0 minimize_target">
                    <div class="col-sm-12 m-0 p-0 d-flex">
                        <input type="text" class="form-control ${this.minimizeMr}" id="${this.searchId}" placeholder="${this.searchPlaceholder}" style="${this.searchStyle}" />
                        <!-- optional minimizeBtn -->
                        ${this.minimizeBtn}
                    </div>
                    <div class="col-sm-12 m-0 p-0" id="${this.selectContid}"></div>
                </div>
            </div>`);
            this.select.parent()[0].insertBefore(this.hss[0], this.select[0]);
            $(this.selectContSelector)[0].appendChild(this.select[0]);
            this.shown = true;

            // add events or readd
            this.addEvents();

        }
        return this;
    }
    cancelDisplay() {
        if (this.ready) {
            if (this.shown) {
                /* back the select as normal select html element */
                $(this.mainContSelector).parent()[0].insertBefore(this.select[0], $(this.mainContSelector)[0]);
                $(this.mainContSelector).remove();
                this.shown = false;
            }
        }
        return this;
    }
    minimize() {
        this.hss.find('.minimize_target').hide();
        $(this.minimizedHSSContSelector).show();
    }
    maximize() {
        $(this.minimizedHSSContSelector).hide();
        this.hss.find('.minimize_target').show();
    }
    search() {
        console.log('search', this);
        const searchElm = $(this.searchSelector);
        if (searchElm.length) {
            const searchVal = searchElm.val();
            if (searchElm) {

                // new search result
                const options = this.select.find(`option`);

                /* reset options (also it handle if not found it default here */
                $(this.hiddenSelector).show();
                $(this.hiddenSelector).removeClass(this.hiddenClass);

                options.each((_i, opt) => {
                    const searchTerm = searchVal.toLowerCase();
                    const optionTxt = $(opt).text().toLowerCase();
                    const optionVal = String($(opt).val()).toLowerCase();
                    /* notice the diff between includes and == multiple vals for txt, but signle for id result ex search term is 1 and id 1001 and id 1 found id 1 only displayed */
                    if (!(optionTxt.startsWith(searchTerm) || (optionVal == searchTerm))) {
                        $(opt).hide();
                        $(opt).addClass(this.hiddenClass);
                    }
                });
                console.log(`search for ${searchVal}`, this.select.find(`option`).length);
            } else {
                // display all result empty result
                console.log(`cancel search`);
            }

        } else {
            console.log('search not found');
        }
    }
    updateVal() {
        if (this.select.length && typeof(this.select.val()) !== 'undefined') {
            this.val = this.select.val();
            $(this.totalSelectedSelector).html(this.val.length);

            /* update mini select data */
            if ($(this.minimizedHSSSelector).length) {
                let miniHTML = '';
                this.select.find('option:selected').each((_i, opt) => {
                    miniHTML += `<div title="${$(opt).val()}" class="badge btn-outline-secondary border border-dark d-flex justify-content-center align-items-center mr-1">${$(opt).text()}</div>`;
                });
                $(this.minimizedHSSSelector).html(miniHTML);
            }
            console.log('updateVal', this);
        }


    }
}
