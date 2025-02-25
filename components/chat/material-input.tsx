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

interface MaterialInputProps {
  apiUrl: string;
  query: Record<string, any>;
  name: string;
  type: "conversation" | "channel";
}

const formSchema = z.object({
  content: z.string().min(1),
});

export const MaterialInput = ({
  apiUrl,
  query,
  name,
  type,
}: MaterialInputProps) => {
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
        <div className="relative p-4 pb-6">
            <div className="
                    px-14 
                    py-4
                    rounded-full
                    bg-zinc-200/90 
                    dark:bg-zinc-700/75 
                    border-none 
                    border-0 
                    text-center
                    focus-visible:ring-0 
                    focus-visible:ring-offset-0 
                    text-zinc-600 
                    dark:text-zinc-200
                "
            >
                You can find relevant study materials here
            
            </div>
        </div>      
  )
}