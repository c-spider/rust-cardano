const expect = require('chai').expect;
const CardanoCrypto = require('../../dist/index.js');

const TEST_VECTORS = [
  {
     // to create the Txin
     txid: new Uint8Array([0xaa,0xd7,0x8a,0x13,0xb5,0x0a,0x01,0x4a,0x24,0x63,0x3c,0x7d,0x44,0xfd,0x8f,0x8d,0x18,0xf6,0x7b,0xbb,0x3f,0xa9,0xcb,0xce,0xdf,0x83,0x4a,0xc8,0x99,0x75,0x9d,0xcd]),
     index: 666,
     // the expected txin
     txin: new Uint8Array([0x82, 0x00, 0xd8, 0x18, 0x58, 0x26, 0x82, 0x58, 0x20, 0xaa, 0xd7, 0x8a, 0x13, 0xb5, 0x0a, 0x01, 0x4a, 0x24, 0x63, 0x3c, 0x7d, 0x44, 0xfd, 0x8f, 0x8d, 0x18, 0xf6, 0x7b, 0xbb, 0x3f, 0xa9, 0xcb, 0xce, 0xdf, 0x83, 0x4a, 0xc8, 0x99, 0x75, 0x9d, 0xcd, 0x19, 0x02, 0x9a]),

     // to create the txout
     address: new Uint8Array([0x82, 0xd8, 0x18, 0x58, 0x29, 0x83, 0x58, 0x1c, 0x83, 0xee, 0xa1, 0xb5, 0xec, 0x8e, 0x80, 0x26, 0x65, 0x81, 0x46, 0x4a, 0xee, 0x0e, 0x2d, 0x6a, 0x45, 0xfd, 0x6d, 0x7b, 0x9e, 0x1a, 0x98, 0x3a, 0x50, 0x48, 0xcd, 0x15, 0xa1, 0x01, 0x46, 0x45, 0x01, 0x02, 0x03, 0x04, 0x05, 0x00, 0x1a, 0x9d, 0x45, 0x88, 0x4a]),
     amount: 42,
     // the expected txout
     txout: new Uint8Array([0x82, 0x82, 0xd8, 0x18, 0x58, 0x29, 0x83, 0x58, 0x1c, 0x83, 0xee, 0xa1, 0xb5, 0xec, 0x8e, 0x80, 0x26, 0x65, 0x81, 0x46, 0x4a, 0xee, 0x0e, 0x2d, 0x6a, 0x45, 0xfd, 0x6d, 0x7b, 0x9e, 0x1a, 0x98, 0x3a, 0x50, 0x48, 0xcd, 0x15, 0xa1, 0x01, 0x46, 0x45, 0x01, 0x02, 0x03, 0x04, 0x05, 0x00, 0x1a, 0x9d, 0x45, 0x88, 0x4a, 0x18, 0x2a]),

     tx: new Uint8Array([0x83, 0x9f, 0x82, 0x00, 0xd8, 0x18, 0x58, 0x26, 0x82, 0x58, 0x20, 0xaa, 0xd7, 0x8a, 0x13, 0xb5, 0x0a, 0x01, 0x4a, 0x24, 0x63, 0x3c, 0x7d, 0x44, 0xfd, 0x8f, 0x8d, 0x18, 0xf6, 0x7b, 0xbb, 0x3f, 0xa9, 0xcb, 0xce, 0xdf, 0x83, 0x4a, 0xc8, 0x99, 0x75, 0x9d, 0xcd, 0x19, 0x02, 0x9a, 0xff, 0x9f, 0x82, 0x82, 0xd8, 0x18, 0x58, 0x29, 0x83, 0x58, 0x1c, 0x83, 0xee, 0xa1, 0xb5, 0xec, 0x8e, 0x80, 0x26, 0x65, 0x81, 0x46, 0x4a, 0xee, 0x0e, 0x2d, 0x6a, 0x45, 0xfd, 0x6d, 0x7b, 0x9e, 0x1a, 0x98, 0x3a, 0x50, 0x48, 0xcd, 0x15, 0xa1, 0x01, 0x46, 0x45, 0x01, 0x02, 0x03, 0x04, 0x05, 0x00, 0x1a, 0x9d, 0x45, 0x88, 0x4a, 0x18, 0x2a, 0xff, 0xa0]),
  }
];

let mkTest = (i) => {
    const { txid, index, txin, address, amount, txout, tx } = TEST_VECTORS[i];

    describe('Test ' + i, function() {
        it('create a TxIn', function() {
            expect(CardanoCrypto.Tx.newTxIn(txid, index))
                .deep.equal(txin);
        });

        it('create a TxOut', function() {
            expect(CardanoCrypto.Tx.newTxOut(address, amount))
                .deep.equal(txout);
        });

        it('create a Tx', function() {
            let txtmp = CardanoCrypto.Tx.create();
            txtmp = CardanoCrypto.Tx.addInput(txtmp, txin);
            txtmp = CardanoCrypto.Tx.addOutput(txtmp, txout);
            expect(txtmp).deep.equal(tx);
        });
    });
}

describe('Create Transactions', function() {
    for (let i = 0; i < TEST_VECTORS.length; i++) {
        mkTest(i);
    }
});