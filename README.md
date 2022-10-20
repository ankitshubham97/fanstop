# ✨Fanstop ✨
_Decentralized, private & secure access to your favourite content!_

- - -
# Inspirations: Problems with the current state of creator economy
## Dependency on centralized system
What if the service on which the creator hosted their content goes down? What if the service decides to ban that particular creator for whatever reason? The creator is helpless before such centralized systems!

## Not encrypted, prone to leaks
It is not new to hear of news that due to certain vulnerabilities in the centralized system, the content got leaked. On top of it, they rarely care to encrypt the data and then store it.

## No control on monetization
Creators have no control on monetization because it is solely controlled by the platforms they are on and they deduct heacy platform charges (can go as up as 50%). They have to depend on brand sponsorships and amend their content so that sponsors are happy. This snatches away the freedom from the creators.

## Stuck with access
May times, a consumer is stuck with subscription that he does not need anymore. Currently, there is no provision for him to solve this problem. But, since we are using NFT as subscription tokens, a user can trade it off at any Klaytn NFT marketplace!

- - -
# Solution: Enters Fanstop 😎
Fanstop is a decentralized-yet-private content sharing platform for creators where they can:

- Store by-default-encrypted content on IPFS
- Token-gate their content
- Get sponsored directly from their fans!
- Manage their content and monetization without any central authority

Fans can:
- View the private content of their favourite content creators by minting their NFTs. They also monetarily support them by minting.
- Choose to tip their favourite content creators.
- Trade the NFT

## How does Fanstop does this?
### Store by-default-encrypted content on IPFS
All the content that is uploaded to Fanstop is first encrypted and then uploaded to IPFS. IPFS guarantees decentralized storage, so there is no central authority managing the storage which in turn guarantees freedom from censorship. Since the files are encrypted and then stored on IPFS, even if the [CID][cid] of the file is publicly known, the content is safe. It could only be decrypted if a person owns the content creator's NFT (more on this in the subsequent section).
### Fast access to content
Since the files are uploaded to IPFS, a single file is duplicated across multiple IPFS nodes guaranteeing high availability.
### Token-gate their content
Access to the content of a creator, say Taylor, is possible only if a person owns Taylor's NFT. This ensures that if a content is good, then the creator is fairly compensated via royalty that is generated by NFT-minting by their fans and NFT trading. This also ensures that creators have control on their content and its distribution.
### Get sponsored directly from their fans!
Apart from the royalty generated when a fan mints a creator's NFT, they can also choose to directly tip their favourite creators in KLAY!
### Manage their content and monetization without any central authority
On top of all this, creators will be in full control of their content (they can add, remove, edit their content) and the monetization (analyze royalties from NFT minting and tips, who minted, who tipped etc)!
### Gift NFT
Fanstop believes in gifting. So, there is an option within the platform where NFT holders can gift their NFTs to any address of their frens!
### Trading NFT
The fans can indulge in trading the NFTs which is awesome because it gives them freedom to opt in for new content creators and move away from those who they don't like. It also opens up an opportunity to do core NFT trading.
- - -
# Fanstop walkthrough
Let's break down the walkthrough into 2 segments:
- Creator's perspective
- Fan's perspective

## Creator's perspective.
Let's assume that Taylor is the creator (let's assume that there is only one creator on the Fanstop's platform). Also, her wallet address is 0x4ad53d31Cb104Cf5f7622f1AF8Ed09C3ca980523 and she created an NFT smart contract via this wallet and is currently deployed on [Klaytn testnet][chain] at the address [0x23278452a4847b5fc6dd23a49fc6aa70f9226fbb][nft-contract-address]. The NFT contract enables others to mint a token for themselves by paying certain amount in KLAY. This amount flows back to her wallet address. And the holders of the NFT could get access to her content!
When she signs in with her wallet, she can:
1. view her content
2. manage(add/delete) her content
3. check the revenue generated so far from:
a. others minting her NFTs.
b. others tipping/donating her.

## Fan's perspective
Let's assume Ankit is one of those top fans of Taylor. He came to know that if he mints Taylor's NFT on Fanstop, he would be able to watch her content and support her as well. He just goes to the platform, connects his wallet and then since he does not own any of her NFTs, he sees an option to mint. He mints, pays the fee and reconnects his wallet. Voila! He is able to see her content. He also sees option to tip her and he usually tips when he finds some content to be too good!
He also has the option to gift the NFTs that he owns to his frens!
Further, he can buy-and-sell these NFTs as per his wish! Or just keep them as souvenirs!
In short he could do following (but not restricted to these):
1. Explore the private content
2. View the NFTs that you own
3. Gift NFT to some other address
4. Donate some KLAY to the creator
5. Trade the NFTs

- - -

## Project architecture
The project consists of 3 parts: back end, front end and the smart contract.
### Back end
Back end is written in NodeJS and acts like an API server for its front end requests. The project required a data store where we are using IPFS (via Chainlink).
### Front end
Front end is written with the help of ReactJS and Tailwindcss.
### Smart contract
Smart contract is written in Solidity using Hardhat as the development environment. It is deployed on Klaytn [testnet][chain] at [0x23278452a4847b5fc6dd23a49fc6aa70f9226fbb][nft-contract-address]

## Deep diving into the implementation of the token gating
Let's try to understand how it all works by going through the journey!
1. User connects his wallet with the intention to view the private content. (Assume he already has minted the NFT)
2. When he connects the wallet, he basically signs a nonce. The client passes the nonce, signature & his wallet address to the back end where the latter runs 2 checks: verifies the signature & verifies that the address holds the NFT. If all are satisfied, it issues an access token to the client as a cookie. This access token is valid for an hour
3. The client passes this access token as a cookie to server for all the subsequent requests. If the access token is not expired, the back end responds with the protected content, otherwise it denies.
4. Let's say the access token expires after an hour. The client can again get a new access token until the wallet holds the NFT!

## Deep diving into the implementation of the content encryption and storage on IPFS
1. The creator goes to platform and connects her wallet.
2. She sees an option to `manage` her content where she can `Add files`. She proceeds to upload a new file.
3. Fanstop encrypts the file with the creator's key and uploads to IPFS via Chainsafe. (Chainsafe provides a nice AWS-S3-like interface, so its easier for Fanstop to manage files.)
4. Even though distributed, the content is secure (because of encryption) and highly available (multiple IPFS nodes hosting the content)
5. When a fan with NFT tries to access a content, Fanstop verifies he really does hold NFT. After verification, Fanstop loads the encrypted file from IPFS, decrypts it using the creator's key and delivers to the fan.

## Deep diving into the implementation of the smart contract
Smart contract code: https://github.com/ankitshubham97/fanstop/blob/phase-2/smart-contract/contracts/TaylorKlay.sol
Smart contract deployed on [testnet][chain] at [0x23278452a4847b5fc6dd23a49fc6aa70f9226fbb][nft-contract-address]

Smart contract is created by the creator and put on chain.
1. `mintNFT function`: If a person wants to mint an NFT, he can do it via mint function. It requires certain mint fee (currently set to at least 1 KLAY). On a successful mint, the creator is transferred the mint fee to their address which they used to create the smart contract. And of course, the new NFT gets available to the minter's address. Following is the mint function:
```
function mintNFT(string memory tokenURI) public payable {
    require(mintPrice <= msg.value, "Not enough KLAY sent.");

    uint256 tokenId = _tokenIdCounter.current();
    _tokenIdCounter.increment();

    payable(owner()).transfer(msg.value);
    addressToAmountMint[msg.sender] += msg.value;

    _mint(msg.sender, tokenId);
    _setTokenURI(tokenId, tokenURI);
}
```
2. `donate function`: If a person wants to donate some KLAY, he would use this function. This transfers the donated amount to the creator's address which they used to create the smart contract.
```
function donate() public payable {
    require(mintPrice <= msg.value, "Not enough KLAY sent.");
    addressToAmountDonate[msg.sender] += msg.value;
    payable(owner()).transfer(msg.value);
}
```
3. `Mapping of who minted/donated`: The smart contract has two mappings, each to keep track of who all have minted and donated till date.
```
mapping(address => uint256) public addressToAmountMint;
mapping(address => uint256) public addressToAmountDonate;
```

## Some negative user flows:
**User tries toview without connecting the wallet**
He won't be able to get the access token itself. Access token is required to request the protected resource.

**User tries to connect a random wallet with no NFT**
He won't be able to get the access token because the wallet must be containing the NFT!

**User tries to connect a wallet with NFT but trades it off afterwards**
Access token expire after an hour. So, he won't be able to get the subsequent access token since he does not own the NFT anymore!

- - -
## Checking happy path

If you want to interact with the live app, you would need a Metamask wallet switched to Klaytn Baobab testnet which has at least one [NFT][nft-contract-address] (as told in the [demo video][demo]). Please note that if you are the creator of the NFT contract, then you don't need to own any NFT to gain access to your own content (creator of NFT is actually the content creator herself). Here is a list of valid wallets:

| User type | Public address | Private key |
| ------ | ------ | ------ |
| Creator | 0x4ad53d31Cb104Cf5f7622f1AF8Ed09C3ca980523 | dec5213b700bc944b06584aaf3d508f88a1ce0221b77067b7e7b95d7b88d2ae3 |
| Fan | 0x5d905Cd5734A457139bc04c77CAAf3DFCBf0bA33 | aa2f90405e3595239c83d51dcdb7070e14010c472bb69acc284f38558ddde8d7 |

## Checking unhappy path

To check the unhappy path, you could just use any random wallet to connect to the app.
- - -

# Future
This project aims to solve the obvious problems of creator economy(CE) viz centralization of access to creator's data by centralized authorities, content leaks, little-to-no control of creators on the monetization of their content, inability for consumers to trade the subscription etc. We aim to build a product which resolves these problems while polishing it so that it could be adopted by masses. We are still doing some market research mainly around how to provide these services (will it make sense to whitelabel this and ship to creators or host it as SAAS), business value, market cap, rate of adoption etc.

[chain]: <https://baobab.scope.klaytn.com/>
[nft-contract-address]: <https://baobab.scope.klaytn.com/account/0x23278452a4847b5fc6dd23a49fc6aa70f9226fbb>
[demo]: <https://www.youtube.com/watch?v=PNMD0IsNxro>
[cid]: <https://docs.ipfs.tech/concepts/content-addressing/>
