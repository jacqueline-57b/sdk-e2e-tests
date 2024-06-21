import { privateKeyA, privateKeyB } from '../../config/config';
import { attachLicenseTerms } from '../../utils/sdkUtils';
import { expect } from 'chai'
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);
import '../setup';
import { Address } from 'viem';
import { comUseLicenseTermsId1, comUseLicenseTermsId2 } from '../setup';
import addContext from 'mochawesome/addContext';
import { mintNFTAndRegisterDerivative, mintNFTCreateRootIPandAttachPIL } from '../testUtils';

let ipIdA: Address;
let ipIdB: Address;

describe('SDK E2E Test', function () {
    describe(`Commercial Use PIL: "derivativesReciprocal":false`, async function () {
        before("Register parent and derivative IP assets", async function () {    
            addContext(this, "licenseTermsId:" + comUseLicenseTermsId1);

            // root IP: ipIdA
            ipIdA = await mintNFTCreateRootIPandAttachPIL("A", privateKeyA, comUseLicenseTermsId1);
            addContext(this, "Root IP - ipIdA:" + ipIdA);
            // ipIdB is ipIdA's derivative IP
            ipIdB = await mintNFTAndRegisterDerivative("B", privateKeyB, [ipIdA], [comUseLicenseTermsId1]);
            addContext(this, "ipIdA's derivative IP - ipIdB:" + ipIdB);
        });

        step(`"derivativesReciprocal":false, derivative IP (ipIdB) can attach addtional license terms`, async function () {
            // const response = await expect(
            const response = await
                attachLicenseTerms("B", ipIdB, comUseLicenseTermsId2, true)
            // ).to.not.be.rejected;
        });
    });
});
