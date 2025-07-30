"use server";

import { createClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Define the shape of the state object for our form
interface FormState {
  message: string;
}

export async function createTask(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    // Get the user ID from Clerk
    const { userId } = auth();
    if (!userId) {
      return { message: "You must be logged in to create a task." };
    }

    // Get the form data
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const dueDate = formData.get("due_date") as string;

    // Basic validation
    if (!title || !dueDate) {
      return { message: "Title and due date are required." };
    }

    // This part is unchanged: it connects to and saves data in Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      // IMPORTANT: Use the SERVICE_ROLE key for server-side actions
      process.env.SUPABASE_SERVICE_ROLE_KEY! 
    );

    const { error } = await supabase.from("tasks").insert([
      {
        title: title,
        description: description,
        due_date: dueDate,
        teacher_id: userId,
      },
    ]);

    if (error) {
      console.error("Supabase error:", error);
      return { message: "Failed to create task in the database." };
    }

    // This function clears the cache for the dashboard page so the new task will appear
    revalidatePath("/dashboard");
  } catch (e) {
    console.error(e);
    return { message: "An unexpected error occurred." };
  }

  // If everything was successful, redirect the user back to the dashboard
  redirect("/dashboard");
}