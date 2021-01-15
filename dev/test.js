const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();

bitcoin.createNewBlock(32145, 'ERT134FSDF5', 'ADASE234F3234G')

bitcoin.createNewTransaction(150, 'LEWISXREFWCV1234', 'BOB131FADFWEF')

bitcoin.createNewBlock(23452, 'XXX134FSDF5', 'LWERFS12F3234G')

bitcoin.createNewTransaction(150, 'LEWISXREFWCV1234', 'BOB131FADFWEF')
bitcoin.createNewTransaction(2000, 'LEWISXREFWCV1234', 'BOB131FADFWEF')
bitcoin.createNewTransaction(999, 'LEWISXREFWCV1234', 'BOB131FADFWEF')

bitcoin.createNewBlock(435, 'YTTTTFSDF5', '1231RQETV')

console.log(bitcoin.getLastBlock());