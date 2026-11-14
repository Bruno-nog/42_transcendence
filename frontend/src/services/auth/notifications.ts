import { api } from "@/src/lib/axios";

interface Notification {
	id: number;
	actor_id: number;
	actor_name: string;
	message: "follow" | "like" | "friend";
	created_at: string;
}

export interface UserNotifications {
	user_id: number;
	unread_total: number;
	notifications: Notification[];
}

export async function getNotifications(): Promise<UserNotifications> {
	const response = await api.get<UserNotifications>(
		"/notifications",
	);

	return response.data;
}

export async function markAllNotificationsAsRead(): Promise<void> {
	await api.patch("/notifications/read-all");
}