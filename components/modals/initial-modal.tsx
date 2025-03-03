"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Classroom name is required."
  }),
  imageUrl: z.string().min(1, {
    message: "Classroom image is required."
  })
});

export const InitialModal = () => {
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageUrl: "",
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const loadingToast = toast.loading("Creating classroom...");
      
      console.log("Submitting form with values:", values);
      
      const response = await axios.post("/api/servers", values);
      console.log("Server response:", response.data);

      form.reset();
      router.refresh();
      
      toast.dismiss(loadingToast);
      toast.success("Classroom created successfully!");
      
      window.location.reload();
    } catch (error: any) {
      console.error("Error creating classroom:", error);
      toast.error(error?.response?.data || "Failed to create classroom");
    }
  }

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open>
      <DialogContent className="
          bg-white
          dark:bg-black 
          dark:text-white 
          text-black 
          p-0 
          overflow-hidden 
          border-none
        ">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Create Classroom
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Add a name and an image. You can always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="serverImage"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70"
                    >
                      Classroom name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="
                          bg-zinc-300/50 
                          dark:bg-[#151515]
                          border-0 focus:ring-0 
                          text-black 
                          dark:text-zinc-400
                          ring-offset-0 
                          focus:ring-offset-0 
                          capitalize 
                          outline-none
                        "
                        placeholder="Enter classroom name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 dark:bg-black px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}