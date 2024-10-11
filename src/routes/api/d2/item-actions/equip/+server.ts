import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { bngBaseUrl } from "$lib/utils/helpers";
import { BUNGIE_API_KEY } from "$env/static/private";
import type { DestinyItemActionRequest } from "$lib/utils/types";



export const POST: RequestHandler = async ({ request, fetch, cookies }) => {
  try {
    const { itemId, characterId, membershipType }: DestinyItemActionRequest =
      await request.json();

    if (itemId === undefined || !characterId || !membershipType) {
      return json({ error: "Missing required parameters" }, { status: 400 });
    }

    const accessToken = cookies.get("access_token");

    if (!accessToken) {
      return json({ error: "User not authenticated" }, { status: 401 });
    }

    const response = await fetch(
      `${bngBaseUrl}/Platform/Destiny2/Actions/Items/EquipItem/`,
      {
        method: "POST",
        headers: {
          "X-API-Key": BUNGIE_API_KEY,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          characterId,
          membershipType,
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      return json(
        { error: errorData.Message || "Failed to equip item" },
        { status: response.status },
      );
    }

    return json({ success: true });
  } catch (error) {
    console.error("Error equipping item:", error);
    return json({ error: "Internal server error" }, { status: 500 });
  }
};
