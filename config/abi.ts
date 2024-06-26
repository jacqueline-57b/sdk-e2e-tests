export const accessControllerAbi = [
    {
      type: "constructor",
      inputs: [
        { name: "ipAccountRegistry", internalType: "address", type: "address" },
        { name: "moduleRegistry", internalType: "address", type: "address" },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "error",
      inputs: [
        { name: "signer", internalType: "address", type: "address" },
        { name: "to", internalType: "address", type: "address" },
      ],
      name: "AccessController__BothCallerAndRecipientAreNotRegisteredModule",
    },
    {
      type: "error",
      inputs: [],
      name: "AccessController__CallerIsNotIPAccountOrOwner",
    },
    {
      type: "error",
      inputs: [{ name: "ipAccount", internalType: "address", type: "address" }],
      name: "AccessController__IPAccountIsNotValid",
    },
    {
      type: "error",
      inputs: [],
      name: "AccessController__IPAccountIsZeroAddress",
    },
    {
      type: "error",
      inputs: [
        { name: "ipAccount", internalType: "address", type: "address" },
        { name: "signer", internalType: "address", type: "address" },
        { name: "to", internalType: "address", type: "address" },
        { name: "func", internalType: "bytes4", type: "bytes4" },
      ],
      name: "AccessController__PermissionDenied",
    },
    { type: "error", inputs: [], name: "AccessController__PermissionIsNotValid" },
    { type: "error", inputs: [], name: "AccessController__SignerIsZeroAddress" },
    {
      type: "error",
      inputs: [],
      name: "AccessController__ToAndFuncAreZeroAddressShouldCallSetAllPermissions",
    },
    { type: "error", inputs: [], name: "AccessController__ZeroAccessManager" },
    {
      type: "error",
      inputs: [],
      name: "AccessController__ZeroIPAccountRegistry",
    },
    { type: "error", inputs: [], name: "AccessController__ZeroModuleRegistry" },
    {
      type: "error",
      inputs: [{ name: "authority", internalType: "address", type: "address" }],
      name: "AccessManagedInvalidAuthority",
    },
    {
      type: "error",
      inputs: [
        { name: "caller", internalType: "address", type: "address" },
        { name: "delay", internalType: "uint32", type: "uint32" },
      ],
      name: "AccessManagedRequiredDelay",
    },
    {
      type: "error",
      inputs: [{ name: "caller", internalType: "address", type: "address" }],
      name: "AccessManagedUnauthorized",
    },
    {
      type: "error",
      inputs: [{ name: "target", internalType: "address", type: "address" }],
      name: "AddressEmptyCode",
    },
    {
      type: "error",
      inputs: [{ name: "implementation", internalType: "address", type: "address" }],
      name: "ERC1967InvalidImplementation",
    },
    { type: "error", inputs: [], name: "ERC1967NonPayable" },
    { type: "error", inputs: [], name: "EnforcedPause" },
    { type: "error", inputs: [], name: "ExpectedPause" },
    { type: "error", inputs: [], name: "FailedInnerCall" },
    { type: "error", inputs: [], name: "InvalidInitialization" },
    { type: "error", inputs: [], name: "NotInitializing" },
    { type: "error", inputs: [], name: "UUPSUnauthorizedCallContext" },
    {
      type: "error",
      inputs: [{ name: "slot", internalType: "bytes32", type: "bytes32" }],
      name: "UUPSUnsupportedProxiableUUID",
    },
    {
      type: "event",
      anonymous: false,
      inputs: [
        {
          name: "authority",
          internalType: "address",
          type: "address",
          indexed: false,
        },
      ],
      name: "AuthorityUpdated",
    },
    {
      type: "event",
      anonymous: false,
      inputs: [
        {
          name: "version",
          internalType: "uint64",
          type: "uint64",
          indexed: false,
        },
      ],
      name: "Initialized",
    },
    {
      type: "event",
      anonymous: false,
      inputs: [
        {
          name: "account",
          internalType: "address",
          type: "address",
          indexed: false,
        },
      ],
      name: "Paused",
    },
    {
      type: "event",
      anonymous: false,
      inputs: [
        {
          name: "ipAccountOwner",
          internalType: "address",
          type: "address",
          indexed: false,
        },
        {
          name: "ipAccount",
          internalType: "address",
          type: "address",
          indexed: true,
        },
        {
          name: "signer",
          internalType: "address",
          type: "address",
          indexed: true,
        },
        { name: "to", internalType: "address", type: "address", indexed: true },
        { name: "func", internalType: "bytes4", type: "bytes4", indexed: false },
        {
          name: "permission",
          internalType: "uint8",
          type: "uint8",
          indexed: false,
        },
      ],
      name: "PermissionSet",
    },
    {
      type: "event",
      anonymous: false,
      inputs: [
        {
          name: "account",
          internalType: "address",
          type: "address",
          indexed: false,
        },
      ],
      name: "Unpaused",
    },
    {
      type: "event",
      anonymous: false,
      inputs: [
        {
          name: "implementation",
          internalType: "address",
          type: "address",
          indexed: true,
        },
      ],
      name: "Upgraded",
    },
    {
      type: "function",
      inputs: [],
      name: "IP_ACCOUNT_REGISTRY",
      outputs: [
        {
          name: "",
          internalType: "contract IIPAccountRegistry",
          type: "address",
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      inputs: [],
      name: "MODULE_REGISTRY",
      outputs: [{ name: "", internalType: "contract IModuleRegistry", type: "address" }],
      stateMutability: "view",
    },
    {
      type: "function",
      inputs: [],
      name: "UPGRADE_INTERFACE_VERSION",
      outputs: [{ name: "", internalType: "string", type: "string" }],
      stateMutability: "view",
    },
    {
      type: "function",
      inputs: [{ name: "accessManager", internalType: "address", type: "address" }],
      name: "__ProtocolPausable_init",
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      inputs: [],
      name: "authority",
      outputs: [{ name: "", internalType: "address", type: "address" }],
      stateMutability: "view",
    },
    {
      type: "function",
      inputs: [
        { name: "ipAccount", internalType: "address", type: "address" },
        { name: "signer", internalType: "address", type: "address" },
        { name: "to", internalType: "address", type: "address" },
        { name: "func", internalType: "bytes4", type: "bytes4" },
      ],
      name: "checkPermission",
      outputs: [],
      stateMutability: "view",
    },
    {
      type: "function",
      inputs: [
        { name: "ipAccount", internalType: "address", type: "address" },
        { name: "signer", internalType: "address", type: "address" },
        { name: "to", internalType: "address", type: "address" },
        { name: "func", internalType: "bytes4", type: "bytes4" },
      ],
      name: "getPermission",
      outputs: [{ name: "", internalType: "uint8", type: "uint8" }],
      stateMutability: "view",
    },
    {
      type: "function",
      inputs: [{ name: "accessManager", internalType: "address", type: "address" }],
      name: "initialize",
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      inputs: [],
      name: "isConsumingScheduledOp",
      outputs: [{ name: "", internalType: "bytes4", type: "bytes4" }],
      stateMutability: "view",
    },
    {
      type: "function",
      inputs: [],
      name: "pause",
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      inputs: [],
      name: "paused",
      outputs: [{ name: "", internalType: "bool", type: "bool" }],
      stateMutability: "view",
    },
    {
      type: "function",
      inputs: [],
      name: "proxiableUUID",
      outputs: [{ name: "", internalType: "bytes32", type: "bytes32" }],
      stateMutability: "view",
    },
    {
      type: "function",
      inputs: [
        { name: "ipAccount", internalType: "address", type: "address" },
        { name: "signer", internalType: "address", type: "address" },
        { name: "permission", internalType: "uint8", type: "uint8" },
      ],
      name: "setAllPermissions",
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      inputs: [{ name: "newAuthority", internalType: "address", type: "address" }],
      name: "setAuthority",
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      inputs: [
        {
          name: "permissions",
          internalType: "struct AccessPermission.Permission[]",
          type: "tuple[]",
          components: [
            { name: "ipAccount", internalType: "address", type: "address" },
            { name: "signer", internalType: "address", type: "address" },
            { name: "to", internalType: "address", type: "address" },
            { name: "func", internalType: "bytes4", type: "bytes4" },
            { name: "permission", internalType: "uint8", type: "uint8" },
          ],
        },
      ],
      name: "setBatchPermissions",
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      inputs: [
        { name: "ipAccount", internalType: "address", type: "address" },
        { name: "signer", internalType: "address", type: "address" },
        { name: "to", internalType: "address", type: "address" },
        { name: "func", internalType: "bytes4", type: "bytes4" },
        { name: "permission", internalType: "uint8", type: "uint8" },
      ],
      name: "setPermission",
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      inputs: [],
      name: "unpause",
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      inputs: [
        { name: "newImplementation", internalType: "address", type: "address" },
        { name: "data", internalType: "bytes", type: "bytes" },
      ],
      name: "upgradeToAndCall",
      outputs: [],
      stateMutability: "payable",
    },
] as const;

export const transferLicenseTokenAbi = {
  inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "tokenId", type: "uint256" }
  ],
  name: "transferFrom",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function",
};

export const getLicenseTokenOwnerAbi = {
  inputs: [
    { internalType: 'uint256', name: 'tokenId', type: 'uint256' }
  ],
  name: 'ownerOf',
  outputs: [
    { internalType: 'address', name: 'address', type: 'address' }
  ],
  stateMutability: 'view',
  type: 'function'
};
