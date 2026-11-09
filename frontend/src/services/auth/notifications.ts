import { api } from "@/src/lib/axios";

export interface UserNotifications {
	user_id: number;
	notifications_qty: number;
}

export async function getNotificationsQty(): Promise<number> {
	const response = await api.get<number>(
		"/notifications/quantity",
	);

	return response.data;
}