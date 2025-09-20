// app/api/converse/route.ts
import { NextResponse } from "next/server";

const BASE_URL = process.env.API_URL;
if (!BASE_URL) {
  throw new Error("❌ API_URL is not defined in environment variables");
}

export type ConverseRequest = {
    email: string;
    message: string;
};

export type NormalResponse = {
    intent: "normal";
    response: string;
};

export type RecruitmentResponse = {
    intent: "recruitment";
    extracted_data: {
        industry: string | null;
        location: string | null;
        roles: string[];
        count: number | null;
        urgency: boolean;
    };
    recommendations: string;
};

export type ConverseResponse =
    | NormalResponse
    | RecruitmentResponse
    | {
        intent: string;
        response: string;
    };

export async function POST(req: Request) {
    try {
        const body: ConverseRequest = await req.json();

        console.log("Environment BASE_URL:", BASE_URL);
        console.log("Received /api/converse request:", body);

        const res = await fetch(`${BASE_URL}/converse`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            return NextResponse.json(
                { error: "Backend request failed", status: res.status },
                { status: res.status }
            );
        }

        const data: ConverseResponse = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error in /api/converse:", error);
        return NextResponse.json(
            { error: "Unexpected server error" },
            { status: 500 }
        );
    }
}
