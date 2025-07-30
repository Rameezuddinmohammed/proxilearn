"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTask(prevState: any, formData: FormData) {
  try {
    // Get the user ID from Clerk
    const { userId } = auth();
    if (!userId) {
      return { message: 'You must be logged in to create a task.' };
    }

    // Get the form data
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const dueDate = formData.get("due_date") as string;

    // Validate form data
    if (!title || !dueDate) {
      return { message: 'Title and due date are required.' };
    }

    // Create a Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Insert the data into the 'tasks' table
    const { data, error } = await supabase
      .from("tasks")
      .insert([
        {
          title: title,
          description: description,
          due_date: dueDate,
          teacher_id: userId,
        },
      ])
      .select();

    if (error) {
      console.error("Error creating task:", error);
      return { message: 'Failed to create task. Please try again.' };
    }

    // After creating the task, clear the cache for the dashboard
    revalidatePath("/dashboard");
    // And redirect the user back to the dashboard
    redirect("/dashboard");
    
    // This return is needed for TypeScript, but the redirect will prevent it from being reached
    return { message: 'Task created successfully!' };
  } catch (error) {
    console.error('Error in createTask:', error);
    return { message: 'An unexpected error occurred.' };
  }
}