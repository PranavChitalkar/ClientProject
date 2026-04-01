import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import {
  addOrderPaymentRecord,
  addProductRecord,
  addRunningWorkRecord,
  addWebsiteWorkRecord,
  getDashboardData,
  getDashboardDemoData,
  isMongoConfigured,
  markPaymentReceivedRecord,
  removeProductRecord,
  removeWebsiteWorkRecord,
  seedDashboardData,
} from "@/lib/dashboard-data";

export const dynamic = "force-dynamic";

type DashboardAction =
  | "seedDemoData"
  | "addProduct"
  | "removeProduct"
  | "addWebsiteWork"
  | "removeWebsiteWork"
  | "addRunningWork"
  | "addOrderPayment"
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
      case "addOrderPayment":
        await addOrderPaymentRecord(body.payload as never);
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
