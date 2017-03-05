var odApp = angular.module('orderApp', ['ngAnimate', 'ngSanitize','ui.bootstrap']);
odApp.controller('orderController', function ($scope, $http, $uibModal) {

    $http.get("/Home/OrderList")
    .then(function (response) {
        $scope.orderData = response.data;
        for (var i = 0; i < $scope.orderData.length; i++) {
            var date = $scope.orderData[i].Date;
            $scope.orderData[i].Date = new Date(parseInt(date.substr(6)));
        }
    });

    
    $scope.delete = function (ppl) {
        debugger;
        var index = $scope.orderData.indexOf(ppl)
        var orderId = $scope.orderData[index].OrderId;
        var myModal = $uibModal.open({
            templateUrl: 'deleteModal.html',
            size: 'sm',
            controller: 'DeleteOrderController',
            resolve: {
                orderData: function () {
                    return $scope.orderData[index];
                }
            }
        });
        myModal.result.then(function () {
            //var orderId = $scope.orderData[index].OrderId;
            //var Order = {
            //    'OrderId': $scope.orderData[index].OrderId,
            //    'ProductName': $scope.orderData[index].ProductName,
            //    'Price': $scope.orderData[index].Price,
            //    'Date': $scope.orderDate[index].Date,
            //    'PersonName': $scope.orderData[index].PersonName,
            //    'PersonId': $scope.orderData[index].PersonId,
            //    'ProductId': $scope.orderData[index].ProductId
            //};
            
            debugger;
            $http({
                method: 'Post',
                url: '/Home/DeleteOrder',
                data: { id: orderId },
            }).then(function (response) {

                //refresh the orderData
                if (response.data.success) {
                    $scope.orderData.splice(index, 1);


                }

                orderId = response;
            })

            
        });

        
    };//End delete()

    $scope.edit = function (odData) {
        var index = $scope.orderData.indexOf(odData)
        debugger;
        var myModal = $uibModal.open({
            templateUrl: 'orderModal.html',
            size: 'lg',
            controller: 'EditOrderController',
            resolve: {
                orderData: function () {
                    return $scope.orderData[index];
                },
                index: function () {
                    return index;
                },
                orderList: function () {
                    return $scope.orderData
                }
            }
        });
        //to display the results
        myModal.result.then(function () {
            debugger;
            $scope.orderData[index].ProductName=$scope.product;
            var Order = {
                'OrderId': $scope.orderData[index].OrderId,
                'ProductName': $scope.orderData[index].ProductName,
                'Price': $scope.orderData[index].Price,
                'Date': $scope.orderDate[index].Date,
                'PersonName': $scope.orderData[index].PersonName,
                'PersonId': $scope.orderData[index].PersonId,
                'ProductId': $scope.orderData[index].ProductId
            };
            debugger;
            var orderData = JSON.stringify(Order);
            $http({
                method: 'Post',
                url: '/Home/EditOrder',
                data: { orderData: Order },ProductName
            }).then(function (response) {
                if (response.data.success) {
                    Order = response;
                }
            })
        });
    };//End edit()

    $scope.add = function () {
        debugger;
        var index = $scope.orderData.length + 1;
        var myModal = $uibModal.open({
            templateUrl: 'orderModal.html',
            size: 'lg',
            controller: 'AddOrderController',
            resolve: {
                orderData: function () {
                    return $scope.orderData;
                },
                orderList: function () {
                    return $scope.orderData;
                }
            }
        });
        //to display the results
        myModal.result.then(function () {
            debugger;

            //if ok or cancel closed

            var Order = {
                'OrderId': '',
                'ProductName': $scope.orderData.ProductName,
                'Price': $scope.orderData.Price,
                'Date': $scope.orderData.Date,
                'PersonName': $scope.orderData.PersonName,
                'PersonId': $scope.orderData.PersonId,
                'ProductId': $scope.orderData.ProductId
            };
            $scope.orderData.push(Order);
            var orderdata = JSON.stringify(Order);
            $http({
                method: 'Post',
                url: '/Home/AddOrder',
                data: { orderData: Order },
            }).then(function (response) {
                if (response.data.success) {
                   Order = response;
                }
            })
        });
    };//End add()


    

});//End controller

odApp.controller('EditOrderController', function ($uibModalInstance, orderData, $scope, orderList) {
    debugger;
    $scope.Title = "Edit Order";
    
    $scope.orderList = orderList;
    $scope.orderData = orderData;
    
    $scope.selected = {
        x: orderData[0]
    };
   
    $scope.save = function () {
        $uibModalInstance.close($scope.selected.x);
        //location.reload();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss();
        //location.reload();
    };
});

odApp.controller('AddOrderController', function ($uibModalInstance, orderData, $scope, orderList) {
    debugger;
    $scope.Title = "Add a New Order";
    $scope.orderData = orderData;
    $scope.orderList = orderList;
    $scope.inserted = {
        x: orderData
    };
    $scope.save = function () {
        $uibModalInstance.close($scope.inserted.x);
        //location.reload();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss();
        location.reload();
    };
});

odApp.controller('DeleteOrderController', function ($uibModalInstance, orderData, $scope) {
    debugger;
    $scope.orderData = orderData;

    $scope.deleted = {
        x: orderData
    };
    $scope.save = function () {
        debugger;
        $uibModalInstance.close($scope.deleted.x);
        //location.reload();
    };
    $scope.cancel = function () {
        debugger;
        $uibModalInstance.dismiss();
        location.reload();
    };
});