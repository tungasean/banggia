agGrid.initialiseAgGridWithAngular1(angular);
var module = angular.module('BangGia', ['agGrid']); // khai báo Application Module sử dụng chức năng module hóa của Angular JS

//load từ json
var value = new Array();
var xml = new XMLHttpRequest();
xml.open("GET", "./DuLieu.json", false);
xml.send(null);
var json = JSON.parse(xml.responseText);

//copy dữ liệu gốc sang mảng phụ thứ nhất
for (var i = 0; i < json.length; i++) {
    value[i] = new Array();               // tạo mảng 1 chiều để lưu dữ liệu theo hàng
    for (var n in json[i]) {
        value[i][n] = json[i][n];     // tạo mảng 1 chiều để lưu dữ liệu theo ô
    }
}

//Dùng mảng phụ thứ 2 để lưu dũ liệu khi chạy web
var valueRun = new Array();
var numValue = value.length;
for (var i = 0; i < value.length; i++) {
    valueRun[i] = new Array();
    valueRun[i]['sell'] = value[i]['sell'];
    valueRun[i]['buy'] = value[i]['buy'];
    valueRun[i]['currency'] = value[i]['currency'];
    valueRun[i]['max'] = value[i]['buy'];
    valueRun[i]['min'] = value[i]['sell'];
    valueRun[i]['isChange'] = 0;
    valueRun[i]['wasChange'] = 0;
	valueRun[i]['sell_']=0;
	valueRun[i]['buy_']=0;
}



// sử dụng Angular js để hiển thị bảng giá giao dịch
module.controller('BangGiaCtrl', function ($scope, $http) {
    var count = 0;

    var columnDefs = [

        {
            headerName: 'Currency'
            , field: 'currency'
            , headerCellTemplate: '<div style="text-align:center; font-weight:Bold;border:none;">Currency</div>'
            , cellStyle: function () {
                return {
                    'font-weight': 'bold'
                    , 'color': '#0000AA'
                };
            }
            , width: 100
            , cellClass: 'general'
		},

        {
            headerName: 'Sell'
            , field: 'sell'
            , headerCellTemplate: '<div style=" text-align:center; font-weight:Bold;border:none;">Sell</div>'
            , width: 100
            , valueGetter: valueSell
            , cellClass: 'general'
		},

        {
            headerName: 'Buy'
            , field: 'buy'
            , headerCellTemplate: '<div style="text-align:center; font-weight:Bold;border:none;">Buy</div>'
            , width: 100
            , valueGetter: valueBuy
            , cellClass: 'general'
		},

        {
            headerName: ''
            , field: 'icon'
            , headerCellTemplate: '<div style=" text-align:center; font-weight:Bold;border:none;"></div>'
            , valueGetter: valueIcon
            , cellClass: 'general'
            , width: 40
		},

        {
            headerName: 'Change'
            , field: 'change'
            , headerCellTemplate: '<div style=" text-align:center; font-weight:Bold;border:none;">Change</div>'
            , width: 100
            , valueGetter: valueChange
            , cellClass: 'general'
		},

        {
            headerName: 'High'
            , field: 'high'
            , headerCellTemplate: '<div style=" text-align:center; font-weight:Bold;border:none;">High</div>'
            , width: 100
            , valueGetter: valueMax
            , cellClass: 'general'
		},

        {
            headerName: 'Low' 
            , field: 'low'   
            , headerCellTemplate: '<div style=" text-align:center; font-weight:Bold;border:none;">Low</div>' //
            , width: 100
            , valueGetter: valueMin
            , cellClass: 'general'
		}

	];


    //lặp lại sau một khoảng thời gian
    var updatedNode = new Array(); //những hàng được thay đổi trong lần mới
    var updatedNoded = new Array(); //những hàng đã được thay đổi trong lần cũ
    var timeDelay = 3000
        , startTime = 0;
    setInterval(function () {
		// lấy thời điểm thời gian hiện tại
        startTime = new Date().getTime(); 

        count = 0;
        while (count < numValue) {
            createSell();
            count++;
        }

        count = 0;
        updatedNode = [];
        updatedNoded = [];
        $scope.gridOptions.api.forEachNode(function (node) {

            if (valueRun[count]['isChange'] != 0) {
                updatedNode.push(node);
                $scope.gridOptions.api.refreshCells(updatedNode, ['sell']);
                $scope.gridOptions.api.refreshCells(updatedNode, ['buy']);
                $scope.gridOptions.api.refreshCells(updatedNode, ['icon']);
                $scope.gridOptions.api.refreshCells(updatedNode, ['change']);
                $scope.gridOptions.api.refreshCells(updatedNode, ['high']);
                $scope.gridOptions.api.refreshCells(updatedNode, ['low']);
                updatedNode = [];
            } else {
                if (valueRun[count]['wasChange'] !=0) {
                    updatedNoded.push(node);
                    $scope.gridOptions.api.refreshCells(updatedNoded, ['sell']);
                    $scope.gridOptions.api.refreshCells(updatedNoded, ['buy']);
                    $scope.gridOptions.api.refreshCells(updatedNoded, ['icon']);
                    updatedNoded = [];
                }
            }
            count++;

        });
		//thời gian timeDelay= timeDelay -(thời điểm chạy xong - thời điểm bắt đầu chạy)
        timeDelay = timeDelay - (new Date().getTime() - startTime); 

    }, timeDelay);


    // thay đổi ngẫu nhiên giá trị sell và buy
    var change = media = isSell = wasSell= isBuy = a=0;
    function createSell() {

        valueRun[count]['wasChange'] = valueRun[count]['isChange'];

        // mỗi hàng chỉ có 50% được thay đổi ngẫu nhiên
        if (Math.floor((Math.random()*2) + 0) != 0) {

            
			valueRun[count]['isChange'] = 0;
			return;

        } else {
			wasSell=valueRun[count]['sell']; // lưu giá trị sell cũ của hàng
			//tạo 2 biến để random sell và buy
            isSell= Math.random() * 5;  
			isBuy=Math.random()*5;
			
			a=value[count]['center']; // lấy giá trị được cố định là center
			// tính toán giá trị mới buy và sell
			valueRun[count]['sell_']=a + a*isSell/100 + a*isBuy/100;
			valueRun[count]['buy_']=a + a*isBuy/100;
			// lưu giá trị % cho ô change
            valueRun[count]['isChange'] = (valueRun[count]['sell_'] - wasSell)/wasSell*100;
        }

    }

    // lưu giá trị sell mới vào hàng 
    var countIndex = 0;
    function valueSell(params) {

        //kiểm tra hàng nào được thay đổi giá trị
        for (var i = 0; i < valueRun.length; i++) 
		{

            if (valueRun[i]['currency'] == params.data.currency) 
			{
                {
                    countIndex = i;
                    break;
                }
            }

        }

        // Hàng không được thay đổi thì giữ nguyên giá trị cũ của sell
        if (valueRun[countIndex]['isChange'] == 0) {
            return '<button type="button" class="btn btn-default buttonUser">' + valueRun[countIndex]['sell'] + '</button>';
        }
        //lưu giá trị sell mới ở trên vào ô sell của hàng được thay dổi
		media=valueRun[countIndex]['sell_'].toFixed(params.data.extra);
        valueRun[countIndex]['sell'] =media ;
        // kiểm tra giá trị max
        if (valueRun[countIndex]['max'] < media) {
            valueRun[countIndex]['max'] = media;
        }
		//nếu giá trị sell tăng lên thì chuyển màu xanh, giảm xuống thì màu đỏ
        if (valueRun[countIndex]['isChange'] > 0)
            return '<button type="button" class="btn btn-default buttonUser up buttonUpDown">' + media + '</button>';
        else if (valueRun[countIndex]['isChange'] < 0)
            return '<button type="button" class="btn btn-default buttonUser down buttonUpDown">' + media + '</button>';

    }

    // lưu giá trị buy mới vào hàng 
    function valueBuy(params) {

        // Hàng không được thay đổi thì giữ nguyên giá trị cũ của buy
        if (valueRun[countIndex]['isChange'] == 0) {
            return '<button type="button" class="btn btn-default buttonUser">' + valueRun[countIndex]['buy'] + '</button>';
        }
        //lưu giá trị buy mới ở trên vào ô buy của hàng được thay dổi
		media=valueRun[countIndex]['buy_'].toFixed(params.data.extra);
        valueRun[countIndex]['buy'] = media;

        // kiểm tra giá trị min
        if (valueRun[countIndex]['min'] > media) {
            valueRun[countIndex]['min'] = media;
        }
		//nếu giá trị buy tăng lên thì chuyển màu xanh, giảm xuống thì màu đỏ
        if (valueRun[countIndex]['isChange'] > 0) 
            return '<button type="button" class="btn btn-default buttonUser up buttonUpDown">' + media + '</button>';
        else if (valueRun[countIndex]['isChange'] < 0)
            return '<button type="button" class="btn btn-default buttonUser down buttonUpDown">' + media + '</button>';
    }

    // trả về giá trị change vào hàng được thay đổi
    function valueChange() {
        return valueRun[countIndex]['isChange'].toFixed(2) + '%';
    }

    //trả về giá trị max
    function valueMax() {
        return valueRun[countIndex]['max'];
    }

    //trả về giá trị min
    function valueMin() {
        return valueRun[countIndex]['min'];
    }

    //trả về kiểu icon và màu sắc icon
    function valueIcon() {
		//nếu giá trị change tăng
        if (valueRun[countIndex]['isChange'] > 0)
            return '<i class="glyphicon glyphicon-triangle-top up"></i>';
		//nếu giá trị change giảm
        else if (valueRun[countIndex]['isChange'] <0) 
            return '<i class="glyphicon glyphicon-triangle-bottom down"></i>';
		//nếu giá trị change không đổi
        else 
            return '';

    }

    $scope.gridOptions = {

        angularCompileRows: true
        , columnDefs: columnDefs
        , rowData: null
        , enableColResize: true
        , getRowHeight: function () {
            return 45;
        }

    };

    $http.get('./DuLieu.json').then(function (res) {

        $scope.gridOptions.api.setRowData(res.data);
        $scope.gridOptions.api.sizeColumnsToFit();

    });

});