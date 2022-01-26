import Web3 from "web3";
import SupplyChain from "../build/contracts/SupplyChain.json";
import $ from 'jquery';
import './style.css';

const App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originFarmerID: "0x0000000000000000000000000000000000000000",
    originFarmName: null,
    originFarmInformation: null,
    originFarmLatitude: null,
    originFarmLongitude: null,
    productNotes: null,
    productPrice: 0,
    distributorID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        App.sku = $("#sku").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.originFarmerID = $("#originFarmerID").val();
        App.originFarmName = $("#originFarmName").val();
        App.originFarmInformation = $("#originFarmInformation").val();
        App.originFarmLatitude = $("#originFarmLatitude").val();
        App.originFarmLongitude = $("#originFarmLongitude").val();
        App.productNotes = $("#productNotes").val();
        App.productPrice = $("#productPrice").val();
        App.distributorID = $("#distributorID").val();
        App.retailerID = $("#retailerID").val();
        App.consumerID = $("#consumerID").val();

        console.log(
            App.sku,
            App.upc,
            App.ownerID, 
            App.originFarmerID, 
            App.originFarmName, 
            App.originFarmInformation, 
            App.originFarmLatitude, 
            App.originFarmLongitude, 
            App.productNotes, 
            App.productPrice, 
            App.distributorID, 
            App.retailerID, 
            App.consumerID
        );
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            // use MetaMask's provider
            App.web3 = new Web3(window.ethereum);
            await window.ethereum.enable(); // get permission to access accounts
        } else {
            console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",);
            // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
            App.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"),);
        }
        

        await App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: async function () {
        App.networkID = await App.web3.eth.net.getId();
        App.metamaskAccountID = (await App.web3.eth.getAccounts())[0];
    },

    initSupplyChain: function () {
        const deployedNetwork = SupplyChain.networks[App.networkID];

        App.contracts.SupplyChain = new App.web3.eth.Contract(
            SupplyChain.abi,
            deployedNetwork.address,
        );

        App.fetchEvents();
        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 1:
                return await App.harvestItem(event);
                break;
            case 2:
                return await App.processItem(event);
                break;
            case 3:
                return await App.packItem(event);
                break;
            case 4:
                return await App.sellItem(event);
                break;
            case 5:
                return await App.buyItem(event);
                break;
            case 6:
                return await App.shipItem(event);
                break;
            case 7:
                return await App.receiveItem(event);
                break;
            case 8:
                return await App.purchaseItem(event);
                break;
            case 9:
                return await App.fetchItemBufferOne(event);
                break;
            case 10:
                return await App.fetchItemBufferTwo(event);
                break;
            }
    },

    harvestItem: function(event) {
        event.preventDefault();

        const result = App.contracts.SupplyChain.methods.harvestItem(
            App.upc, 
            App.metamaskAccountID, 
            App.originFarmName, 
            App.originFarmInformation, 
            App.originFarmLatitude, 
            App.originFarmLongitude, 
            App.productNotes
        ).send({from: App.metamaskAccountID});
        $("#ftc-item").text(result);
        console.log('harvestItem',result);
    },

    processItem: async function (event) {
        event.preventDefault();
        try {
            const result = await App.contracts.SupplyChain.methods.processItem(App.upc).send({from: App.metamaskAccountID});
            $("#ftc-item").text(result);
            console.log('processItem',result);
        } catch (err) {
            console.log(err.message);
        }
    },
    
    packItem: async function (event) {
        event.preventDefault();
        try {
            const result = await App.contracts.SupplyChain.methods.packItem(App.upc).send({from: App.metamaskAccountID});
            $("#ftc-item").text(result);
            console.log('packItem',result);
        } catch (err) {
            console.log(err.message);
        }
    },

    sellItem: async function (event) {
        event.preventDefault();
        try {
            const productPrice = App.web3.utils.toWei('1', "ether");
            console.log('productPrice',productPrice);
            const result = await App.contracts.SupplyChain.methods.sellItem(App.upc, App.productPrice).send({from: App.metamaskAccountID});
            $("#ftc-item").text(result);
            console.log('sellItem',result);
        } catch (err) {
            console.log(err.message);
        }
    },

    buyItem: async function (event) {
        event.preventDefault();
        try {
            const walletValue = App.web3.utils.toWei('3', "ether");
            const result = await App.contracts.SupplyChain.methods.buyItem(App.upc).send({from: App.metamaskAccountID, value: walletValue});
            $("#ftc-item").text(result);
            console.log('buyItem',result);
        } catch (err) {
            console.log(err.message);
        }
    },

    shipItem: async function (event) {
        event.preventDefault();

        try {
            const result = await App.contracts.SupplyChain.methods.shipItem(App.upc).send({from: App.metamaskAccountID});
            $("#ftc-item").text(result);
            console.log('shipItem',result);
        } catch (err) {
            console.log(err.message);
        }
    },

    receiveItem: async function (event) {
        event.preventDefault();
        try {
            const result = await App.contracts.SupplyChain.methods.receiveItem(App.upc).send({from: App.metamaskAccountID});
            $("#ftc-item").text(result);
            console.log('receiveItem',result);
        } catch (err) {
            console.log(err.message);
        }
    },

    purchaseItem: async function (event) {
        event.preventDefault();

        try {
            const result = await App.contracts.SupplyChain.methods.purchaseItem(App.upc).send({from: App.metamaskAccountID});
            $("#ftc-item").text(result);
            console.log('purchaseItem',result);
        } catch (err) {
            console.log(err.message);
        }
    },

    fetchItemBufferOne: async function () {
        App.upc = $('#upc').val();
        console.log('upc',App.upc);

       const result =  await App.contracts.SupplyChain.methods.fetchItemBufferOne(App.upc).call();
        $("#ftc-item").text(result);
        console.log('fetchItemBufferOne', result);
    },

    fetchItemBufferTwo: async function () {
       const result =  await App.contracts.SupplyChain.methods.fetchItemBufferTwo(App.upc).call();
          $("#ftc-item").text(result);
          console.log('fetchItemBufferTwo', result);
    },

    fetchEvents: function () {
        App.contracts.SupplyChain.events.allEvents(function(err, log) {
            if(err) { 
                console.log(err.message); 
                return; 
            }

            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
    }
};

window.App = App;

App.init();
