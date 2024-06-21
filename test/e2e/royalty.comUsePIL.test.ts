import { privateKeyA, privateKeyB, privateKeyC, mintingFeeTokenAddress, accountB, accountA, accountC } from '../../config/config'
import { getTotalRTSupply} from '../../utils/utils'
import { payRoyaltyOnBehalf, registerCommercialUsePIL } from '../../utils/sdkUtils'
import { expect } from 'chai'
import { mintNFTCreateRootIPandAttachPIL, mintNFTAndRegisterDerivative, checkRoyaltyTokensCollected, getSnapshotId,checkClaimableRevenue, claimRevenueByIPA, claimRevenueByEOA, transferTokenToEOA } from '../testUtils'

import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import '../setup';
import { Address } from 'viem';
import { comUseLicenseTermsId1, mintingFee1 } from '../setup'
import addContext from 'mochawesome/addContext'

let ipIdA: Address;
let ipIdB: Address;
let ipIdC: Address;
let ipIdD: Address;
let snapshotId1_ipIdA: bigint;
let snapshotId1_ipIdB: bigint;
let snapshotId1_ipIdC: bigint;
let TOTAL_RT_SUPPLY: number;

describe("SDK E2E Test - Royalty", function () {
    this.beforeAll("Get total RT supply", async function (){
        TOTAL_RT_SUPPLY = await getTotalRTSupply();
        addContext(this, "TOTAL_RT_SUPPLY:" + TOTAL_RT_SUPPLY);
    });

    describe("Commercial Use PIL - Claim Minting Fee by IPA account", function () {
        before("Register parent and derivative IP assets", async function () {
            addContext(this, "licenseTermsId:" + comUseLicenseTermsId1);
            // root IP: ipIdA
            ipIdA = await mintNFTCreateRootIPandAttachPIL("A", privateKeyA, comUseLicenseTermsId1);
            addContext(this, "Root IP - ipIdA:" + ipIdA);
            // ipIdB is ipIdA's derivative IP
            ipIdB = await mintNFTAndRegisterDerivative("B", privateKeyB, [ipIdA], [comUseLicenseTermsId1]);
            addContext(this, "ipIdA's derivative IP - ipIdB:" + ipIdB);
        });

        step("ipIdA collect royalty tokens from ipIdB", async function () {
            await checkRoyaltyTokensCollected("A", ipIdA, ipIdB, 0n);
        });

        step("Capture snapshotId for ipIdB", async function () {
            snapshotId1_ipIdB = await getSnapshotId("B", ipIdB);
        });

        step("ipIdA check claimable revenue from vaultIpIdB", async function () {
            await checkClaimableRevenue("A", ipIdB, ipIdA, snapshotId1_ipIdB, 0n);
        });

        step("ipIdA claim revenue from vaultIpIdB", async function () {
            await claimRevenueByIPA("A", [snapshotId1_ipIdB], ipIdB, ipIdA, 0n);              
        });

        step("ipIdB check claimable revenue from vaultIpIdB", async function () {
            await checkClaimableRevenue("B", ipIdB, ipIdB, snapshotId1_ipIdB, 0n);
        });

        step("ipIdB claim revenue from vaultIpIdB", async function () {
            await claimRevenueByIPA("B", [snapshotId1_ipIdB], ipIdB, ipIdB, 0n);              
        });

        step("Capture snapshotId for ipIdA", async function () {
            snapshotId1_ipIdA = await getSnapshotId("A", ipIdA);
        });

        step("ipIdA check claimable revenue from vaultIpIdA", async function () {
            await checkClaimableRevenue("A", ipIdA, ipIdA, snapshotId1_ipIdA, BigInt(mintingFee1));
        });

        step("idIdA claim revenue from vaultIpIdA (minting fee)", async function () {
            await claimRevenueByIPA("A", [snapshotId1_ipIdA], ipIdA, ipIdA, BigInt(mintingFee1));
        });

        step("Check claimable revenue again", async function () {
            await checkClaimableRevenue("A", ipIdA, ipIdA, snapshotId1_ipIdA, 0n);
        });            
    });

    describe('Commercial Use PIL - Claim Minting Fee and Revenue by IPA account', async function () {
        const mintingFee: number = 180;
        const payAmount: number = 1000000;

        before("Register parent and derivative IP assets", async function () {    
            // register commercial use PIL
            const licenseTermsId = Number((await registerCommercialUsePIL("A", mintingFee, mintingFeeTokenAddress, true)).licenseTermsId);
            addContext(this, "licenseTermsId:" + licenseTermsId);

            // root IP: ipIdA
            ipIdA = await mintNFTCreateRootIPandAttachPIL("A", privateKeyA, licenseTermsId);
            addContext(this, "Root IP - ipIdA:" + ipIdA);
            // ipIdB is ipIdA's derivative IP
            ipIdB = await mintNFTAndRegisterDerivative("B", privateKeyB, [ipIdA], [licenseTermsId]);
            addContext(this, "ipIdA's derivative IP - ipIdB:" + ipIdB);
            // ipIdC is ipIdB's derivative IP
            ipIdC = await mintNFTAndRegisterDerivative("C", privateKeyC, [ipIdB], [licenseTermsId]);
            addContext(this, "ipIdB's derivative IP - ipIdC:" + ipIdC);
        });

        step("ipIdC pay royalty on behalf to ipIdB", async function () {
            const response = await expect(
                payRoyaltyOnBehalf("C", ipIdB, ipIdC, mintingFeeTokenAddress, payAmount, true)
            ).to.not.be.rejected;
            
            expect(response.txHash).to.be.a("string").and.not.empty;
        });

        step("Capture snapshotId for ipIdB", async function () {
            snapshotId1_ipIdB = await getSnapshotId("B", ipIdB);
        });

        step("ipIdA check claimable revenue from vaultIpIdB", async function () {
            await checkClaimableRevenue("A", ipIdB, ipIdA, snapshotId1_ipIdB, 0n);
        });

        step("ipIdA claim revenue from vaultIpIdB", async function () {
            await claimRevenueByIPA("A", [snapshotId1_ipIdB], ipIdB, ipIdA, 0n);
        });

        step("ipIdB check claimable revenue from vaultIpIdB", async function () {
            await checkClaimableRevenue("B", ipIdB, ipIdB, snapshotId1_ipIdB, BigInt(payAmount + mintingFee));
        });

        step("ipIdB claim revenue from vaultIpIdB", async function () {
            await claimRevenueByIPA("B", [snapshotId1_ipIdB], ipIdB, ipIdB, BigInt(payAmount + mintingFee));
        });

        step("Capture snapshotId for ipIdA", async function () {
            snapshotId1_ipIdA = await getSnapshotId("A", ipIdA);
        });

        step("ipIdA check claimable revenue from vaultIpIdA", async function () {
            await checkClaimableRevenue("A", ipIdA, ipIdA, snapshotId1_ipIdA, BigInt(mintingFee));
        });

        step("ipIdA claim revenue from vaultIpIdA", async function () {
            await claimRevenueByIPA("A", [snapshotId1_ipIdA], ipIdA, ipIdA, BigInt(mintingFee));
        });
    });

    describe('Commercial Use PIL - Claim Minting Fee and Revenue by EOA', async function () {
        const mintingFee: number = 200;
        const payAmount: number = 1000;

        before("Register parent and derivative IP assets", async function () {    
            // register commercial use PIL
            const licenseTermsId = Number((await registerCommercialUsePIL("A", mintingFee, mintingFeeTokenAddress, true)).licenseTermsId);
            addContext(this, "licenseTermsId:" + licenseTermsId);

            // root IP: ipIdA
            ipIdA = await mintNFTCreateRootIPandAttachPIL("A", privateKeyA, licenseTermsId);
            addContext(this, "Root IP - ipIdA:" + ipIdA);
            // ipIdB is ipIdA's derivative IP
            ipIdB = await mintNFTAndRegisterDerivative("B", privateKeyB, [ipIdA], [licenseTermsId]);
            addContext(this, "ipIdA's derivative IP - ipIdB:" + ipIdB);
            // ipIdC is ipIdB's derivative IP
            ipIdC = await mintNFTAndRegisterDerivative("C", privateKeyC, [ipIdB], [licenseTermsId]);
            addContext(this, "ipIdB's derivative IP - ipIdC:" + ipIdC);
        });

        step("Transfer token to EOA - ipIdB", async function () {
            await transferTokenToEOA("B", ipIdB, accountB.address, BigInt(100 * 10 ** 6));
        });

        step("Transfer token to EOA - ipIdA", async function () {
            await transferTokenToEOA("A", ipIdA, accountA.address, BigInt(100 * 10 ** 6));
        });

        step("ipIdC pay royalty on behalf to ipIdB", async function () {
            const response = await expect(
                payRoyaltyOnBehalf("C", ipIdB, ipIdC, mintingFeeTokenAddress, payAmount, true)
            ).to.not.be.rejected;
            
            expect(response.txHash).to.be.a("string").and.not.empty;
        });

        step("Capture snapshotId for ipIdB", async function () {
            snapshotId1_ipIdB = await getSnapshotId("B", ipIdB);
        });

        step("ipIdA check claimable revenue from vaultIpIdB", async function () {
            await checkClaimableRevenue("A", ipIdB, ipIdA, snapshotId1_ipIdB, 0n);
        });

        step("ipIdB check claimable revenue from vaultIpIdB", async function () {
            await checkClaimableRevenue("B", ipIdB, ipIdB, snapshotId1_ipIdB, 0n);
        });

        step("ipIdA claim revenue from vaultIpIdB", async function () {
            await claimRevenueByEOA("A", [snapshotId1_ipIdB], ipIdB, 0n);
        });

        step("ipIdB claim revenue from vaultIpIdB by IPA", async function () {
            await claimRevenueByIPA("B", [snapshotId1_ipIdB], ipIdB, ipIdB, 0n);
        });

        step("ipIdB claim revenue from vaultIpIdB by EOA", async function () {
            await claimRevenueByEOA("B", [snapshotId1_ipIdB], ipIdB, BigInt(payAmount + mintingFee));
        });

        step("Capture snapshotId for ipIdA", async function () {
            snapshotId1_ipIdA = await getSnapshotId("A", ipIdA);
        });

        step("ipIdA check claimable revenue from vaultIpIdA", async function () {
            await checkClaimableRevenue("A", ipIdA, ipIdA, snapshotId1_ipIdA, 0n);
        });

        step("ipIdA claim revenue from vaultIpIdA by IPA", async function () {
            await claimRevenueByIPA("A", [snapshotId1_ipIdA], ipIdA, ipIdA, 0n);
        });

        step("ipIdA claim revenue from vaultIpIdA by EOA", async function () {
            await claimRevenueByEOA("A", [snapshotId1_ipIdA], ipIdA, BigInt(mintingFee));
        });
    });

    describe('Commercial Use PIL - Claim Minting Fee and Revenue by IPA account and EOA', async function () {
        const mintingFee: number = 600;
        const payAmount: number = 2000;

        before("Register parent and derivative IP assets", async function () {    
            // register commercial use PIL
            const licenseTermsId = Number((await registerCommercialUsePIL("A", mintingFee, mintingFeeTokenAddress, true)).licenseTermsId);
            addContext(this, "licenseTermsId:" + licenseTermsId);

            // root IP: ipIdA
            ipIdA = await mintNFTCreateRootIPandAttachPIL("A", privateKeyA, licenseTermsId);
            addContext(this, "Root IP - ipIdA:" + ipIdA);
            // ipIdB is ipIdA's derivative IP
            ipIdB = await mintNFTAndRegisterDerivative("B", privateKeyB, [ipIdA], [licenseTermsId]);
            addContext(this, "ipIdA's derivative IP - ipIdB:" + ipIdB);
            // ipIdC is ipIdB's derivative IP
            ipIdC = await mintNFTAndRegisterDerivative("C", privateKeyC, [ipIdB], [licenseTermsId]);
            addContext(this, "ipIdB's derivative IP - ipIdC:" + ipIdC);

            // ipIdD is ipIdC's derivative IP
            ipIdD = await mintNFTAndRegisterDerivative("C", privateKeyC, [ipIdC], [licenseTermsId]);
            addContext(this, "ipIdC's derivative IP - ipIdD:" + ipIdD);
        });

        step("Transfer token to EOA - ipIdA", async function () {
            await transferTokenToEOA("C", ipIdC, accountA.address, BigInt(TOTAL_RT_SUPPLY * 0.1));
        });

        step("Transfer token to EOA - ipIdB", async function () {
            await transferTokenToEOA("C", ipIdC, accountB.address, BigInt(TOTAL_RT_SUPPLY * 0.1));
        });

        step("Transfer token to EOA - ipIdC", async function () {
            await transferTokenToEOA("C", ipIdC, accountC.address, BigInt(TOTAL_RT_SUPPLY * 0.6));
        });

        step("ipIdD pay royalty on behalf to ipIdC", async function () {
            const response = await expect(
                payRoyaltyOnBehalf("C", ipIdC, ipIdD, mintingFeeTokenAddress, payAmount, true)
            ).to.not.be.rejected;
            
            expect(response.txHash).to.be.a("string").and.not.empty;
        });

        step("Capture snapshotId for ipIdC", async function () {
            snapshotId1_ipIdC = await getSnapshotId("C", ipIdC);
        });

        step("Capture snapshotId for ipIdB", async function () {
            snapshotId1_ipIdB = await getSnapshotId("B", ipIdB);
        });

        step("Capture snapshotId for ipIdA", async function () {
            snapshotId1_ipIdA = await getSnapshotId("A", ipIdA);
        });

        step("ipIdA check claimable revenue from vaultIpIdC", async function () {
            await checkClaimableRevenue("A", ipIdC, ipIdA, snapshotId1_ipIdC, 0n);
        });

        step("ipIdB check claimable revenue from vaultIpIdC", async function () {
            await checkClaimableRevenue("B", ipIdC, ipIdB, snapshotId1_ipIdC, 0n);
        });

        step("ipIdC check claimable revenue from vaultIpIdC", async function () {
            await checkClaimableRevenue("C", ipIdC, ipIdC, snapshotId1_ipIdC, BigInt((payAmount + mintingFee) * 0.2));
        });

        step("ipIdA check claimable revenue from vaultIpIdB", async function () {
            await checkClaimableRevenue("A", ipIdB, ipIdA, snapshotId1_ipIdB, 0n);
        });

        step("ipIdB check claimable revenue from vaultIpIdB", async function () {
            await checkClaimableRevenue("B", ipIdB, ipIdB, snapshotId1_ipIdB, BigInt(mintingFee));
        });

        step("ipIdA check claimable revenue from vaultIpIdA", async function () {
            await checkClaimableRevenue("A", ipIdA, ipIdA, snapshotId1_ipIdA, BigInt(mintingFee));
        });

        step("ipIdA claim revenue from vaultIpIdC by EOA", async function () {
            await claimRevenueByEOA("A", [snapshotId1_ipIdC], ipIdC, BigInt((payAmount + mintingFee) * 0.1));
        });

        step("ipIdB claim revenue from vaultIpIdC by EOA", async function () {
            await claimRevenueByEOA("B", [snapshotId1_ipIdC], ipIdC, BigInt((payAmount + mintingFee) * 0.1));
        });

        step("ipIdC claim revenue from vaultIpIdC by EOA", async function () {
            await claimRevenueByEOA("C", [snapshotId1_ipIdC], ipIdC, BigInt((payAmount + mintingFee) * 0.6));
        });

        step("ipIdC claim revenue from vaultIpIdC by IPA", async function () {
            await claimRevenueByIPA("C", [snapshotId1_ipIdC], ipIdC, ipIdC, BigInt((payAmount + mintingFee) * 0.2));
        });

        step("ipIdA claim revenue from vaultIpIdB by IPA", async function () {
            await claimRevenueByIPA("A", [snapshotId1_ipIdB], ipIdB, ipIdA, BigInt(0n));
        });

        step("ipIdB claim revenue from vaultIpIdB by IPA", async function () {
            await claimRevenueByIPA("B", [snapshotId1_ipIdB], ipIdB, ipIdB, BigInt(mintingFee));
        });

        step("ipIdB claim revenue from vaultIpIdB by IPA", async function () {
            await claimRevenueByIPA("A", [snapshotId1_ipIdA], ipIdA, ipIdA, BigInt(mintingFee));
        });
    });
});

