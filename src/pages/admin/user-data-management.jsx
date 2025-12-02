import { useEffect, useRef, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { Trash2, Upload } from "lucide-react";
import Image from "next/image";

/* Use the bucket you already have in Supabase */
const BUCKET = "portfolio";

export default function UserDataManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [mode, setMode] = useState("list"); // list | create | edit
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  async function getCurrentUser() {
    try {
      const maybe = await supabase.auth.getUser?.();
      if (maybe?.data?.user) return maybe.data.user;
    } catch (e) {}
    try {
      return supabase.auth.user?.() ?? null;
    } catch (e) {
      return null;
    }
  }

  async function loadUsers() {
    setLoading(true);
    try {
      // prefer active users first so UI shows the active user on top
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("is_active", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("loadUsers error", error);
        setUsers([]);
        setLoading(false);
        return;
      }
      const rows = data || [];

      // convert avatar_path -> avatar_url (signed) when needed
      const processed = await Promise.all(
        rows.map(async (u) => {
          if (u.avatar_url) return u;
          if (!u.avatar_path) return u;
          try {
            const { data: d, error: e } = await supabase.storage
              .from(BUCKET)
              .createSignedUrl(u.avatar_path, 60 * 60);
            if (e) {
              console.warn("createSignedUrl err for", u.id, e);
              return { ...u, avatar_url: null };
            }
            const url = d?.signedUrl ?? d?.signedURL ?? null;
            return { ...u, avatar_url: url };
          } catch (err) {
            console.warn("signed url err", err);
            return { ...u, avatar_url: null };
          }
        })
      );

      setUsers(processed);
    } catch (err) {
      console.error("loadUsers caught err", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  // ---------- CREATE / UPDATE ----------
  async function handleCreate(form) {
    setSubmitting(true);
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error("Not signed in. Please sign in first.");

      let avatar_path = form.avatarFilePath || null;
      let avatar_url = form.avatarUrl || null;

      if (form.avatarFile) {
        setUploadingAvatar(true);
        const file = form.avatarFile;
        const path = `${user.id}_${Date.now()}_${file.name.replace(
          /\s/g,
          "_"
        )}`;
        const up = await supabase.storage.from(BUCKET).upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });
        setUploadingAvatar(false);
        if (up.error) throw up.error;
        avatar_path = path;
        const { data: signedData, error: signedErr } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(path, 60 * 60);
        avatar_url =
          !signedErr && signedData?.signedUrl ? signedData.signedUrl : null;
      }

      // determine if this should be active: make first user active automatically
      const isFirst = users.length === 0;
      const payload = buildPayloadFromForm(form, { avatar_path, avatar_url });
      payload.auth_id = user.id;
      payload.is_active = !!isFirst;

      const res = await supabase.from("users").insert([payload]).select();
      if (res.error) throw res.error;

      // if created user is active and not the only one (rare), ensure others are inactive.
      if (payload.is_active) {
        // set all other users to false (safety)
        await supabase
          .from("users")
          .update({ is_active: false })
          .ne("id", res.data[0].id);
        await supabase
          .from("users")
          .update({ is_active: true })
          .eq("id", res.data[0].id);
      }

      await loadUsers();
      closeModal();
      alert("User created");
    } catch (err) {
      console.error("create user error", err);
      alert("Create failed: " + (err?.message || err));
    } finally {
      setSubmitting(false);
      setUploadingAvatar(false);
    }
  }

  async function handleUpdate(form) {
    if (!editing) return alert("No user selected");
    setSubmitting(true);
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error("Not signed in. Please sign in first.");

      if (editing.auth_id && editing.auth_id !== user.id) {
        // optional permission guard
        throw new Error("You can only update your own profile.");
      }

      let avatar_path = editing.avatar_path ?? null;
      let avatar_url = editing.avatar_url ?? null;

      if (form.avatarFile) {
        setUploadingAvatar(true);
        if (avatar_path) {
          try {
            await supabase.storage.from(BUCKET).remove([avatar_path]);
          } catch (e) {
            console.warn("previous avatar delete failed", e);
          }
        }
        const file = form.avatarFile;
        const path = `${
          editing.id ?? user.id
        }_${Date.now()}_${file.name.replace(/\s/g, "_")}`;
        const up = await supabase.storage.from(BUCKET).upload(path, file, {
          cacheControl: "3600",
          upsert: false,
        });
        setUploadingAvatar(false);
        if (up.error) throw up.error;
        avatar_path = path;
        const { data: signedData, error: signedErr } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(path, 60 * 60);
        avatar_url =
          !signedErr && signedData?.signedUrl ? signedData.signedUrl : null;
      } else if (form.avatarUrl && form.avatarUrl !== editing.avatar_url) {
        avatar_url = form.avatarUrl;
      }

      const payload = buildPayloadFromForm(form, { avatar_path, avatar_url });
      payload.auth_id = editing.auth_id ?? user.id;

      const res = await supabase
        .from("users")
        .update(payload)
        .eq("id", editing.id)
        .select();

      if (res.error) throw res.error;

      await loadUsers();
      closeModal();
      alert("User updated");
    } catch (err) {
      console.error("update user error", err);
      alert("Update failed: " + (err?.message || err));
    } finally {
      setSubmitting(false);
      setUploadingAvatar(false);
    }
  }

  // ---------- ACTIVATE (enforce single active user) ----------
  async function setActiveUser(u) {
    if (!u || !u.id) return;
    try {
      const current = await getCurrentUser();
      if (!current) throw new Error("Not signed in.");

      setLoading(true);

      // 1) get all IDs (this gives us a WHERE clause to use)
      const { data: idsData, error: idsErr } = await supabase
        .from("users")
        .select("id");
      if (idsErr) throw idsErr;

      const ids = (idsData || []).map((r) => r.id).filter(Boolean);

      // 2) set is_active = false for all existing ids (use .in)
      if (ids.length > 0) {
        const { error: offErr } = await supabase
          .from("users")
          .update({ is_active: false })
          .in("id", ids);
        if (offErr) throw offErr;
      }

      // 3) set selected user active
      const { error: onErr } = await supabase
        .from("users")
        .update({ is_active: true })
        .eq("id", u.id);

      if (onErr) throw onErr;

      await loadUsers();
      alert(`${u.name || "User"} is now active`);
    } catch (err) {
      console.error("setActiveUser error", err);
      alert("Activate failed: " + (err?.message || err));
    } finally {
      setLoading(false);
    }
  }

  // ---------- DELETE ----------
  async function handleDelete(u, e) {
    e?.stopPropagation?.();
    if (!confirm("Delete this user?")) return;
    try {
      // attempt to delete avatar file from storage (best-effort)
      if (u.avatar_path) {
        try {
          await supabase.storage.from(BUCKET).remove([u.avatar_path]);
        } catch (err) {
          console.warn("avatar remove failed", err);
        }
      }

      const { error } = await supabase.from("users").delete().eq("id", u.id);
      if (error) throw error;

      // if deleted user was active, promote another user (first one) to active
      if (u.is_active) {
        const { data: remaining } = await supabase
          .from("users")
          .select("id")
          .order("created_at", { ascending: false })
          .limit(1);

        if (remaining && remaining.length > 0) {
          const promoteId = remaining[0].id;
          await supabase
            .from("users")
            .update({ is_active: true })
            .eq("id", promoteId);
        }
      }

      await loadUsers();
      if (editing?.id === u.id) closeModal();
      alert("Deleted");
    } catch (err) {
      console.error("delete user err", err);
      alert("Delete failed: " + (err?.message || err));
    }
  }

  function openCreate() {
    setEditing(null);
    setMode("create");
  }
  function openEdit(u) {
    setEditing(u);
    setMode("edit");
  }
  function closeModal() {
    setEditing(null);
    setMode("list");
  }

  return (
    <div>
      <div className="flex items-center mb-5">
        <h2 className="text-main text-xl font-semibold">
          User Data Management
        </h2>
        <button
          onClick={openCreate}
          className="bg-primary py-2 px-3 rounded-full font-medium ml-auto block"
        >
          + New User
        </button>
      </div>

      <ul style={{ padding: 0 }}>
        {loading ? (
          <li className="text-subtle">Loading...</li>
        ) : users.length === 0 ? (
          <li className="text-subtle">No users yet</li>
        ) : (
          users.map((u) => (
            <li
              key={u.id}
              onClick={() => openEdit(u)}
              className="border border-stroke mb-3 flex items-center justify-between p-3 rounded-lg cursor-pointer bg-background hover:bg-[#2b2b2d]"
            >
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-md overflow-hidden bg-[#0f0f10] flex items-center justify-center">
                  {u.avatar_url ? (
                    <Image
                      src={u.avatar_url}
                      alt={u.name || "avatar"}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-subtle">
                      {(u.name || "U").charAt(0)}
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-main font-medium capitalize">
                    {u.name || "—"}{" "}
                    {u.is_active && (
                      <span className="ml-2 text-xs px-2 py-0.5 rounded bg-green-600 text-white">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="text-subtle text-xs mt-1">
                    {u.email || "—"} {u.phone ? `• ${u.phone}` : ""}
                  </div>

                  <div className=" flex gap-2 flex-wrap mt-2">
                    {(u.roles || []).slice(0, 5).map((r) => (
                      <span
                        key={r}
                        className="text-xs px-2 py-0.5 rounded bg-zinc-800 border border-stroke"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!u.is_active && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveUser(u);
                    }}
                    className="px-3 py-1 rounded-md border border-stroke text-sm"
                  >
                    Activate
                  </button>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(u, e);
                  }}
                  className="bg-red-600 p-2 rounded-md text-white"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))
        )}
      </ul>

      {(mode === "create" || mode === "edit") && (
        <Modal onClose={closeModal}>
          <UserForm
            mode={mode}
            initial={editing}
            onCancel={closeModal}
            onCreate={handleCreate}
            onUpdate={handleUpdate}
            submitting={submitting || uploadingAvatar}
          />
        </Modal>
      )}
    </div>
  );
}

/* ---------- Helper: build payload from form inputs ---------- */
function buildPayloadFromForm(
  form,
  { avatar_path = null, avatar_url = null } = {}
) {
  const payload = {
    name: form.name?.trim() || null,
    email: form.email?.trim() || null,
    phone: form.phone?.trim() || null,
    birthday: form.birthday || null,
    profile_titles: (form.profile_titles || []).filter(Boolean),
    profile_summaries: (form.profile_summaries || []).filter(Boolean),
    roles: (form.roles || []).filter(Boolean),
    location: {
      city: form.city || null,
      state: form.state || null,
      country: form.country || null,
    },
    socials: {
      github: form.github || null,
      linkedin: form.linkedin || null,
      twitter: form.twitter || null,
      instagram: form.instagram || null,
      facebook: form.facebook || null,
      website: form.website || null,
    },
    avatar_path: avatar_path || null,
    avatar_url: avatar_url || null,
    metadata: form.metadata || {},
  };
  Object.keys(payload).forEach((k) => {
    if (payload[k] === null) delete payload[k];
  });
  return payload;
}

/* ---------- Modal component ---------- */
function Modal({ children, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => onClose && onClose()}
      />
      <div className="relative z-10 w-full max-w-3xl p-6">
        <div className="bg-background border border-stroke rounded-lg p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
/* ---------- UserForm component ---------- */
function UserForm({ mode, initial, onCancel, onCreate, onUpdate, submitting }) {
  // basic fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");

  // profile titles / summaries / roles as arrays of strings (chips)
  const [profileTitles, setProfileTitles] = useState([]);
  const [titleInput, setTitleInput] = useState("");

  const [profileSummaries, setProfileSummaries] = useState([]);
  const [summaryInput, setSummaryInput] = useState("");

  const [roles, setRoles] = useState([]);
  const [roleInput, setRoleInput] = useState("");

  // location (structured)
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [country, setCountry] = useState("");

  // socials
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [website, setWebsite] = useState("");

  // avatar (file upload OR remote url)
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarFilePath, setAvatarFilePath] = useState(null); // existing storage path
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const avatarRef = useRef(null);
  const createdBlobsRef = useRef([]);

  useEffect(() => {
    if (initial) {
      setName(initial.name || "");
      setEmail(initial.email || "");
      setPhone(initial.phone || "");
      setBirthday(initial.birthday || "");

      setProfileTitles(
        Array.isArray(initial.profile_titles) ? initial.profile_titles : []
      );
      setProfileSummaries(
        Array.isArray(initial.profile_summaries)
          ? initial.profile_summaries
          : []
      );
      setRoles(Array.isArray(initial.roles) ? initial.roles : []);

      setCity((initial.location && initial.location.city) || "");
      setStateVal((initial.location && initial.location.state) || "");
      setCountry((initial.location && initial.location.country) || "");

      setGithub((initial.socials && initial.socials.github) || "");
      setLinkedin((initial.socials && initial.socials.linkedin) || "");
      setTwitter((initial.socials && initial.socials.twitter) || "");
      setInstagram((initial.socials && initial.socials.instagram) || "");
      setFacebook((initial.socials && initial.socials.facebook) || "");
      setWebsite((initial.socials && initial.socials.website) || "");

      setAvatarFile(null);
      setAvatarFilePath(initial.avatar_path || null);
      setAvatarUrl(initial.avatar_url || null);
      setAvatarPreview(initial.avatar_url || null);
    } else {
      setName("");
      setEmail("");
      setPhone("");
      setBirthday("");
      setProfileTitles([]);
      setProfileSummaries([]);
      setRoles([]);
      setCity("");
      setStateVal("");
      setCountry("");
      setGithub("");
      setLinkedin("");
      setTwitter("");
      setInstagram("");
      setFacebook("");
      setWebsite("");
      setAvatarFile(null);
      setAvatarFilePath(null);
      setAvatarUrl(null);
      setAvatarPreview(null);
    }

    // cleanup on unmount
    return () => {
      try {
        createdBlobsRef.current.forEach((u) => {
          if (u && u.startsWith("blob:")) URL.revokeObjectURL(u);
        });
      } catch (e) {}
      createdBlobsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  function triggerAvatarPicker() {
    avatarRef.current?.click();
  }

  function onAvatarFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    // revoke previous blob preview
    if (
      avatarPreview &&
      typeof avatarPreview === "string" &&
      avatarPreview.startsWith("blob:")
    ) {
      try {
        URL.revokeObjectURL(avatarPreview);
      } catch (e) {}
    }
    setAvatarFile(f);
    const url = URL.createObjectURL(f);
    createdBlobsRef.current.push(url);
    setAvatarPreview(url);
    setAvatarFilePath(null);
    setAvatarUrl(null);
  }

  function onAvatarUrlChange(e) {
    setAvatarUrl(e.target.value || null);
    setAvatarFile(null);
    setAvatarPreview(e.target.value || null);
    setAvatarFilePath(null);
  }

  // chips helpers
  function addTitleFromInput(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const v = (titleInput || "").trim();
      if (v && !profileTitles.includes(v)) setProfileTitles((s) => [...s, v]);
      setTitleInput("");
    }
  }
  function removeTitle(t) {
    setProfileTitles((s) => s.filter((x) => x !== t));
  }

  function addSummaryFromInput(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const v = (summaryInput || "").trim();
      if (v && !profileSummaries.includes(v))
        setProfileSummaries((s) => [...s, v]);
      setSummaryInput("");
    }
  }
  function removeSummary(s) {
    setProfileSummaries((arr) => arr.filter((x) => x !== s));
  }

  function addRoleFromInput(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      const v = (roleInput || "").trim();
      if (v && !roles.includes(v)) setRoles((s) => [...s, v]);
      setRoleInput("");
    }
  }
  function removeRole(r) {
    setRoles((arr) => arr.filter((x) => x !== r));
  }

  async function submit() {
    const form = {
      name,
      email,
      phone,
      birthday: birthday || null,
      profile_titles: profileTitles,
      profile_summaries: profileSummaries,
      roles,
      city,
      state: stateVal,
      country,
      github,
      linkedin,
      twitter,
      instagram,
      facebook,
      website,
      avatarFile,
      avatarFilePath,
      avatarUrl,
    };

    if (mode === "create") {
      await onCreate(form);
    } else {
      await onUpdate(form);
    }
  }

  return (
    <div className="max-h-[80vh] overflow-auto hide-scrollbar p-1">
      <h3 className="text-main mb-4 text-xl font-semibold">
        {mode === "create" ? "Create User" : "Update User"}
      </h3>
      <div className="bg-primary w-10 h-[5px] rounded-full my-5" />

      <div className="flex flex-col gap-y-8">
        <div>
          <label className="text-subtle block mb-1 text-sm">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 rounded bg-transparent border border-stroke text-main"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="text-subtle block mb-1 text-sm">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded bg-transparent border border-stroke text-main"
            />
          </div>

          <div className="w-48">
            <label className="text-subtle block mb-1 text-sm">Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-2 rounded bg-transparent border border-stroke text-main"
            />
          </div>
        </div>

        <div className="flex justify-between items-start m-[-.76rem]">
          <div className="col-6">
            <label className="text-subtle block mb-1 text-sm">Birthday</label>
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="p-2 rounded bg-transparent border border-stroke text-main w-full"
            />
          </div>

          {/* Titles */}
          <div className="col-6">
            <label className="text-subtle block mb-1 text-sm">
              Profile Titles (press Enter to add)
            </label>
            <div className="min-h-[44px] border border-stroke rounded p-2 flex items-center gap-2 flex-wrap bg-[#1e1e1f]">
              {profileTitles.length === 0 ? (
                <span className="text-subtle text-sm">No titles</span>
              ) : (
                profileTitles.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-1 text-subtle rounded bg-zinc-800 border border-stroke flex items-center gap-2"
                  >
                    {t}
                    <button
                      onClick={() => removeTitle(t)}
                      className="ml-1 text-subtle"
                    >
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
            <input
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onKeyDown={addTitleFromInput}
              placeholder="Add title and press Enter"
              className="mt-2 p-2 rounded bg-transparent border border-stroke w-full text-subtle"
            />
          </div>
        </div>

        {/* Summaries */}
        <div>
          <label className="text-subtle block mb-1 text-sm">
            Profile Summaries (press Enter to add)
          </label>
          <div className="min-h-[44px] border border-stroke rounded p-2 flex items-center gap-2 flex-wrap bg-[#1e1e1f]">
            {profileSummaries.length === 0 ? (
              <span className="text-subtle text-sm">No summaries</span>
            ) : (
              profileSummaries.map((s) => (
                <span
                  key={s}
                  className="text-xs px-2 py-1 text-subtle rounded bg-zinc-800 border border-stroke flex items-center gap-2"
                >
                  {s}
                  <button
                    onClick={() => removeSummary(s)}
                    className="ml-1 text-subtle"
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>
          <input
            value={summaryInput}
            onChange={(e) => setSummaryInput(e.target.value)}
            onKeyDown={addSummaryFromInput}
            placeholder="Add summary and press Enter"
            className="mt-2 p-2 rounded bg-transparent border text-subtle border-stroke w-full"
          />
        </div>

        {/* Roles */}
        <div>
          <label className="text-subtle block mb-1 text-sm">
            Roles (press Enter to add)
          </label>
          <div className="min-h-[44px] border border-stroke rounded p-2 flex items-center gap-2 flex-wrap bg-[#1e1e1f]">
            {roles.length === 0 ? (
              <span className="text-subtle text-sm">No roles</span>
            ) : (
              roles.map((r) => (
                <span
                  key={r}
                  className="text-xs px-2 py-1 text-subtle rounded bg-zinc-800 border border-stroke flex items-center gap-2"
                >
                  {r}
                  <button
                    onClick={() => removeRole(r)}
                    className="ml-1 text-subtle"
                  >
                    ×
                  </button>
                </span>
              ))
            )}
          </div>
          <input
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
            onKeyDown={addRoleFromInput}
            placeholder="Add role and press Enter"
            className="mt-2 p-2 rounded bg-transparent border text-subtle border-stroke w-full"
          />
        </div>

        {/* Location */}
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="text-subtle block mb-1 text-sm">City</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2 rounded bg-transparent border border-stroke text-main"
            />
          </div>
          <div className="flex-1">
            <label className="text-subtle block mb-1 text-sm">State</label>
            <input
              value={stateVal}
              onChange={(e) => setStateVal(e.target.value)}
              className="w-full p-2 rounded bg-transparent border border-stroke text-main"
            />
          </div>
          <div className="w-48">
            <label className="text-subtle block mb-1 text-sm">Country</label>
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full p-2 rounded bg-transparent border border-stroke text-main"
            />
          </div>
        </div>

        {/* Socials */}
        <div>
          <label className="text-subtle block mb-1 text-sm">Socials</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              placeholder="GitHub URL"
              className="p-2 rounded bg-transparent border border-stroke text-subtle"
            />
            <input
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              placeholder="LinkedIn URL"
              className="p-2 rounded bg-transparent border border-stroke text-subtle"
            />
            <input
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="Twitter URL"
              className="p-2 rounded bg-transparent border border-stroke text-subtle"
            />
            <input
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="Instagram URL"
              className="p-2 rounded bg-transparent border border-stroke text-subtle"
            />
            <input
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="Facebook URL"
              className="p-2 rounded bg-transparent border border-stroke text-subtle"
            />
            <input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="Website URL"
              className="p-2 rounded bg-transparent border border-stroke text-subtle"
            />
          </div>
        </div>

        {/* Avatar upload */}
        <div>
          <label className="text-subtle block mb-1 text-sm">
            Profile Picture (upload or paste URL)
          </label>
          <input
            ref={avatarRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onAvatarFileChange}
          />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={triggerAvatarPicker}
              className="flex items-center gap-2 px-4 py-2 rounded-md border border-dashed border-stroke text-subtle bg-transparent hover:bg-zinc-800"
            >
              <Upload size={16} />
              <span className="text-sm">Upload</span>
            </button>

            <input
              value={avatarUrl || ""}
              onChange={onAvatarUrlChange}
              placeholder="Paste direct image URL (optional)"
              className="flex-1 p-2 rounded bg-transparent border border-stroke text-subtle"
            />

            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="preview"
                className="w-16 h-16 rounded-md object-cover bg-[#0f0f10] p-1"
              />
            )}
          </div>

          <p className="text-xs text-subtle mt-1">
            If both upload and URL provided, upload will be used.
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <button
          onClick={submit}
          disabled={submitting}
          className="bg-primary py-2 px-4 rounded-full"
        >
          {submitting
            ? "Saving..."
            : mode === "create"
            ? "Create User"
            : "Update User"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="py-2 px-4 rounded-full border border-stroke text-subtle"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
