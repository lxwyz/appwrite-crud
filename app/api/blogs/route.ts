import client from "@/lib/appwrite_client";
import { Databases, ID, Query } from "appwrite";
import { NextResponse } from "next/server";

const database = new Databases(client);

//Creae a blog.
async function createBlog(data: { title: string; description: string }) {
  try {
    const res = await database.createDocument(
      process.env.APPWRITE_DATABASE_ID as string,
      "BlogID",
      ID.unique(),
      data
    );

    return res;
  } catch (error) {
    console.error("Error creating blog", error);
    throw new Error("Failed to create blog");
  }
}

async function fetchBlog() {
  try {
    const res = await database.listDocuments(
      process.env.APPWRITE_DATABASE_ID as string,
      "BlogID",
      [Query.orderDesc("$createdAt")]
    );

    return res.documents;
  } catch (error) {
    console.error("Failed to fetch blog", error);
    throw new Error("Failed to fetch blog");
  }
}

export async function POST(req: Request) {
  try {
    const { title, description } = await req.json();
    const data = { title, description };
    const res = await createBlog(data);

    return NextResponse.json({ message: "Blog created successfully!!" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create a blog" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const blogs = await fetchBlog();
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
