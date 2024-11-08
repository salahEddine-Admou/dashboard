import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

// Function to get store ID by store name
export const getStoreIdByStoreName = async (storeName: string): Promise<string | null> => {
  try {
    // Find the store with the given name
    const store = await prismadb.store.findUnique({
      where: {
        name: storeName,
      },
      select: {
        id: true, // Only select the ID to optimize the query
      },
    });

    // Return the store ID if found, otherwise null
    return store ? store.id : null;
  } catch (error) {
    console.error("[STORE_ID_BY_NAME]", error);
    throw new Error("Error fetching store ID by name");
  }
};

// API route handler to get store ID by name
export async function GET(
  req: Request,
  { params }: { params: { storeName: string } }
) {
  try {
    // Check if storeName is provided in params
    if (!params.storeName) {
      return new NextResponse("Store name is required", { status: 400 });
    }

    // Fetch the store ID by name
    const storeId = await getStoreIdByStoreName(params.storeName);

    // Check if the store ID was found
    if (!storeId) {
      return new NextResponse("Store not found", { status: 404 });
    }

    // Return the store ID
    return NextResponse.json({ storeId });
  } catch (error) {
    console.log("[STORE_ID_BY_NAME_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
