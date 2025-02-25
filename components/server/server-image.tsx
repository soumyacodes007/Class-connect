"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";

interface ServerImageProps {
  id: string;
  imageUrl: string;
  name: string;
};

export const ServerImage = ({
  id,
  imageUrl,
  name
}: ServerImageProps) => {
  const params = useParams();
  const router = useRouter();

  const onClick = () => {
    router.push(`/servers/${id}`);
  }

  return (
      <button
        onClick={onClick}
        className="group relative flex items-center"
      >
        <div className={cn(
          "relative group flex mx-3 h-[100px] w-[200px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden",
          params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]"
        )}>
          <Image
            fill
            src={imageUrl}
            alt="Channel"
          />
        </div>
      </button>
  )
}