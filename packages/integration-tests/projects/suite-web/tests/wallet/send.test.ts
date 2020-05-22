// const validBech32Addr = 'bc1q5f2lvs7t29wv8nwssse6a4f6099sc3nagchqyc';

const account = {
  "deviceState": "mvbu1Gdy8SUjTenqerxUaZyYjmveZvt33q@355C817510C0EABF2F147145:undefined",
  "index": 2,
  "path": "m/49'/0'/0'",
  "descriptor": "ypub6X3zZL7MrQTh9xJT8k85eTqN4ejhycmry8etrsZVszWwEPMFiPY2rjA7oqqMEC45nE6FXfaKXo56Sd5tuFZmU2EZY6Ns6igHCivL7Wo727V",
  "accountType": "segwit",
  "symbol": "btc",
  "empty": false,
  "visible": true,
  "balance": "500001",
  "availableBalance": "497997",
  "formattedBalance": "0.00500001",
  "tokens": [],
  "addresses": {
    "change": [
      {
        "address": "38c7MWgUYDpoj9jM1LXhBDXoTTgB9qXNCP",
        "path": "m/49'/0'/0'/1/0",
        "transfers": 0
      },
    ],
    "used": [
      {
        "address": "3FJFWzgkqZjREN5HDWqLTU6eMtz9GzN5v7",
        "path": "m/49'/0'/0'/0/0",
        "transfers": 1,
        "balance": "500001",
        "sent": "0",
        "received": "500001"
      }
    ],
    "unused": []
  },
  "utxo": [
    {
      "txid": "a5454cad3bafe8cb385004fa11c0db80de8663023c18a745b45b893cf366eab9",
      "vout": 1,
      "amount": "436031",
      "address": "38c7MWgUYDpoj9jM1LXhBDXoTTgB9qXNCP",
      "path": "m/49'/0'/0'/1/0",
      "confirmations": 0
    },
    {
      "txid": "7811d59767fe6c5258db4771cc808fc6b67db1a464f97fc5b4b61885662a56b2",
      "vout": 0,
      "amount": "10333",
      "address": "3H9fG3BVUMc9WDzVHoAgfkJjFjds3a7Y6j",
      "path": "m/49'/0'/0'/0/3",
      "confirmations": 0
    },
    {
      "txid": "edf716436c52db594046b61d7716af274007147b800f593cba9b923140e997ea",
      "vout": 0,
      "amount": "10322",
      "address": "3LGLP8MBDCfmtF46D1DzNYKKdWDxzoRMxq",
      "path": "m/49'/0'/0'/0/2",
      "confirmations": 0
    },
    {
      "txid": "a5454cad3bafe8cb385004fa11c0db80de8663023c18a745b45b893cf366eab9",
      "vout": 0,
      "amount": "10614",
      "address": "3LGLP8MBDCfmtF46D1DzNYKKdWDxzoRMxq",
      "path": "m/49'/0'/0'/0/2",
      "confirmations": 0
    },
    {
      "txid": "f154d8fa4684ce2ebc787c1f648136a3795fd20eed630710a6179ea5e26416d3",
      "vout": 0,
      "amount": "10214",
      "address": "33h2RRNv2Jhgv8zjNfnpRXhYpE7mowPwca",
      "path": "m/49'/0'/0'/0/1",
      "confirmations": 0
    },
    {
      "txid": "e03cadcb4e4ae8e3c2b039935e7deeb7856846e7a9612ea658c6a9d883572137",
      "vout": 0,
      "amount": "10235",
      "address": "33h2RRNv2Jhgv8zjNfnpRXhYpE7mowPwca",
      "path": "m/49'/0'/0'/0/1",
      "confirmations": 0
    },
    {
      "txid": "fa87d22cbe38df6dd30c0a72ad14185344a71a877a160b6254d6c656e0a8fde8",
      "vout": 0,
      "amount": "10248",
      "address": "33h2RRNv2Jhgv8zjNfnpRXhYpE7mowPwca",
      "path": "m/49'/0'/0'/0/1",
      "confirmations": 0
    }
  ],
  "history": {
    "total": 1,
    "unconfirmed": 6
  },
  "networkType": "bitcoin",
  "page": {
    "index": 1,
    "size": 25,
    "total": 1
  }
};

describe('Send form', () => {
    beforeEach(() => {
        cy.viewport(1024, 768).resetDb();
        cy.task('startEmu', { wipe: true });
        cy.task('setupEmu');
        cy.visit('/wallet/send#/btc/2/segwit');
        cy.passThroughInitialRun();
        // feed account with real utxo
        cy
        .window()
        .its('store')
        .invoke('dispatch', {
            type: '@account/create',
            payload: account,
        });

        // wait until discovery is completed
        cy.window().its('store').invoke('getState').should((store) => {
            expect(store.wallet.discovery[0].status).to.equal(4);
        })
        
        // fake finish discovery (there is one added account extra causes discovery to appear uninished otherwise)
        cy
        .window()
        .its('store')
        .invoke('dispatch', {
            type: '@discovery/complete',
            payload: {},
        });
    });

    // todo: maybe bug in sendmax - typing into input causes send max not enough funds?
    it.skip('send max', () => {
        // cy.getTestElement('@send/output-0/address-input').type('a');
        cy.getTestElement('@send/output-0/send-max-button').click();
        cy.getTestElement('@send/output-0/amount-input').should('have.value', '0.00360197');
        cy.getTestElement('@send/advanced-toggle').click();
        cy.getTestElement('@send/fee-select/input').click();
        cy.getTestElement('@send/fee-select/option/low').click();
    });

    // todo: maybe bug in changing fiat, crypto value is 0.00000001, changing fiat changes it to 1e-7
    it.skip('fiat recalculation', () => {
        cy.getTestElement('@send/output-0/address-input').type('a');
        cy.getTestElement('@send/output-0/amount-input').type('0.00000001');
        cy.getTestElement('@send/fiat-select/input').click();
        cy.getTestElement('@send/fiat-select/option/CZK').click({ force: true });
    });

    it('clear form', () => {
      cy.getTestElement('@send/output-0/send-max-button').click();
      cy.getTestElement('@send/output-0/amount-input').should('have.value', '0.00360197');
      
      cy.getTestElement('@send/add-select/input').click();
      cy.getTestElement('@send/add-select/option/RECIPIENT').click();
      
      cy.getTestElement('@send/add-select/input').click();
      cy.getTestElement('@send/add-select/option/RECIPIENT').click();
      
      cy.getTestElement('@send/output-1/amount-input').should('have.value', '');
      cy.getTestElement('@send/output-2/amount-input').should('have.value', '');

      cy.getTestElement('@send/output-2/clear-button').click();
      cy.getTestElement('@send/output-2/amount-input').should('not.exist');

      cy.getTestElement('@send/clear-all-button').click();
      cy.getTestElement('@send/output-1/amount-input').should('not.exist');
      cy.getTestElement('@send/output-2/amount-input').should('not.exist');
      cy.getTestElement('@send/output-0/address-input').should('have.value', '');
      cy.getTestElement('@send/output-0/amount-input').should('have.value', '');
    })
});

