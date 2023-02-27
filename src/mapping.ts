import { TransferSingle } from '../generated/ERC1155/ERC1155'
import { Transfer } from '../generated/ERC721/ERC721'
import { NftOwner, NftItem, NftOwnerItem } from '../generated/schema'
import { BigInt } from '@graphprotocol/graph-ts';

export function handleNewTransfer(event: TransferSingle): void {
  let nftId = event.address.toHex() + '-' + event.params._id.toHex()
  let fromOwnerId = event.params._from.toHex()
  let toOwnerId = event.params._to.toHex()
  let fromOwnerItemId = nftId + '-' + fromOwnerId
  let toOwnerItemId = nftId + '-' + toOwnerId

  // owner to receive item 
  let toOwner = NftOwner.load(toOwnerId)
  if (toOwner == null) {
    toOwner = new NftOwner(toOwnerId)
    toOwner.items = [nftId]
  }
  else {
    toOwner.items.push(nftId);
  }
  toOwner.save()

  // NFT item
  let nft = NftItem.load(nftId)
  if (nft == null) {
    nft = new NftItem(nftId)
    nft.owners = [toOwnerId]
  }
  else {
    nft.owners.push(toOwnerId)
  }
  nft.tokenId = event.params._id
  nft.contract = event.address;
  nft.save()

  // OwnerItem of `from` address
  let fromOwnerItem = NftOwnerItem.load(fromOwnerItemId)
  if (fromOwnerItem != null) {
    // fromOwnerItem.amount.minus(event.params._value)
    let nftAmount = fromOwnerItem.amount
    fromOwnerItem.amount = nftAmount.minus(event.params._value)
    fromOwnerItem.save()
  }

  // OwnerItem of `to` address
  let toOwnerItem = NftOwnerItem.load(toOwnerItemId)
  if (toOwnerItem == null) {
    toOwnerItem = new NftOwnerItem(toOwnerItemId)
    toOwnerItem.ownerId = toOwnerId
    toOwnerItem.itemId = nftId
    toOwnerItem.amount = event.params._value
  }
  else {
    toOwnerItem.amount.plus(event.params._value)
  }
  toOwnerItem.save()
}

export function handleNewTransfer721(event: Transfer): void {
  let nftId = event.address.toHex() + '-' + event.params._tokenId.toHex()
  let fromOwnerId = event.params._from.toHex()
  let toOwnerId = event.params._to.toHex()
  let fromOwnerItemId = nftId + '-' + fromOwnerId
  let toOwnerItemId = nftId + '-' + toOwnerId

  // owner to receive item 
  let toOwner = NftOwner.load(toOwnerId)
  if (toOwner == null) {
    toOwner = new NftOwner(toOwnerId)
    toOwner.items = [nftId]
  }
  else {
    toOwner.items.push(nftId);
  }
  toOwner.save()

  // NFT item
  let nft = NftItem.load(nftId)
  if (nft == null) {
    nft = new NftItem(nftId)
    nft.owners = [toOwnerId]
  }
  else {
    nft.owners.push(toOwnerId)
  }
  nft.tokenId = event.params._tokenId
  nft.contract = event.address;
  nft.save()

  // OwnerItem of `from` address
  let fromOwnerItem = NftOwnerItem.load(fromOwnerItemId)
  if (fromOwnerItem != null) {
    // fromOwnerItem.amount.minus(event.params._value)
    let nftAmount = fromOwnerItem.amount
    fromOwnerItem.amount = BigInt.fromI32(0)
    fromOwnerItem.save()
  }

  // OwnerItem of `to` address
  let toOwnerItem = NftOwnerItem.load(toOwnerItemId)
  if (toOwnerItem == null) {
    toOwnerItem = new NftOwnerItem(toOwnerItemId)
    toOwnerItem.ownerId = toOwnerId
    toOwnerItem.itemId = nftId
  }
  toOwnerItem.amount = BigInt.fromI32(1)
  toOwnerItem.save()
}