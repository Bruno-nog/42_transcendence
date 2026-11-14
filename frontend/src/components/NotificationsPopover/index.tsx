"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/src/components/ui/Badge";
import { Bell, Heart, UserPlus, Users } from "lucide-react";
import {
	type UserNotifications,
	getNotifications,
	markAllNotificationsAsRead,
} from "@/src/services/auth/notifications";
import { toast } from "react-hot-toast";
import { useFormatter, useTranslations } from "next-intl";

const typeConfig = {
	follow: { icon: UserPlus, color: "text-sky-400 bg-sky-400/10"},
	like: { icon: Heart, color: "text-rose-400 bg-rose-400/10"},
	friend: { icon: Users, color: "text-emerald-400 bg-emerald-400/10"},
}

export function NotificationsPopover () {
	const [ isOpen, setIsOpen ] = useState(false);
	const [notifications, setNotifications] = useState<UserNotifications | null>(null);
	const [isMarkingRead, setIsMarkingRead] = useState(false);
	const t = useTranslations("Notifications");
	const format = useFormatter();
	
	useEffect(() => {
		async function loadNotifications() {
			try {
				const response = await getNotifications();
				setNotifications(response);
			} catch(error) {
				console.log(error);
				toast.error(t('failed_to_load_notifications'));
			}
		}
		loadNotifications();
		const intervalId = setInterval(loadNotifications, 5000);
		return () => clearInterval(intervalId);
	}, [])

	
	function toggleState() {
		setIsOpen(prev => !prev);
	}

	async function handleMarkAllAsRead() {
		setIsMarkingRead(true);
		try {
			await markAllNotificationsAsRead();
			// A lista só mostra não lidas, então depois de marcar tudo ela fica vazia
			setNotifications(prev =>
				prev ? { ...prev, unread_total: 0, notifications: [] } : prev
			);
		} catch (error) {
			console.log(error);
			toast.error(t("failed_to_mark_read"));
		} finally {
			setIsMarkingRead(false);
		}
	}

	return (
		<div className="relative">
			<button type="button" onClick={toggleState}>
				<Badge
					variant="warning"
					size="lg"
					icon={<Bell size={20} />}>
							{ notifications?.unread_total }
				</Badge>
			</button>
			{isOpen && (
				<div className="absolute right-0 top-12 z-10 w-80 overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-xl">
						<div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
								<span className="text-sm font-semibold text-white">{t("title")}</span>
								{!!notifications?.unread_total && (
										<span className="text-xs text-zinc-400">
												{t("unread", { count: notifications.unread_total })}
										</span>
								)}
						</div>

						{!!notifications?.unread_total && (
								<div className="flex justify-end border-b border-white/10 px-4 py-2">
										<button
												type="button"
												onClick={handleMarkAllAsRead}
												disabled={isMarkingRead}
												className="text-xs font-medium text-sky-400 transition-colors hover:text-sky-300 disabled:cursor-not-allowed disabled:opacity-50"
										>
												{t("mark_all_read")}
										</button>
								</div>
						)}

						<ul className="max-h-96 overflow-y-auto">
								{notifications?.notifications.map((notification) => {
										const { icon: Icon, color } = typeConfig[notification.message];

										return (
												<li
														key={notification.id}
														className="flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors hover:bg-white/5"
												>
														<span className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${color}`}>
																<Icon size={16} />
														</span>
														<div className="min-w-0 flex-1">
																<p className="text-sm text-zinc-300">
																		{t.rich(notification.message, {
																				name: notification.actor_name,
																				strong: (chunks) => <strong className="font-semibold text-white">{chunks}</strong>,
																		})}
																</p>
																<time dateTime={notification.created_at} className="text-xs text-zinc-500">
																		{format.relativeTime(new Date(notification.created_at + "Z"), new Date())}
																</time>
														</div>
												</li>
										);
								})}

								{!notifications?.notifications.length && (
										<li className="px-4 py-8 text-center text-sm text-zinc-500">{t("empty")}</li>
								)}
						</ul>
				</div>
			)}
		</div>
	);
}
