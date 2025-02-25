"use client";

import { useSocket } from "@/components/providers/socket-provider";
import { Badge } from "@/components/ui/badge";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return (
      <Badge 
        variant="outline" 
        className="bg-red-600 text-white border-none"
      >
        Retrying
      </Badge>
    )
  }

  return (
    <Badge 
      variant="outline" 
      className="bg-green-500 text-white border-none"
    >
      Active
    </Badge>
  )
}