import { Hex } from 'viem';
import {
  mintNFT,
  sleep,
  registerIpWithExistingPolicy,
  registerSocialRemixPolicy,
  mintLicense,
  registerDerivativeIP,
} from '../../../utils/utils';

export default async function testFlow3() {
  const policyId = await registerSocialRemixPolicy();
  const NFTIdOfA = await mintNFT('A');
  const NFTIdOfB = await mintNFT('B');
  await sleep(5);
  if (!policyId) return;
  const ipId = (await registerIpWithExistingPolicy(NFTIdOfA, policyId)) as Hex;
  await sleep(5);
  const licenseId = await mintLicense(ipId, policyId, 'B', 'A');
  if (!licenseId) return;
  await sleep(5);
  await registerDerivativeIP(NFTIdOfB, [licenseId], 'B');
}
