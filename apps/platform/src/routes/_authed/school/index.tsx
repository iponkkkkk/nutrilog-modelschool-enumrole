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
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	useCreateSchool,
	useDeleteSchool,
	useGetSchools,
	useUpdateSchool,
} from "@/modules/school/hooks/useSchool";

export const Route = createFileRoute("/_authed/school/")({
	component: SchoolPage,
	staticData: {
		crumb: { module: "School", action: "List", module_path: "/_authed/school" },
	},
});

function SchoolPage() {
	const { data, isLoading } = useGetSchools();
	const createSchool = useCreateSchool();
	const updateSchool = useUpdateSchool();
	const deleteSchool = useDeleteSchool();

	const [openCreate, setOpenCreate] = useState(false);
	const [openEdit, setOpenEdit] = useState(false);
	const [selectedSchool, setSelectedSchool] = useState<{
		id: string;
		name: string;
		address: string;
	} | null>(null);
	const [form, setForm] = useState({ name: "", address: "" });

	const schools =
		(data as { data: { id: string; name: string; address: string }[] })?.data ??
		[];

	const handleCreate = () => {
		createSchool.mutate(form, {
			onSuccess: () => {
				toast.success("School created!");
				setOpenCreate(false);
				setForm({ name: "", address: "" });
			},
			onError: () => toast.error("Failed to create school"),
		});
	};

	const handleUpdate = () => {
		if (!selectedSchool) return;
		updateSchool.mutate(
			{ id: selectedSchool.id, data: form },
			{
				onSuccess: () => {
					toast.success("School updated!");
					setOpenEdit(false);
					setForm({ name: "", address: "" });
				},
				onError: () => toast.error("Failed to update school"),
			},
		);
	};

	const handleDelete = (id: string) => {
		if (!confirm("Are you sure you want to delete this school?")) return;
		deleteSchool.mutate(id, {
			onSuccess: () => toast.success("School deleted!"),
			onError: () => toast.error("Failed to delete school"),
		});
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">Schools</h1>
				<Dialog open={openCreate} onOpenChange={setOpenCreate}>
					<DialogTrigger asChild>
						<Button>Add School</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add New School</DialogTitle>
						</DialogHeader>
						<div className="flex flex-col gap-3">
							<Input
								placeholder="School name"
								value={form.name}
								onChange={(e) => setForm({ ...form, name: e.target.value })}
							/>
							<Input
								placeholder="Address"
								value={form.address}
								onChange={(e) => setForm({ ...form, address: e.target.value })}
							/>
							<Button onClick={handleCreate} disabled={createSchool.isPending}>
								{createSchool.isPending ? "Saving..." : "Save"}
							</Button>
						</div>
					</DialogContent>
				</Dialog>
			</div>

			{isLoading ? (
				<p>Loading...</p>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Address</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{schools.map(
							(school: { id: string; name: string; address: string }) => (
								<TableRow key={school.id}>
									<TableCell>{school.name}</TableCell>
									<TableCell>{school.address}</TableCell>
									<TableCell className="flex gap-2">
										<Dialog
											open={openEdit && selectedSchool?.id === school.id}
											onOpenChange={(open) => {
												setOpenEdit(open);
												if (!open) setSelectedSchool(null);
											}}
										>
											<DialogTrigger asChild>
												<Button
													variant="outline"
													size="sm"
													onClick={() => {
														setSelectedSchool(school);
														setForm({
															name: school.name,
															address: school.address,
														});
														setOpenEdit(true);
													}}
												>
													Edit
												</Button>
											</DialogTrigger>
											<DialogContent>
												<DialogHeader>
													<DialogTitle>Edit School</DialogTitle>
												</DialogHeader>
												<div className="flex flex-col gap-3">
													<Input
														placeholder="School name"
														value={form.name}
														onChange={(e) =>
															setForm({ ...form, name: e.target.value })
														}
													/>
													<Input
														placeholder="Address"
														value={form.address}
														onChange={(e) =>
															setForm({ ...form, address: e.target.value })
														}
													/>
													<Button
														onClick={handleUpdate}
														disabled={updateSchool.isPending}
													>
														{updateSchool.isPending
															? "Saving..."
															: "Save Changes"}
													</Button>
												</div>
											</DialogContent>
										</Dialog>
										<Button
											variant="destructive"
											size="sm"
											onClick={() => handleDelete(school.id)}
											disabled={deleteSchool.isPending}
										>
											Delete
										</Button>
									</TableCell>
								</TableRow>
							),
						)}
					</TableBody>
				</Table>
			)}
		</div>
	);
}
