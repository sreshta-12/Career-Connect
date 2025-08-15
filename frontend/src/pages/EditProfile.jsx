import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link } from "react-router-dom";

export default function EditProfile() {
  const { api, user, setUser, wallet, connectWallet } = useAuth();
  const [form, setForm] = useState({
    name: "",
    bio: "",
    linkedin: "",
    skills: [],
    walletAddress: "",
  });
  const [skillsText, setSkillsText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        bio: user.bio || "",
        linkedin: user.linkedin || "",
        skills: user.skills || [],
        walletAddress: user.walletAddress || wallet.address || "",
      });
      setSkillsText((user.skills || []).join(", "));
    }
  }, [user, wallet.address]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setLoading(true);
    try {
      const skills =
        skillsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean) || [];
      const payload = { ...form, skills };
      const { data } = await api.put("/users/me", payload);
      setUser(data);
      alert("Profile updated!");
    } catch (e) {
      console.error(e);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const autoExtract = async () => {
    try {
      const { data } = await api.post("/users/extract-skills", { text: form.bio });
      const skills = data.skills || [];
      setForm((f) => ({ ...f, skills }));
      setSkillsText(skills.join(", "));
    } catch (e) {
      console.error(e);
      alert("Skill extraction failed");
    }
  };

  const useWalletAddress = async () => {
    try {
      if (!wallet.connected) await connectWallet();
      update("walletAddress", wallet.address);
    } catch (e) {
      alert("Wallet connect failed");
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Edit Profile</h1>
        <Link to="/profile" className="underline">Back to Profile</Link>
      </div>

      <label className="block">
        <span className="text-sm">Name</span>
        <input
          className="mt-1 w-full rounded-xl border p-2"
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
        />
      </label>

      <label className="block">
        <span className="text-sm">LinkedIn URL</span>
        <input
          className="mt-1 w-full rounded-xl border p-2"
          placeholder="https://www.linkedin.com/in/your-handle"
          value={form.linkedin}
          onChange={(e) => update("linkedin", e.target.value)}
        />
      </label>

      <label className="block">
        <span className="text-sm">Bio</span>
        <textarea
          className="mt-1 w-full rounded-xl border p-2"
          rows="4"
          value={form.bio}
          onChange={(e) => update("bio", e.target.value)}
        />
      </label>

      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block">
            <span className="text-sm">Skills (comma-separated)</span>
            <input
              className="mt-1 w-full rounded-xl border p-2"
              placeholder="react, node, web3"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
            />
          </label>
        </div>
        <button onClick={autoExtract} className="rounded-2xl border px-3 py-2">
          Auto-extract
        </button>
      </div>

      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="block">
            <span className="text-sm">Wallet Address</span>
            <input
              className="mt-1 w-full rounded-xl border p-2"
              value={form.walletAddress}
              onChange={(e) => update("walletAddress", e.target.value)}
              placeholder="0x… / Phantom address"
            />
          </label>
        </div>
        <button onClick={useWalletAddress} className="rounded-2xl border px-3 py-2">
          Use connected wallet
        </button>
      </div>

      <button
        disabled={loading}
        onClick={save}
        className="rounded-2xl border px-4 py-2"
      >
        {loading ? "Saving…" : "Save"}
      </button>
    </div>
  );
}
