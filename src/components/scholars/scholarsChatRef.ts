import { createRef } from "react";
import type { ChatWidgetRef } from "@/components/chat/ChatWidget";

export const scholarsChatRef = createRef<ChatWidgetRef>();

export function openScholarsChat() {
  scholarsChatRef.current?.openChat();
}
