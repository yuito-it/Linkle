import { NextRequest, NextResponse } from "next/server";

import fs from "fs";
import path from "path";

const postScriptUrl = process.env.IMAGE_POST_SCRIPT_URL;

function fileToBase64(filePath: string) {
    const fileBuffer = fs.readFileSync(filePath);
    return fileBuffer.toString("base64");
}

async function uploadFile(filePath: string) {
    const fileName = path.basename(filePath);
    const base64Data = fileToBase64(filePath);

    const postData = {
        filename: fileName,
        body: base64Data,
    };

    try {
        const response = await fetch(postScriptUrl as string, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log("Response:", responseData);
    } catch (error) {
        throw new Error(error as string);
    }
}

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const clubId = formData.get('clubId');
    const file = formData.get('file') as File;

    const filePath = path.join("./.temp", file.name);
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, fileBuffer);
    try {
        await uploadFile(filePath);
    } catch (error) {
        fs.unlinkSync(filePath);
        return NextResponse.json({ message: "File uploaded but an error occurred during upload" }, { status: 500 });
    }
    fs.unlinkSync(filePath);
    return NextResponse.json({ message: "File uploaded" }, { status: 200 });
}

export async function GET(request: NextRequest) {
    const fileName = await request.nextUrl.searchParams.get("filename");
    const res = await fetch(`${postScriptUrl as string}?filename=${fileName}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    });
    const { url } = await res.json();
    return NextResponse.json({ url: url }, { status: 200 });
}

export async function DELETE(request: NextRequest) {
    const fileName = await request.nextUrl.searchParams.get("filename");
    const res = await fetch(`${postScriptUrl as string}?filename=${fileName}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
    });
    if (res.status !== 200) {
        return NextResponse.json({ message: "Error deleting file" }, { status: 500 });
    }
    return NextResponse.json({ message: "File deleted" }, { status: 200 });
}