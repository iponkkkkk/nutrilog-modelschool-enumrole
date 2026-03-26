import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	useDeleteUser,
	useGetUsers,
	useUpdateUser,
} from "@/modules/user/hooks/useUser";

const ROLES = [
	"KITCHEN_STAFF",
	"WAREHOUSE_MANAGER",
	"SCHOOL_ADMIN",
	"VENDOR_MANAGER",
	"AUDITOR",
] as const;

export const Route = createFileRoute("/_authed/user/")({
	component: UserPage,
	staticData: {
		crumb: {
			module: "User",
			action: "Management",
			module_path: "/_authed/user",
		},
	},
});

type User = {
	id: string;
	email: string;
	name: string;
	role: string | null;
	school_id: string | null;
	created_at: string;
};

function UserPage() {
	const { data, isLoading } = useGetUsers();
	const updateUser = useUpdateUser();
	const deleteUser = useDeleteUser();

	const [openEdit, setOpenEdit] = useState(false);
	const [selectedUser, setSelectedUser] = useState<User | null>(null);
	const [selectedRole, setSelectedRole] = useState<string>("");

	const users = (data as { data: User[] })?.data ?? [];

	const handleUpdate = () => {
		if (!selectedUser) return;
		updateUser.mutate(
			{ id: selectedUser.id, data: { role: selectedRole } },
			{
				onSuccess: () => {
					toast.success("User updated!");
					setOpenEdit(false);
					setSelectedUser(null);
				},
				onError: () => toast.error("Failed to update user"),
			},
		);
	};

	const handleDelete = (id: string) => {
		if (!confirm("Are you sure you want to delete this user?")) return;
		deleteUser.mutate(id, {
			onSuccess: () => toast.success("User deleted!"),
			onError: () => toast.error("Failed to delete user"),
		});
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">User Management</h1>
			</div>
			{isLoading ? (
				<p>Loading...</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.map((user) => (
							<TableRow key={user.id}>
								<TableCell>{user.name}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>{user.role ?? "-"}</TableCell>
								<TableCell className="flex gap-2">
									<Dialog
										open={openEdit && selectedUser?.id === user.id}
										onOpenChange={(open) => {
											setOpenEdit(open);
											if (!open) setSelectedUser(null);
										}}
									>
										<DialogTrigger asChild>
											<Button
												variant="outline"
												size="sm"
												onClick={() => {
													setSelectedUser(user);
													setSelectedRole(user.role ?? "");
													setOpenEdit(true);
												}}
											>
												Edit Role
											</Button>
										</DialogTrigger>
										<DialogContent>
											<DialogHeader>
												<DialogTitle>Edit User Role</DialogTitle>
											</DialogHeader>
											<div className="flex flex-col gap-3">
												<p className="text-sm text-muted-foreground">
													{selectedUser?.email}
												</p>
												<Select
													value={selectedRole}
													onValueChange={setSelectedRole}
												>
													<SelectTrigger>
														<SelectValue placeholder="Select role" />
													</SelectTrigger>
													<SelectContent>
														{ROLES.map((role) => (
															<SelectItem key={role} value={role}>
																{role.replace(/_/g, " ")}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<Button
													onClick={handleUpdate}
													disabled={updateUser.isPending}
												>
													{updateUser.isPending ? "Saving..." : "Save Changes"}
												</Button>
											</div>
										</DialogContent>
									</Dialog>
									<Button
										variant="destructive"
										size="sm"
										onClick={() => handleDelete(user.id)}
										disabled={deleteUser.isPending}
									>
										Delete
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
