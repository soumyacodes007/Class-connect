"use client";

import * as z from "zod";
import axios from "axios";
import qs from "query-string";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useModal } from "@/hooks/use-modal-store";
import { EmojiPicker } from "@/components/emoji-picker";

interface AssignmentUploadProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
});

export const AssignmentUpload = ({
  apiUrl,
  query,
  name,
  type,
}: AssignmentUploadProps) => {
  const { onOpen } = useModal();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      });

      await axios.post(url, values);

      form.reset();
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6 group items-center justify-center">
                  <button
                    type="button"
                    onClick={() => onOpen("messageFile", { apiUrl, query })}
                    className="absolute top-[30px]
                     left-8 h-[30px] w-[30px] bg-black-500 dark:bg-white-400 group-hover:bg-neutral-800 dark:group-hover:bg-neutral-300 transition rounded-full p-1 flex items-center justify-center"
                  >
                    <Plus className="text-white dark:text-[#161616]" />
                  </button>
                  <div
                    onClick={() => onOpen("messageFile", { apiUrl, query })}
                    className="
                      px-14 
                      py-4
                      w-[280px]
                      cursor-pointer
                      rounded-full
                      
                      bg-black 
                      group-hover:bg-neutral-800
                      text-white

                      dark:text-black
                      dark:bg-white
                      dark:group-hover:bg-neutral-300

                      transition
                    "
                    
                  >
                    Submit assignment
                    
                  </div>
                  
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}