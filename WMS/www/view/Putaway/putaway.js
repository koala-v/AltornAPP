appControllers.controller('PutawayListCtrl', [
    'ENV',
    '$scope',
    '$stateParams',
    '$state',
    '$timeout',
    '$ionicPopup',
    '$ionicLoading',
    '$cordovaBarcodeScanner',
    '$cordovaKeyboard',
    'ApiService',
    'PopupService',
    function (
        ENV,
        $scope,
        $stateParams,
        $state,
        $timeout,
        $ionicPopup,
        $ionicLoading,
        $cordovaBarcodeScanner,
        $cordovaKeyboard,
        ApiService,
        PopupService) {
        var popup = null;
        $scope.Rcbp1 = {};
        $scope.GrnNo = {};
        $scope.Imgr1s = [];
        $scope.Imgr2s = [];
        var confirm = function () {
            $ionicLoading.show();
            for (var i = 0; i < $scope.Imgr2s.length; i++) {
                var imgr2 = $scope.Imgr2s[i];
                var objUri = ApiService.Uri(true, '/api/wms/imgr2/putaway/update');
                objUri.addSearch('StoreNo', imgr2.StoreNo);
                objUri.addSearch('UserDefine1', imgr2.UserDefine1);
                objUri.addSearch('TrxNo', imgr2.TrxNo);
                objUri.addSearch('LineItemNo', imgr2.LineItemNo);
                objUri.addSearch('UserID', sessionStorage.getItem('UserId').toString());
                ApiService.Get(objUri, false).then(function success(result) {});
            }
            $ionicLoading.hide();
            PopupService.Info(popup, 'Confirm Success').then(function () {
                $scope.clearImgr();
                $scope.returnMain();
            });
        };
        $scope.refreshRcbp1 = function (BusinessPartyName) {
            if (is.not.undefined(BusinessPartyName) && is.not.empty(BusinessPartyName)) {
                var objUri = ApiService.Uri(true, '/api/wms/rcbp1');
                objUri.addSearch('BusinessPartyName', BusinessPartyName);
                ApiService.Get(objUri, false).then(function success(result) {
                    $scope.Rcbp1s = result.data.results;
                });
            } else {
                $scope.Imgr1s = [];
                $scope.Imgr2s = [];
            }
        };

        $scope.Change = function (ChangeValue) {
            if (ChangeValue !== '') {
                console.log(ChangeValue);
                console.log('11');
                $('#iGrNNo').focus();

            } else {
                console.log('dd');
            }
        };
        $scope.refreshGrnNos = function (Grn) {
            if (is.not.undefined(Grn) && is.not.empty(Grn)) {
                var objUri = ApiService.Uri(true, '/api/wms/imgr1');
                objUri.addSearch('StatusCode', 'USE');
                objUri.addSearch('GoodsReceiptNoteNo', Grn);
                ApiService.Get(objUri, false).then(function success(result) {
                    $scope.GrnNos = result.data.results;
                });
            } else {
                $scope.Imgr2s = [];
            }
        };
        $scope.showImgr1 = function (Customer) {
            if (is.not.undefined(Customer) && is.not.empty(Customer)) {
                var objUri = ApiService.Uri(true, '/api/wms/imgr1');
                objUri.addSearch('StatusCode', 'USE');
                objUri.addSearch('CustomerCode', Customer);
                ApiService.Get(objUri, true).then(function success(result) {
                    $scope.Imgr1s = result.data.results;
                });
            } else {
                $scope.Imgr1s = [];
                $scope.Imgr2s = [];
            }
            if (!ENV.fromWeb) {
                $cordovaKeyboard.close();
            }
        };
        $scope.showDate = function (utc) {
            return moment(utc).format('DD-MMM-YYYY');
        };
        $scope.showImgr2 = function (blnGrn, GoodsReceiptNoteNo) {
            if (is.not.undefined(GoodsReceiptNoteNo) && is.not.empty(GoodsReceiptNoteNo)) {
                var objUri = ApiService.Uri(true, '/api/wms/imgr2/putaway');
                objUri.addSearch('GoodsReceiptNoteNo', GoodsReceiptNoteNo);
                ApiService.Get(objUri, true).then(function success(result) {
                    if (!blnGrn) {
                        $scope.GrnNos = $scope.Imgr1s;
                        $scope.GrnNo.selected = $scope.GrnNos[0];
                    }
                    $scope.Imgr1s = [];
                    $scope.Imgr2s = result.data.results;
                });
            } else {
                $scope.Imgr2s = [];
            }
            if (!ENV.fromWeb) {
                $cordovaKeyboard.close();
            }
        };
        $scope.returnMain = function () {
            $state.go('index.main', {}, {
                reload: true
            });
        };
        $scope.clearImgr = function () {
            $scope.Imgr1s = [];
            $scope.Imgr2s = [];
        };
        $scope.openCam = function (imgr2, type) {
            if (!ENV.fromWeb) {
                if (is.equal(type, 'StoreNo')) {
                    $cordovaBarcodeScanner.scan().then(function (imageData) {
                        $scope.Imgr2s[imgr2.LineItemNo - 1].StoreNo = imageData.text;
                        $('#txt-storeno-' + imgr2.LineItemNo).select();
                    }, function (error) {
                        $cordovaToast.showShortBottom(error);
                    });
                } else {
                    $cordovaBarcodeScanner.scan().then(function (imageData) {
                      showScanCustBatchNo(imageData.text,imgr2);
                        $('#txt-UserDefine1-' + imgr2.LineItemNo).focus();
                    }, function (error) {
                        $cordovaToast.showShortBottom(error);
                    });
                }
            }
        };

        var showScanCustBatchNo = function (imageData,imgr2) {
          var ScanCustBatchNo='';
          if (imageData==='Y'){
                 ScanCustBatchNo =   $scope.Imgr2s[imgr2.LineItemNo - 1].UserDefine1;
          }else{
             ScanCustBatchNo =imageData;
          }
            if (is.not.empty(ScanCustBatchNo)) {
                var SplitScanCustBatchNo = ScanCustBatchNo.split('..');
                if (ScanCustBatchNo.indexOf('..') >= 0) {
                    if (SplitScanCustBatchNo.length > 0) {
                        $scope.Imgr2s[imgr2.LineItemNo - 1].UserDefine1 = SplitScanCustBatchNo[1];
                     $('#txt-UserDefine1-' + imgr2.LineItemNo).focus();
                    } else {
                        PopupService.Alert(popup, 'Wrong Batch No').then();
                        $('#txt-UserDefine1-' + imgr2.LineItemNo).focus();
                    }
                } else {
                    $scope.Imgr2s[imgr2.LineItemNo - 1].UserDefine1 = ScanCustBatchNo;
                  $('#txt-UserDefine1-' + imgr2.LineItemNo).focus();
                }
            }
        };

        $scope.enter = function (ev, type, Imgr2) {
            if (is.equal(ev.keyCode, 13)) {
                if (is.null(popup)) {
                    if (is.equal(type, 'ScanCustBatchNo')) {
                        showScanCustBatchNo('Y',Imgr2);
                    } else {

                    }
                } else {
                    popup.close();
                    popup = null;
                }
                if (!ENV.fromWeb) {
                    $cordovaKeyboard.close();
                }
            }
        };
        $scope.clearInput = function (imgr2, type) {
            if (is.equal(type, 'StoreNo')) {
                $scope.Imgr2s[imgr2.LineItemNo - 1].StoreNo = '';
            } else {
                $scope.Imgr2s[imgr2.LineItemNo - 1].UserDefine1 = '';
            }
        };
        $scope.checkConfirm = function () {
            $ionicLoading.show();
            var blnDiscrepancies = false;
            for (var i = 0; i < $scope.Imgr2s.length; i++) {
                var imgr2 = {
                    TrxNo: $scope.Imgr2s[i].TrxNo,
                    LineItemNo: $scope.Imgr2s[i].LineItemNo,
                    ProductCode: $scope.Imgr2s[i].ProductCode,
                    StoreNo: $scope.Imgr2s[i].StoreNo
                };
                if (is.empty(imgr2.StoreNo)) {
                    console.log('Product (' + imgr2.ProductCode + ') has no Store No to putaway');
                    blnDiscrepancies = true;
                }
            }
            if (blnDiscrepancies) {
                $ionicLoading.hide();
                PopupService.Alert(popup, 'Some Products Has Not Yet Putaway').then();
            } else {
                confirm();
            }
        };
    }
]);
