sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/core/BusyIndicator",
    "sap/ui/core/Fragment"
  ],
  function (Controller, MessageToast, BusyIndicator, formatter,Fragment) {
    "use strict";
    return Controller.extend("project1.controller.View1", {
      onInit: function () {
        var oStaticModel = this.getOwnerComponent().getModel("oStaticModel");
        oStaticModel.loadData("/model/staticData.json");// loadData will replace the complete content of Model's oData, LoaData is asynchronous
        oStaticModel.attachRequestCompleted(function (oEvent) {
          //  oStaticModel.setProperty("/tableData",[]);//setProperty will add one more property in the model's oData

        });
        this.oStaticModel = oStaticModel;
        var date = new Date();
        var oModel = new sap.ui.model.json.JSONModel();
        this.getView().setModel(oModel, "oModel");
        oModel.setProperty("/maxDate", date);
        oModel.setProperty("/selected", false);
        oModel.setProperty("/submitText", "Submit");







      },

      userdata: function () {
        var oStaticModel = this.oStaticModel
        var userDetail = this.oStaticModel.getProperty("/userDetail", []);
        var url = "/norvig/big.txt";
        //var url="https://jsonplaceholder.typicode.com/users"
        //var url="http://norvig.com/big.txt"
        var userData = new sap.ui.model.json.JSONModel();
        if (!userDetail) {
          userDetail = [];
        }
        userData.loadData(url, null, true, 'GET');
        this.userData = userData;
        userData.attachRequestCompleted(function (oEvent) {
          var data = oEvent.getSource().getData()
          //var data= userData.getData();
          oStaticModel.setProperty("/userDetail", data);
        })

      },



      formatterHeader: function (name) {
        return "Hi " + name
      },

      ageformatter: function (age) {
        var oTable = this.getView().byId("formTable");
        var oItems = oTable.getItems();
        var len = oItems.length - 1

        if (age < 10) {
          //oItems[0].getCells()[1].addStyleClass("ageFormatter");
          // oItems[len].getCells()[1]. addStyleClass("ageFormatter");
          for (var i = 0; i < 5; i++) {
            oItems[len].getCells()[i].addStyleClass("ageFormatter2")
          };
          return age;

        }
        else {
          for (var i = 0; i < 5; i++) {
            oItems[len].getCells()[i].addStyleClass("ageFormatter");
          }
          return age
        };
      },
      nameFunc: function () {
        var oModel = this.getView().getModel("oModel"); 
        var Name = oModel.getProperty("/name");
        var Characters = /[@#$%^&*()+=-]/;
        if (Name.match(Characters)) {


          sap.m.MessageToast.show("Special characters not allowed in Name Value");
          oModel.setProperty("/nameState", "Error");
          oModel.setProperty("/name", "");
        }
        else if (Name.match(/[0-9]/)) {
          sap.m.MessageToast.show("Numbers are not allowed");
          oModel.setProperty("/nameState", "Error");
          oModel.setProperty("/name", "");
        }
        else {
          oModel.setProperty("/nameState", "None");
        }
      },

      colchange: function () {

        var a = this.getView().byId("Umar").getValue();
        if (a < 18) {
          this.getView().byId("Umar").addStyleClass("aditya");
        }

      },
      emailFunc: function () {

        var oModel = this.getView().getModel("oModel");
        var Email = oModel.getProperty("/email");

        var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailReg.test(Email)) {
          sap.m.MessageToast.show("Enter Valid E-mail");
          oModel.setProperty("/emailState", "Error");
          oModel.setProperty("/email", "");

        }
        else {
          oModel.setProperty("/emailState", "None")
        }

      },
      ageFunc: function () {
        var oModel = this.getView().getModel("oModel");
        var Age = oModel.getProperty("/age")
        if (Age > 200) {
          sap.m.MessageToast.show("Enter Valid Age");
          oModel.setProperty("/ageState", "Error");
          oModel.setProperty("/age", "");


        }
        else {
          oModel.setProperty("/ageState", "None");
        }
      },

      submitFunc: function () {
        var view = this.getView()
        this.getView().byId("submit").addStyleClass("submitButton2");

        setTimeout(function () {
          view.byId("submit").removeStyleClass("submitButton2");
        }, 1000)

        var tableData = this.oStaticModel.getProperty("/tableData");
        if (!tableData) {
          tableData = [];
        }
        var oModel = this.getView().getModel("oModel");
        var data = oModel.getData()
        var selectedIndex = oModel.getProperty("/graduate")

        if (selectedIndex == false) {
          sap.m.MessageToast("please select graduate status")
        }

        var manFields = ["/name", "/age", "/degree", "/email", "/DOB",];
        var value, count = 0;
        manFields.forEach(function (item) {
          value = oModel.getProperty(item);
          if (!value) {
            count += 1;
            oModel.setProperty(item + "State", "Error");
          } else {
            oModel.setProperty(item + "State", "Success");
          }
        });
        if (count) {
          sap.m.MessageToast.show("Please Fill All Mandatory Fields");
        } else {

          oModel.setProperty("/submitText","Submitted");
          setTimeout(function () {
            oModel.setProperty("/submitText","Submit");
          }, 1000)
          var tableObj = jQuery.extend(true, {}, data);
          tableData.push(tableObj);


          ////post  method in JSON
          // var userData=new sap.ui.model.json.JSONModel();

          // userData.loadData(url,null,true,'POST');
          // userData=oModel



          this.oStaticModel.setProperty("/tableData", tableData);
         // console.log(tableData);
          sap.m.MessageToast.show("Data Submitted Successfully");
          manFields.forEach(function (item) {
            oModel.setProperty(item, "");
          })
          manFields.forEach(function (item) {
            oModel.setProperty(item + "State", "None");
          })

        }

      },


      deleteFunc: function (oEvent) {

        var path = oEvent.getSource().getBindingContext("oStaticModel").getPath();
        var popData = path.split("/");
        this.getView().getModel("oStaticModel").oData[popData[1]].splice(popData[2], 1);
        sap.m.MessageToast.show("Deleted successfully");
        this.getView().getModel("oStaticModel").refresh(true);
      },
      editFunc: function (oEvent) {
       

        //// fragment function started here
        if (!this.tableFragment){
          this.tableFragment = new sap.ui.xmlfragment("project1.fragment.table", this);
          this.getView().addDependent(this.tableFragment);
        }
        this.tableFragment.open();
      

      


      },
      selectDelete: function (oEvent) {
        var Otable = this.byId("formTable").getSelectedItems()
        console.log("oTable", Otable.length)
        var oModel = this.getView().getModel("oModel");



        for (var i = Otable.length - 1; i >= 0; i--) {
          var path = Otable[i].getBindingContext("oStaticModel").getPath();
          var popData = path.split("/");
          this.getView().getModel("oStaticModel").oData[popData[1]].splice(popData[2], 1);
          this.getView().getModel("oStaticModel").refresh(true);
        }
        Otable.removeSelections();

      },
      fragmentFunc:function(oEvent){
        var path = oEvent.getSource().getBindingContext("oStaticModel").getPath();
      var popData = path.split("/");
      var editUser=oStaticModel.setProperty("/editUser",popData[2]);
        
        if (!this.tableFragment){
         
          this.tableFragment = new sap.ui.xmlfragment("project1.fragment.table", this);
          this.getView().addDependent(this.tableFragment);
        }
        this.tableFragment.open();
      },
      closeTableFragment:function(){
        this.tableFragment.close();
      }
    });
  }
);
