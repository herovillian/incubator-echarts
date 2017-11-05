(function () {

    var baseUrl = window.AMD_BASE_URL || '../';
    var sourceMap = window.AMD_ENABLE_SOURCE_MAP;
    // `true` by default for debugging.
    sourceMap == null && (sourceMap = true);

    if (typeof require !== 'undefined') {
        require.config({
            baseUrl: baseUrl,
            paths: {
                'echarts': 'dist/echarts',
                'zrender': 'node_modules/zrender/dist/zrender',
                'geoJson': '../geoData/geoJson',
                'theme': 'theme',
                'data': 'test/data',
                'map': 'map',
                'extension': 'dist/extension'
            }
            // urlArgs will prevent break point on init in debug tool.
            // urlArgs: '_v_=' + (+new Date())
        });
    }

    if (typeof requireES !== 'undefined') {
        requireES.config({
            baseUrl: baseUrl,
            paths: {
                'echarts': './',
                'zrender': 'node_modules/zrender',
                'geoJson': 'geoData/geoJson',
                'theme': 'theme',
                'data': 'test/data',
                'map': 'map',
                'extension': 'extension'
            },
            // urlArgs: '_v_=' + (+new Date()),
            sourceMap: sourceMap
        });
    }

    // Set default renderer in dev mode from hash.
    var matchResult = location.href.match(/[?&]__RENDERER__=(canvas|svg)(&|$)/);
    if (matchResult) {
        window.__ECHARTS__DEFAULT__RENDERER__ = matchResult[1];
    }

    // Mount bundle version print.
    if (typeof require !== 'undefined') {
        var originalRequire = require;
        window.require = function (deps, cb) {
            var newCb = function () {
                if (deps && deps instanceof Array) {
                    printBundleVersion(deps, [].slice.call(arguments));
                }
                cb && cb.apply(this, arguments);
            };
            return originalRequire.call(this, deps, newCb);
        };
    }

    function printBundleVersion(bundleIds, bundles) {
        var content = [];
        for (var i = 0; i < bundleIds.length; i++) {
            var bundle = bundles[i];
            var bundleVersion = bundle && bundle.bundleVersion;
            if (bundleVersion) {
                var date = new Date(+bundleVersion);
                // Check whether timestamp.
                if (!isNaN(+date)) {
                    bundleVersion = date.getHours() + ':' + date.getMinutes() + ': '
                        + '<span style="color:yellow">'
                        + date.getSeconds() + '.' + date.getMilliseconds()
                        + '</span>';
                }
                else {
                    bundleVersion = encodeHTML(bundleVersion);
                }
                content.push(encodeHTML(bundleIds[i]) + '.js: ' + bundleVersion);
            }
        }

        var domId = 'ec-test-bundle-version';
        var dom = document.getElementById(domId);
        if (!dom) {
            dom = document.createElement('div');
            dom.setAttribute('id', domId);
            dom.style.cssText = [
                'background: rgb(52,56,64)',
                'color: rgb(215,215,215)',
                'position: fixed',
                'right: 0',
                'top: 0',
                'font-size: 10px',
                'padding: 1px 2px 1px 2px',
                'border-bottom-left-radius: 3px'
            ].join(';');
            document.body.appendChild(dom);
        }
        dom.innerHTML = content.join('');
    }

    function encodeHTML(source) {
        return String(source)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

})();