import prismadb from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Change this in production to a specific domain
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

// Handle OPTIONS method for preflight requests
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { productIds } = await req.json();

    // Validate product IDs
    if (!productIds || productIds.length === 0) {
      return new NextResponse("Product IDs are required", { status: 400, headers: corsHeaders });
    }

    // Fetch products from the database
    const products = await prismadb.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    // Prepare line items for Stripe Checkout
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = products.map(product => ({
      quantity: 1,
      price_data: {
        currency: 'USD',
        product_data: {
          name: product.name,
        },
        unit_amount: product.price.toNumber() * 100, // Convert to cents
      },
    }));

    // Create an order in the database
    const order = await prismadb.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        orderItems: {
          create: productIds.map(productId => ({
            product: {
              connect: {
                id: productId,
              },
            },
          })),
        },
      },
    });

    // Create a Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
      metadata: {
        orderId: order.id,
      },
    });

    // Return the session URL in the response
    return NextResponse.json({ url: session.url }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error during checkout:", error); // Log error for debugging
    return new NextResponse("Internal Server Error", { status: 500, headers: corsHeaders });
  }
}
