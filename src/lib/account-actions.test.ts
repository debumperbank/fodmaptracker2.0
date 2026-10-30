import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    throw new Error(`REDIRECT:${url}`);
  },
}));
vi.mock("@/lib/data", () => ({ requireUser: vi.fn() }));

import { requireUser } from "@/lib/data";
import { deleteOwnAccount, recordHealthConsent } from "@/lib/account-actions";
import { PRIVACY_NOTICE_VERSION } from "@/lib/privacy";

const userId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const otherUserId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

function deletionClient() {
  const removed: Record<string, string[]> = {};
  const rpc = vi.fn(async () => ({ error: null }));
  const signOut = vi.fn(async () => ({ error: null }));
  const update = vi.fn(() => ({ eq: vi.fn(async () => ({ error: null })) }));
  const supabase = {
    from(table: string) {
      return {
        select() {
          return { eq: async () => ({ data: [], error: null }) };
        },
        update: table === "profiles" ? update : undefined,
      };
    },
    storage: {
      from(bucket: string) {
        return {
          list: async () => ({ data: [{ name: "mine.webp" }, { name: "../nope.webp" }], error: null }),
          remove: async (paths: string[]) => {
            removed[bucket] = paths;
            return { error: null };
          },
        };
      },
    },
    rpc,
    auth: { signOut },
    update,
    removed,
  };
  return supabase;
}

async function redirectsTo(run: () => Promise<unknown>, url: string) {
  await expect(run()).rejects.toThrow(`REDIRECT:${url}`);
}

describe("deleteOwnAccount", () => {
  let supabase: ReturnType<typeof deletionClient>;

  beforeEach(() => {
    supabase = deletionClient();
    vi.mocked(requireUser).mockResolvedValue({ supabase, user: { id: userId } } as never);
  });

  it("does nothing privileged until the user types VERWIJDER", async () => {
    const form = new FormData();
    form.set("confirm_delete", "verwijder");
    form.set("user_id", otherUserId);
    await redirectsTo(() => deleteOwnAccount(form), "/profiel?error=verwijderen-bevestiging");
    expect(supabase.rpc).not.toHaveBeenCalled();
    expect(supabase.removed).toEqual({});
  });

  it("removes only this user's storage and deletes the session account, not an id from the form", async () => {
    const form = new FormData();
    form.set("confirm_delete", "VERWIJDER");
    form.set("user_id", otherUserId);
    await redirectsTo(() => deleteOwnAccount(form), "/account-verwijderen?message=verwijderd");
    expect(supabase.removed["meal-photos"]).toEqual([`${userId}/mine.webp`]);
    expect(supabase.removed["profile-photos"]).toEqual([`${userId}/mine.webp`]);
    expect(JSON.stringify(supabase.removed)).not.toContain(otherUserId);
    expect(supabase.rpc).toHaveBeenCalledTimes(1);
    expect(supabase.rpc).toHaveBeenCalledWith("delete_own_account");
    expect(supabase.rpc.mock.calls[0]).toHaveLength(1);
    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });
});

describe("recordHealthConsent", () => {
  it("stores the notice version on the signed-in profile only", async () => {
    const eq = vi.fn(async () => ({ error: null }));
    const update = vi.fn(() => ({ eq }));
    const supabase = { from: () => ({ update }) };
    vi.mocked(requireUser).mockResolvedValue({ supabase, user: { id: userId } } as never);
    const form = new FormData();
    form.set("health_consent", "yes");
    form.set("user_id", otherUserId);
    await redirectsTo(() => recordHealthConsent(form), "/profiel?message=toestemming");
    expect(update).toHaveBeenCalledWith(expect.objectContaining({ privacy_notice_version: PRIVACY_NOTICE_VERSION }));
    expect(eq).toHaveBeenCalledWith("id", userId);
    expect(eq).not.toHaveBeenCalledWith("id", otherUserId);
  });

  it("refuses to store consent when the checkbox is off", async () => {
    const supabase = { from: vi.fn() };
    vi.mocked(requireUser).mockResolvedValue({ supabase, user: { id: userId } } as never);
    await redirectsTo(() => recordHealthConsent(new FormData()), "/profiel?error=toestemming");
    expect(supabase.from).not.toHaveBeenCalled();
  });
});
