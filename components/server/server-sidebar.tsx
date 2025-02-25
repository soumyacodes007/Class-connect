import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import { MessageCircle, Mic, ShieldAlert, ShieldCheck, Video, PenSquare, Book } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";


import { ServerHeader } from "./server-header";
import { ServerSearch } from "./server-search";
import { ServerSection } from "./server-section";
import { ServerChannel } from "./server-channel";
import { ServerMember } from "./server-member";
import { ServerImage } from "./server-image";
import ServerAdmin from "./server-admin";
import ServerMods from "./server-mods";

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <MessageCircle className="mr-2 h-4 w-4"/>,
  [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
  [ChannelType.ASSIGNMENT]: <PenSquare className="mr-2 h-4 w-4" />,
  [ChannelType.MATERIALS]: <Book className="mr-2 h-4 w-4" />
};

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: <ShieldCheck className="h-4 w-4 mr-2 text-green-600"/>,
  [MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 mr-2 text-rose-500"/>
}


export const ServerSidebar = async ({
  serverId
}: ServerSidebarProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/");
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        }
      }
    }
  });

  const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)
  const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO)
  const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO)
  const assignmentChannels = server?.channels.filter((channel) => channel.type === ChannelType.ASSIGNMENT)
  const materialChannels = server?.channels.filter((channel) => channel.type === ChannelType.MATERIALS)

  const members = server?.members.filter((member) => member.profileId !== profile.id)

  const admin = server?.members.filter((member) => member.role === "ADMIN");
  const rep = server?.members.filter((member) => member.role === "MODERATOR");

  if (!server) {
    return redirect("/");
  }

  const role = server.members.find((member) => member.profileId === profile.id)?.role;

  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#0a0a0a] bg-[#F2F3F5]">
      <div className="mt-5">
        <ServerImage
          id={server.id}
          name={server.name}
          imageUrl={server.imageUrl}
        />
      </div>
      <div className="mt-2">
        <ServerHeader
          server={server}
          role={role}
        />
      </div>
      <div className="px-3">
        {!!admin?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              role={role}
              label="Teacher"
              server={server}
            />
            <div className="space-y-[2px]">
              {admin.map((person) => (
                <ServerMember
                  key={person.id}
                  member={person}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="px-3">
        {!!rep?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              role={role}
              label="Class representatives"
              server={server}
            />
            <div className="space-y-[2px]">
              {rep.map((person) => (
                <ServerMember
                  key={person.id}
                  member={person}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Rooms",
                type: "channel",
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                }))
              },
              {
                label: "Assignment Rooms",
                type: "channel",
                data: assignmentChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                }))
              },
              {
                label: "Material Rooms",
                type: "channel",
                data: materialChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                }))
              },
              {
                label: "Voice Rooms",
                type: "channel",
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                }))
              },
              {
                label: "Video Rooms",
                type: "channel",
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                }))
              },
              {
                label: "Members",
                type: "member",
                data: members?.map((member) => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: roleIconMap[member.role],
                }))
              },
            ]}
          />
        </div>
        <Separator className="bg-zinc-200 
        dark:bg-[#0a0a0a] rounded-md my-2" />
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
              label="Discussion"
            />
            <div className="space-y-[2px]">
              {textChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!assignmentChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.ASSIGNMENT}
              role={role}
              label="Assignments"
            />
            <div className="space-y-[2px]">
              {assignmentChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!materialChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.MATERIALS}
              role={role}
              label="Materials"
            />
            <div className="space-y-[2px]">
              {materialChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
              label="Voice Rooms"
            />
            <div className="space-y-[2px]">
              {audioChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
              label="Video Rooms"
            />
            <div className="space-y-[2px]">
              {videoChannels.map((channel) => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div>
        )}
        
      </ScrollArea>
    </div>
  )
}