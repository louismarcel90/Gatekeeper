import { AdminUser } from "../domain/types";
import { CreateAdminUserInput } from "../domain/validators";
import { listAdminUsers } from "../infrastructure/admin-user-repository";
import { createAdminUser } from "../infrastructure/admin-user-write-repository";

export async function createAdminUserAccount(
  input: CreateAdminUserInput,
): Promise<Pick<AdminUser, "id" | "email" | "role" | "created_at">> {
  const created = await createAdminUser(input);

  return {
    id: created.id,
    email: created.email,
    role: created.role,
    created_at: created.created_at,
  };
}

export async function getAdminUsers(): Promise<
  Array<Pick<AdminUser, "id" | "email" | "role" | "created_at">>
> {
  const users = await listAdminUsers();

  return users.map((user) => ({
    id: user.id,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
  }));
}
