class Dictlib {
    constructor() {
        this.options = null;
        this.lastoptions = null;
        this.default = ['local/encn_Youdao.js'];
        this.list = [];
        this.dicts = {};
    }

    setOptions(opts) {
        this.lastoptions = this.options;
        this.options = opts;
    }

    async loadDict() {
        let remotelist = this.options.dictLibrary;
        if (this.pathChanged(remotelist)) {
            this.list = this.default;
            this.dicts = {};
            if (remotelist)
                await this.loadLibrary([remotelist].map(this.pathMapping));
            await this.loadLibrary(this.list.map(this.pathMapping));
        }
        let selected = this.options.dictSelected;
        selected = (selected in this.dicts) ? selected : chrome.i18n.getMessage('encn_Youdao');
        this.options.dictSelected = selected;
        this.options.dictNamelist = Object.keys(this.dicts);
        return this.options;
    }

    pathMapping(path) {
        let paths = {
            'odh://': 'local/',
            'lib://': 'https://rawgit.com/ninja33/ODH/master/dicts/',
            'git://': 'https://rawgit.com/',
        }

        for (const key of Object.keys(paths)) {
            path = (path.indexOf(key) != -1) ? paths[key] + path.replace(key, '') : path;
        }

        path = (path.indexOf('.js') == -1) ? path + '.js' : path;
        return path;
    }

    pathChanged(remotelist) {
        return !this.lastoptions || (this.lastoptions.dictLibrary != remotelist);
    }

    async loadLibrary(path) {
        return new Promise((resolve, reject) => {
            loadjs(path, {
                success: () => resolve(),
                error: () => resolve(), // nothing happened
            });
        });
    }

    setList(list) {
        this.list = this.list.concat(list);
    }

    setDict(key, dict) {
        try {
            this.dicts[key] = dict;
        } catch (error) {
            console.log(error);
        }
    }
}

function registerList(list) {
    aodhback.dictlib.setList(list);
}

function registerDict(name, dict) {
    aodhback.dictlib.setDict(name, dict);
}