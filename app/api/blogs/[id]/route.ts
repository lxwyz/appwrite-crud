import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/appwrite_client";
import { Databases } from "appwrite";

const database = new Databases(client);

// Fetch a specific blog.
async function fetchBlog(id: string) {
  try {
    const blog = await database.getDocument(
      process.env.APPWRITE_DATABASE_ID as string,
      "BlogID",
      id
    );
    return blog;
  } catch (error) {
    console.error("Failed to fetch blog", error);
    throw new Error("Failed to fetch blog");
  }
}

// Delete a specific blog.
async function deleteBlog(id: string) {
  try {
    await database.deleteDocument(
      process.env.APPWRITE_DATABASE_ID as string,
      "BlogID",
      id
    );
  } catch (error) {
    console.error("Failed to delete blog", error);
    throw new Error("Failed to delete blog");
  }
}

// Update a specific blog.
async function updateBlog(id: string, data: { title: string; description: string }) {
  try {
    await database.updateDocument(
      process.env.APPWRITE_DATABASE_ID as string,
      "BlogID",
      id,
      data
    );
  } catch (error) {
    console.error("Failed to update blog", error);
    throw new Error("Failed to update blog");
  }
}

export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params; // ✅ Corrected
    const blog = await fetchBlog(id);
    return NextResponse.json({ blog });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get blog" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params; // ✅ Corrected
    await deleteBlog(id);
    return NextResponse.json({ message: "Blog deleted successfully." });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params; // ✅ Corrected
    const blog = await req.json();
    await updateBlog(id, blog);
    return NextResponse.json({ message: "Blog updated successfully." });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}
