
var app = angular.module('customerApp', ['ui.bootstrap']);
app.controller('customerController', function ($scope, $http, $uibModal) {

    var $ctrl = this;
    
    $http.get("/Home/CustomerList")
    .then(function (response) {     
        $ctrl.personData = response.data;
    });
    
    $ctrl.delete = function (ppl) {
        debugger;
        var index = $ctrl.personData.indexOf(ppl)
        var customerIndex = $ctrl.personData[index].Id;
        var myModal = $uibModal.open({
            templateUrl: 'deleteCusModal.html',
            size: 'md',
            controller: 'DeletePersonCtrl',

            resolve: {
                personData: function () {
                    return $ctrl.personData[index]
                },
                
                name: function () {
                    return $ctrl.personData[index].Name
                }
               

        }
            })
        
        myModal.result.then(function () {
            debugger;

            $http({
                method: 'Post',
                url: '/Home/DeleteCustomer',
                data: { customerIndex: customerIndex },
            }).then(function (response) {
                debugger;

                //refresh the personData
                if (response.data.success) {
                    $ctrl.personData.splice(index, 1);
                }

                customerId = response;
            })
        });
    };//End delete()
       
        
    

    $ctrl.update = function (size, personData) {
        debugger;
       
        var index = $ctrl.personData.indexOf(personData)
        var myModal = $uibModal.open({
            templateUrl: 'modal.html',
            size: size,
            controller: 'ModalInstanceCtrl',
            controllerAs: '$ctrl',
            resolve: {
                personData: function () {
                    var tempvar = $ctrl.personData[index]

                    return tempvar;
                },
                personList: function () {
                    return $ctrl.personData
                }
            }
        });
        //to display the results
        myModal.result.then(function () {
            debugger;

            //if ok or cancel closed

            var Customer = {
                'Id': $ctrl.personData[index].Id,
                'Name': $ctrl.personData[index].Name,
                'Address1': $ctrl.personData[index].Address1,
                'Address2': $ctrl.personData[index].Address2,
                'Town_City': $ctrl.personData[index].Town_City
            };
            //var customerdata = JSON.stringify(Customer);
            $http({
                method:'Post',
                url: '/Home/UpdateCustomer',
                data: { customerData: Customer },
            }).then(function (response) {
                if (response.data.success) {
                    Customer = response;
                }
            })
        });
    };//End update()

    $ctrl.addPerson = function (size) {
        debugger;
        $scope.customerTitle = "Add a new Customer";
        var index = $ctrl.personData.length + 1;
        var myModal = $uibModal.open({
            templateUrl: 'modal.html',
            size: size,
            controller: 'AddPersonCtrl',
            controllerAs: '$ctrl',
            resolve: {
                personData: function() {
                    return $ctrl.personData;
                },
                personList: function () {
                    return $ctrl.personData
                }
            }
        });
        //to display the results
        myModal.result.then(function () {
            debugger;
            var Customer = {
                'Id':'',
                'Name': $ctrl.personData.Name,
                'Address1': $ctrl.personData.Address1,
                'Address2': $ctrl.personData.Address2,
                'Town_City': $ctrl.personData.Town_City
            };
            debugger;
            $ctrl.personData.push(Customer);
            var newCustomer = JSON.stringify(Customer);
            $http({
                method: 'Post',
                url: '/Home/AddCustomer',
                data: newCustomer,
            }).then(function (response) {
                if (response.data.success) {
                    newCustomer = response;
                    }; 
                })
            })     
        };//End addPerson()
        
        

});//End controller

angular.module('customerApp').controller('ModalInstanceCtrl', function ($uibModalInstance, personData, personList) {
    var $ctrl = this;
    debugger;
    $ctrl.personData = personData;
    $ctrl.personList = personList;
    $ctrl.customerTitle = "Edit Customer";
        
    $ctrl.selected = {
        x: $ctrl.personData[0]
    };
    $ctrl.save = function () {
        
        $uibModalInstance.close($ctrl.selected.x);
        
        //location.reload();

    };

    $ctrl.cancel = function () {
        debugger;
        $uibModalInstance.dismiss();
        location.reload();
    };

    
});

angular.module('customerApp').controller('AddPersonCtrl', function ($uibModalInstance, personData, personList) {
    var $ctrl = this;
    $ctrl.personData = personData;
    $ctrl.personList = personList;
    $ctrl.customerTitle = "Add Customer";
    debugger;
    $ctrl.inserted = {
       x: $ctrl.personData
    };
    
    $ctrl.save = function () {
        $uibModalInstance.close($ctrl.inserted.x);
        //location.reload();
    };

    $ctrl.cancel = function () {
        debugger;
        $uibModalInstance.dismiss();
       
    };
});

angular.module('customerApp').controller('DeletePersonCtrl', function ($uibModalInstance, personData,name, $scope) {
    var $ctrl = this;
    debugger;
    $scope.Title = "Person Delete Confirmation";
    $ctrl.personData = personData;
    $scope.name = name;
    $ctrl.deleted = {
        x: $ctrl.personData
    };
    $ctrl.save = function () {
        $uibModalInstance.close($ctrl.deleted.x);
        //location.reload();
    };

    $ctrl.cancel = function () {
        debugger;
        $uibModalInstance.dismiss();
        location.reload();
    };

});

app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);
