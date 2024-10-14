import { toast } from "svelte-sonner";
import type {
  DestinyItemActionRequest,
  DestinyItemTransferRequest,
  DestinyItemSetActionRequest,
} from "$lib/utils/types";

export async function equipItem(
  itemId: string,
  characterId: string,
  membershipType: number,
) {
  try {
    const request: DestinyItemActionRequest = {
      itemId,
      characterId,
      membershipType,
    };

    const response = await fetch("/api/d2/item-actions/equip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to equip item: ${errorText}`);
    }

    const data = await response.json();
    toast.success("Item equipped successfully");
    return data;
  } catch (error) {
    console.error("Error equipping item:", error);
    toast.error(`Failed to equip item: ${error.message}`);
    throw error;
  }
}

export async function transferItem(
  itemReferenceHash: number,
  stackSize: number,
  transferToVault: boolean,
  itemId: string,
  characterId: string,
  membershipType: number,
) {
  try {
    const request: DestinyItemTransferRequest = {
      itemReferenceHash,
      stackSize,
      transferToVault,
      itemId,
      characterId,
      membershipType,
    };

    const response = await fetch("/api/d2/item-actions/transfer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to transfer item: ${errorText}`);
    }

    const data = await response.json();
    toast.success("Item transferred successfully");
    return data;
  } catch (error) {
    console.error("Error transferring item:", error);
    toast.error(`${error.message}`);
    throw error;
  }
}

export async function equipItems(
  itemIds: string[],
  characterId: string,
  membershipType: number,
) {
  try {
    const request: DestinyItemSetActionRequest = {
      itemIds,
      characterId,
      membershipType,
    };

    const response = await fetch("/api/d2/item-actions/equip-all", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to equip items: ${errorText}`);
    }

    const data = await response.json();
    toast.success("Items equipped successfully");
    return data;
  } catch (error) {
    console.error("Error equipping items:", error);
    toast.error(`${error.message}`);
    throw error;
  }
}
