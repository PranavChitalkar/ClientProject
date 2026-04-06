import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import {
  addCompletedWorkRecord,
  addOrderReceivedPaymentRecord,
  addOrderPaymentRecord,
  addProductRecord,
  addRunningWorkRecord,
  addRunningWorkPaymentRecord,
  addWebsiteWorkRecord,
  getDashboardData,
  getDashboardDemoData,
  isMongoConfigured,
  markPaymentReceivedRecord,
  removeProductRecord,
  removeWebsiteWorkRecord,
  seedDashboardData,
  updateStockItemQuantityRecord,
  updateCompletedWorkRecord,
} from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type DashboardAction =
  | "seedDemoData"
  | "addProduct"
  | "removeProduct"
  | "addWebsiteWork"
  | "removeWebsiteWork"
  | "addRunningWork"
  | "addCompletedWork"
  | "updateCompletedWork"
  | "addRunningWorkPayment"
  | "addOrderReceivedPayment"
  | "addOrderPayment"
  | "adjustStockItem"
  | "markPaymentReceived";

export async function GET() {
  try {
    const snapshot = await getDashboardData();

    return NextResponse.json({
      ok: true,
      mongoConfigured: isMongoConfigured,
      ...snapshot,
    });
  } catch (error) {
    const fallback = getDashboardDemoData();
    const message = error instanceof Error ? error.message : "Unable to load dashboard data.";

    return NextResponse.json(
      {
        ok: false,
        message,
        mongoConfigured: isMongoConfigured,
        ...fallback,
      },
      { status: isMongoConfigured ? 500 : 200 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      action?: DashboardAction;
      payload?: unknown;
    };

    if (!body.action) {
      return NextResponse.json({ ok: false, message: "Action is required." }, { status: 400 });
    }

    if (!isMongoConfigured) {
      return NextResponse.json(
        {
          ok: false,
          message: "MongoDB is not configured yet. Add MONGODB_URI in .env.local first.",
        },
        { status: 400 },
      );
    }

    switch (body.action) {
      case "seedDemoData":
        await seedDashboardData();
        break;
      case "addProduct":
        await addProductRecord(body.payload as never);
        break;
      case "removeProduct":
        await removeProductRecord((body.payload as { slug: string }).slug);
        break;
      case "addWebsiteWork":
        await addWebsiteWorkRecord(body.payload as never);
        break;
      case "removeWebsiteWork":
        await removeWebsiteWorkRecord((body.payload as { id: string }).id);
        break;
      case "addRunningWork":
        await addRunningWorkRecord(body.payload as never);
        break;
      case "addCompletedWork":
        await addCompletedWorkRecord(body.payload as never);
        break;
      case "updateCompletedWork":
        await updateCompletedWorkRecord(
          (body.payload as { originalProject: string }).originalProject,
          (body.payload as { originalClient: string }).originalClient,
          (body.payload as { work: never }).work,
        );
        break;
      case "addRunningWorkPayment":
        await addRunningWorkPaymentRecord(
          (body.payload as { project: string }).project,
          (body.payload as { client: string }).client,
          (body.payload as { amount: number }).amount,
        );
        break;
      case "addOrderPayment":
        await addOrderPaymentRecord(body.payload as never);
        break;
      case "addOrderReceivedPayment":
        await addOrderReceivedPaymentRecord(
          (body.payload as { orderId: string }).orderId,
          (body.payload as { amount: number }).amount,
        );
        break;
      case "adjustStockItem":
        await updateStockItemQuantityRecord(
          (body.payload as { item: string }).item,
          (body.payload as { adjustment: number }).adjustment,
        );
        break;
      case "markPaymentReceived":
        await markPaymentReceivedRecord((body.payload as { orderId: string }).orderId);
        break;
      default:
        return NextResponse.json({ ok: false, message: "Unsupported action." }, { status: 400 });
    }

    revalidatePath("/");
    revalidatePath("/admin/dashboard");
    revalidatePath("/products/[slug]", "page");

    const snapshot = await getDashboardData();

    return NextResponse.json({
      ok: true,
      mongoConfigured: true,
      ...snapshot,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update MongoDB data.";

    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
