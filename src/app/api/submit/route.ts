import { NextResponse } from "next/server";
import { addSubmission } from "@/lib/db";
import { createSubmissionSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = createSubmissionSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.issues.map((e: any) => `${e.path.join('.')} ${e.message}`) },
        { status: 400 }
      );
    }
    const { name, url, description, category_id, price, tags } = validated.data;
    await addSubmission({ name, url, description, category_id, price: price || undefined, tags: tags || undefined });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
