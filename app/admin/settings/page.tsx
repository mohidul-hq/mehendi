"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface SocialLink {
  platform: string;
  url: string;
  isActive: boolean;
}

interface Settings {
  phone: string;
  socialLinks: SocialLink[];
}

const DEFAULT_PLATFORMS = ["WhatsApp", "Instagram", "Facebook", "YouTube", "Email", "Twitter", "Other"];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>({ phone: "", socialLinks: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        if (data.settings) {
          setSettings(data.settings);
        }
      } catch (err) {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed to save");
      toast.success("Settings saved successfully!");
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  function addSocialLink() {
    setSettings((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: "Instagram", url: "", isActive: true }],
    }));
  }

  function updateSocialLink(index: number, field: keyof SocialLink, value: any) {
    setSettings((prev) => {
      const newLinks = [...prev.socialLinks];
      newLinks[index] = { ...newLinks[index], [field]: value };
      return { ...prev, socialLinks: newLinks };
    });
  }

  function removeSocialLink(index: number) {
    setSettings((prev) => {
      const newLinks = [...prev.socialLinks];
      newLinks.splice(index, 1);
      return { ...prev, socialLinks: newLinks };
    });
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-10 w-48 rounded-xl" />
        <div className="skeleton h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-playfair text-2xl md:text-3xl font-bold text-burgundy-900">Site Settings</h1>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center justify-center gap-2 sm:w-auto w-full">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Settings
        </button>
      </div>

      <div className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-2xl shadow-card p-5 md:p-8">
          <h2 className="font-semibold text-gray-900 mb-4 text-lg">General Contact</h2>
          <div className="max-w-md">
            <label className="label">Primary Phone Number</label>
            <input
              type="text"
              className="input"
              placeholder="+91 300 1234567"
              value={settings.phone}
              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
            />
            <p className="text-xs text-gray-400 mt-2">This number is used for standard calls.</p>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-2xl shadow-card p-5 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 text-lg">Social Media & Chat Links</h2>
            <button onClick={addSocialLink} className="text-gold-600 hover:text-gold-700 text-sm font-medium flex items-center gap-1">
              <Plus size={16} /> Add Link
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Configure your social links. These will appear in the website footer. The &quot;WhatsApp&quot; platform controls the floating chat button.
          </p>

          {settings.socialLinks.length === 0 ? (
            <div className="text-center py-8 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              No social links added yet.
            </div>
          ) : (
            <div className="space-y-4">
              {settings.socialLinks.map((link, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-full md:w-1/4">
                    <label className="label md:hidden">Platform</label>
                    <select
                      className="input"
                      value={link.platform}
                      onChange={(e) => updateSocialLink(i, "platform", e.target.value)}
                    >
                      {DEFAULT_PLATFORMS.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex-1">
                    <label className="label md:hidden">URL / Number</label>
                    <input
                      type="text"
                      className="input"
                      placeholder={link.platform === "WhatsApp" ? "e.g. 923001234567 (No +)" : "e.g. https://instagram.com/..."}
                      value={link.url}
                      onChange={(e) => updateSocialLink(i, "url", e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-4 mt-2 md:mt-0 justify-between md:justify-start">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-gold-500 focus:ring-gold-500 w-4 h-4 cursor-pointer"
                        checked={link.isActive}
                        onChange={(e) => updateSocialLink(i, "isActive", e.target.checked)}
                      />
                      <span className="text-sm font-medium text-gray-700 select-none">Active</span>
                    </label>

                    <button
                      onClick={() => removeSocialLink(i)}
                      className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
