import { privateKeyA } from '../../config/config';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
chai.use(chaiAsPromised);
import '../setup';
import { getIpAccountNonce } from '../../utils/sdkUtils';
import { nonComLicenseTermsId, comUseLicenseTermsId1, comRemixLicenseTermsId1 } from '../setup';
import { Address } from 'viem';
import { mintNFTCreateRootIPandAttachPIL } from '../testUtils';

let ipIdA: Address;
let ipIdB: Address;
let ipIdC: Address;

describe("SDK Test", function () {
    describe("Get IP account nonce - ipAccount.getIpAccountNonce", async function () {
        before("Register an IP asset",async function () {
            ipIdA = await mintNFTCreateRootIPandAttachPIL("A", privateKeyA, nonComLicenseTermsId);
            ipIdB = await mintNFTCreateRootIPandAttachPIL("A", privateKeyA, comUseLicenseTermsId1);
            ipIdC = await mintNFTCreateRootIPandAttachPIL("A", privateKeyA, comRemixLicenseTermsId1);
        });

        describe("Get IP account nonce - Positive tests", async function () {
            it("IP asset with non commercial social remix license", async function () {
                const response = await expect(
                    getIpAccountNonce("A", ipIdA)
                ).to.not.be.rejected;

                expect(response).to.be.a("bigint").and.to.be.ok;
                expect(Number(response)).to.be.greaterThanOrEqual(1);
            });  

            it("IP asset with commercial use license", async function () {
                const response = await expect(
                    getIpAccountNonce("A", ipIdB)
                ).to.not.be.rejected;

                expect(response).to.be.a("bigint").and.to.be.ok;
                expect(Number(response)).to.be.greaterThanOrEqual(1);
            });                

            it("IP asset with commercial remix license", async function () {
                const response = await expect(
                    getIpAccountNonce("A", ipIdC)
                ).to.not.be.rejected;

                expect(response).to.be.a("bigint").and.to.be.ok;
                expect(Number(response)).to.be.greaterThanOrEqual(1);
            });                
        });

        describe("Get IP account nonce - Negative tests", async function () {
            it("Get IP account nonce with invalid ipId: undefined", async function () {
                let ipId: any;
                await expect(
                    getIpAccountNonce("A", ipId)
                ).to.be.rejectedWith(`ipId address is invalid: undefined, Address must be a hex value of 20 bytes (40 hex characters) and match its checksum counterpart.`);
            });               

            it(`Get IP account nonce with invalid ipId: "0x0000"`, async function () {
                await expect(
                    getIpAccountNonce("A", "0x0000")
                ).to.be.rejectedWith(`ipId address is invalid: 0x0000, Address must be a hex value of 20 bytes (40 hex characters) and match its checksum counterpart.`);
            });                                         
        });
    });
});
