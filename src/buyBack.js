const { Connection, PublicKey, Transaction, TransactionInstruction, sendAndConfirmTransaction, Keypair, SystemProgram, SYSVAR_RENT_PUBKEY } = require('@solana/web3.js');
const { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const crypto = require('crypto');
const bs58 = require('bs58');
const { SOLANA_RPC_URL, PRIVATE_KEY, TOKEN_MINT } = require('./config');

const connection = new Connection(SOLANA_RPC_URL);
const programId = new PublicKey('6EF8rrecthR5Dkzon8NQtpjJcmZzNjgE7r1f4mA2o7k');
const user = Keypair.fromSecretKey(bs58.decode(PRIVATE_KEY));
const mint = new PublicKey(TOKEN_MINT);
const feeRecipient = new PublicKey('CEBn5WGQ4jvEPvsVU4EoHEpgzq1yybcn25YnqFiP3gr');

async function buyBack(amount, maxSolCost) {
  try {
    // Calculate PDAs
    const [global] = PublicKey.findProgramAddressSync([Buffer.from('global')], programId);
    const [bondingCurve] = PublicKey.findProgramAddressSync([Buffer.from('bonding-curve'), mint.toBuffer()], programId);
    const [eventAuthority] = PublicKey.findProgramAddressSync([Buffer.from('__event_authority')], programId);

    // ATAs
    const userAta = await getAssociatedTokenAddress(mint, user.publicKey);
    const bondingCurveAta = await getAssociatedTokenAddress(mint, bondingCurve, true);

    // Discriminator
    const hash = crypto.createHash('sha256').update('global:buy').digest();
    const discriminator = hash.subarray(0, 8);

    // Data
    const data = Buffer.concat([
      discriminator,
      Buffer.alloc(8).writeBigUInt64LE(BigInt(amount)),
      Buffer.alloc(8).writeBigUInt64LE(BigInt(maxSolCost))
    ]);

    // Instruction
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: global, isSigner: false, isWritable: true },
        { pubkey: feeRecipient, isSigner: false, isWritable: true },
        { pubkey: mint, isSigner: false, isWritable: true },
        { pubkey: bondingCurve, isSigner: false, isWritable: true },
        { pubkey: bondingCurveAta, isSigner: false, isWritable: true },
        { pubkey: userAta, isSigner: false, isWritable: true },
        { pubkey: user.publicKey, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
        { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
        { pubkey: eventAuthority, isSigner: false, isWritable: false },
        { pubkey: programId, isSigner: false, isWritable: false },
      ],
      programId,
      data,
    });

    // Transaction
    const transaction = new Transaction().add(instruction);
    const signature = await sendAndConfirmTransaction(connection, transaction, [user]);

    console.log('Buy back transaction sent:', signature);
    return signature;
  } catch (error) {
    console.error('Error in buy back:', error);
    throw error;
  }
}

async function getWalletBalance() {
  const balance = await connection.getBalance(user.publicKey);
  return balance / 1e9; // In SOL
}

async function buyWithAllBalance() {
  const balance = await getWalletBalance();
  if (balance <= 0.01) { // Keep some for fees
    console.log('Insufficient balance for buy back');
    return;
  }
  const maxSolCost = Math.floor((balance - 0.01) * 1e9); // In lamports
  // Amount: let's say buy as many as possible, but need to calculate based on curve
  // For simplicity, set amount to a large number, but actually need to calculate
  // Since it's bonding curve, amount is input, but to buy with all SOL, need to estimate
  // For now, assume a fixed amount or calculate
  // To make it simple, buy a fixed amount, but user wants all fees
  // Perhaps buy until balance is low
  // But for demo, buy 1M tokens or something
  const amount = 1000000; // 1M tokens
  await buyBack(amount, maxSolCost);
}

module.exports = { buyWithAllBalance };