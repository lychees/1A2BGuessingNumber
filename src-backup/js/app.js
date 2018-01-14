App = {
    web3Provider: null,
    contracts: {},

    init: function() {
        // Load pets.
        $.getJSON('../pets.json', function(data) {
            var petsRow = $('#petsRow');
            var petTemplate = $('#petTemplate');
            for (i = 0; i < data.length; i ++) {
                petTemplate.find('.panel-title').text(data[i].name);
                petTemplate.find('img').attr('src', data[i].picture);
                petTemplate.find('.pet-breed').text(data[i].breed);
                petTemplate.find('.pet-age').text(data[i].age);
                petTemplate.find('.pet-location').text(data[i].location);
                petTemplate.find('.btn-adopt').attr('data-id', data[i].id);
                petsRow.append(petTemplate.html());
            }
        });
        return App.initWeb3();
    },

    initWeb3: function() {
        // Is there an injected web3 instance?
        if (typeof web3 !== 'undefined') {
            App.web3Provider = web3.currentProvider;
        } else {
            // If no injected web3 instance is detected, fall back to Ganache
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);
        return App.initContract();
    },

  initContract: function() {
    $.getJSON('guessnumber.json', function(data) {
        // Get the necessary contract artifact file and instantiate it with truffle-contract
        var AdoptionArtifact = data;
        App.contracts.Guessnumber = TruffleContract(AdoptionArtifact);

        // Set the provider for our contract
        App.contracts.Guessnumber.setProvider(App.web3Provider);

        // Use our contract to retrieve and mark the adopted pets
        return App.markAdopted();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-submit', App.handleSubmit);
  },

  markAdopted: function() {
      console.log('markAdopted');
      App.contracts.Guessnumber.deployed().then(function(instance) {
          GuessnumberInstance = instance;
          console.log("Contract Address:", GuessnumberInstance.address);
          // How do I call web3.eth.getBalance() in metamask?
          // https://github.com/MetaMask/faq/issues/23
          web3.eth.getBalance(GuessnumberInstance.address, 'latest', function(error, balance){
              console.log(balance);
              $("#balance")[0].value = balance;
          });
      }).then(function(balance) {
      }).catch(function(err) {
          console.log(err.message);
      });
  },

  handleSubmit: function(event) {
      event.preventDefault();
      var ans = $("#Text1")[0].value;
      var GuessnumberInstance;
      web3.eth.getAccounts(function(error, accounts) {
          if (error) {
              console.log(error);
          }
          var account = accounts[0];
          App.contracts.Guessnumber.deployed().then(function(instance) {
              GuessnumberInstance = instance;
              return GuessnumberInstance.guess(ans, {
                  from: account,
                  value: 10000000000000000, //0.01 ETH
              });
          }).then(function(result) {
              console.log(result);
              return App.markAdopted();
          }).catch(function(err) {
              console.log(err.message);
          });
      });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
