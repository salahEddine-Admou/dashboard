import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { getStoreIdByStoreName } from "../route";


export async function GET(
  req: Request,
  { params }: { params: { storeName: string } }
) {
  try {
    // Check if storeName is provided in params
    if (!params.storeName) {
      return new NextResponse("Store name is required", { status: 400 });
    }

    // Get the store ID using the store name
    const storeId = await getStoreIdByStoreName(params.storeName);

    // Check if the store ID was found
    if (!storeId) {
      return new NextResponse("Store not found or unauthorized", { status: 404 });
    }

    // Retrieve the store details using the store ID
    const store = await prismadb.store.findUnique({
      where: {
        id: storeId,
      },
    });

    // Check if the store was found
    if (!store) {
      return new NextResponse("Store not found or unauthorized", { status: 404 });
    }

    // Return the store data
    return NextResponse.json(store);
  } catch (error) {
    console.log("[STORE_GET_BY_NAME]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}