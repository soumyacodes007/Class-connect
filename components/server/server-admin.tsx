"use client";

import { Member, MemberRole, Profile, Server } from "@prisma/client";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { UserAvatar } from "@/components/user-avatar";

interface ServerAdminProps {
    member: Member & { profile: Profile };
    server: Server;
}

const ServerAdmin = ({
    member,
    server
}: ServerAdminProps) => {
    const params = useParams();
    const router = useRouter();

    const onClick = () => {
        router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
    }

    return ( 
        <div>Teacher</div>
     );
}
 
export default ServerAdmin;