import client from "@/lib/appwrite_client";
import { Databases } from "appwrite";
import { NextResponse } from "next/server";
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

// delete a specific blog.

async function deleteBlog(id: string) {
  try {
    const blog = await database.deleteDocument(
      process.env.APPWRITE_DATABASE_ID as string,
      "BlogID",
      id
    );
    return blog;
  } catch (error) {
    console.error("Failed to delete blog", error);
    throw new Error("Failed to delete blog");
  }
}

async function updateBlog(
  id: string,
  data: { title: string, description: string }
) {
  try {
    const blog = await database.updateDocument(
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

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      // Ensure params is awaited
      const id = params.id; // Await params
      const blog = await fetchBlog(id);
      return NextResponse.json({ blog });
    } catch (error) {
      return NextResponse.json({ error: "Failed to get blog" }, { status: 500 });
    }
  }
  
  export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      // Await params here as well
      const id = params.id;  // Await params
      await deleteBlog(id);
  
      return NextResponse.json({ message: "Blog deleted successfully." });
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to delete a blog" },
        { status: 500 }
      );
    }
  }
  
  export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      // Await params here too
      const id = params.id; // Await params
      const blog = await req.json();
      await updateBlog(id, blog);
      return NextResponse.json({ message: "Blog updated successfully." });
    } catch (error) {
      return NextResponse.json(
        { error: "Failed to update a blog" },
        { status: 500 }
      );
    }
  }