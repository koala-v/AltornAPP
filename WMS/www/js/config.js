'use strict';
var appConfig = angular.module('WMSAPP.config',[]);
appConfig.constant('ENV', {
    website:      'www.sysfreight.net/app/wms/Altron',
     api:        'www.sysfreight.net/apis/wms/Altron',
    // api:          'localhost',
    // api: 'localhost:26721',
    reset:  {
        website:      'www.sysfreight.net/app/wms/Altron',
        api:          'www.sysfreight.net/apis/wms/Altron',
        port:         '8081'
    },
    ssl:          false, // 0 : false, 1 : true
    //  port:         '52603', // http port no
    port:         '8081',
    debug:        true,
    mock:         false,
    fromWeb:      true,
    websql : {
        name: 'AltronDB',
        version: '1.0',
        displayName: 'WMS Database',
        estimatedSize: 10 * 11024 * 1024
    },
    sqlite : {
        name: 'AppAltronDB.db',
        location: 'default'
    },
    appId:        '9CBA0A78-7D1D-49D3-BA71-C72E93F9E48F',
    apkName:      'Altron',
    updateFile:   'update.json',
    rootPath:     'Altron',
    configFile:   'config.txt',
    version:      '1.0.1.1',
    parameter: {
        showSerialNo : true
    },
    apiMap: {
        login: {
            check : '/api/wms/login/check'
        }
    }
});
