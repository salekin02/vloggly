// src/components/EditProfileModal.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit02Icon, Camera01Icon } from "hugeicons-react";
import Image from "next/image";
import { useUserProfile } from "@/hook/useUsers";
import { useUpdateUserProfile } from "@/hook/useUpdateUserProfile";

interface ProfileData {
  name: string;
  location: string;
  instagram: string;
  x: string;
  tiktok: string;
  profilePicture?: File | null;
  profileBanner?: File | null;
  profilePicturePreview?: string | null;
  coverImagePreview?: string | null;
  bio?: string | null;
}

interface EditProfileModalProps {
  profilePicture: string;
  profileBanner: string;
}

export default function EditProfileModal({
  profilePicture,
  profileBanner,
}: EditProfileModalProps) {
  const { profile, isLoading: profileLoading } = useUserProfile();
  const {
    updateProfile,
    isLoading: updateLoading,
    error: updateError,
  } = useUpdateUserProfile();

  const [formData, setFormData] = useState<ProfileData>({
    name: "",
    location: "",
    instagram: "",
    x: "",
    tiktok: "",
    profilePicture: null,
    profileBanner: null,
    profilePicturePreview: null,
    coverImagePreview: null,
  });

  const [isOpen, setIsOpen] = useState(false); // State to control modal open/close

  const profilePictureInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile && !profileLoading) {
      setFormData({
        name: profile.name || "minju1",
        location: profile.location || "LA",
        instagram: profile.socialMediaLink?.instagram || "",
        x: profile.socialMediaLink?.x || "",
        tiktok: profile.socialMediaLink?.tiktok || "",
        profilePicture: null,
        profileBanner: null,
        profilePicturePreview: profile.profilePicture || profilePicture,
        coverImagePreview: profile.profileBanner || profileBanner,
      });
    }
  }, [profile, profileLoading, profilePicture, profileBanner]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (formData.profilePicturePreview) {
        URL.revokeObjectURL(formData.profilePicturePreview);
      }
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        profilePicture: file,
        profilePicturePreview: previewUrl,
      }));
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (formData.coverImagePreview) {
        URL.revokeObjectURL(formData.coverImagePreview);
      }
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        profileBanner: file,
        coverImagePreview: previewUrl,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      location: formData.location,
      socialMediaLink: {
        instagram: formData.instagram,
        x: formData.x,
        tiktok: formData.tiktok,
      },
      profilePicture: formData.profilePicture || undefined,
      profileBanner: formData.profileBanner || undefined,
    };

    updateProfile(payload, {
      onSuccess: (data) => {
        console.log("Profile updated successfully:", data);
        if (profilePictureInputRef.current)
          profilePictureInputRef.current.value = "";
        if (coverImageInputRef.current) coverImageInputRef.current.value = "";
        setIsOpen(false); // Close the modal on success
      },
      onError: (err) => {
        console.error("Error updating profile:", err.message);
      },
    });
  };

  useEffect(() => {
    return () => {
      if (formData.profilePicturePreview) {
        URL.revokeObjectURL(formData.profilePicturePreview);
      }
      if (formData.coverImagePreview) {
        URL.revokeObjectURL(formData.coverImagePreview);
      }
    };
  }, [formData.profilePicturePreview, formData.coverImagePreview]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-brand-50 text-brand-500 border-0 rounded-xl"
        >
          <Edit02Icon size={13} strokeWidth="2" /> Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[598px] p-0 rounded-t-[20] h-[550px] lg:h-[96vh] overflow-auto">
        <div className="relative w-full h-40 bg-gray-300 group h-[229px] rounded-t-[20]">
          {formData.coverImagePreview ? (
            <Image
              width={1000}
              height={1000}
              src={formData.coverImagePreview}
              alt="Cover Preview"
              className="w-full h-full object-cover rounded-t-[20]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 h-[229px] rounded-t-[20]">
              Choose a Photo Placeholder
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
            <button
              type="button"
              onClick={() => coverImageInputRef.current?.click()}
              className="flex items-center gap-2 text-white p-2 rounded-full hover:bg-gray-700/50"
            >
              <Camera01Icon size={20} strokeWidth="2" />
              <span className="text-sm">Change Cover</span>
            </button>
            <Input
              id="coverImage"
              name="coverImage"
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
              ref={coverImageInputRef}
              className="hidden"
            />
          </div>
        </div>

        <div className="relative flex justify-center -mt-12">
          <div className="relative group">
            <div className="w-24 h-24 bg-gray-200 rounded-full border-4 border-white shadow-md flex items-center justify-center text-2xl">
              {formData.profilePicturePreview ? (
                <Image
                  width={500}
                  height={500}
                  src={formData.profilePicturePreview}
                  alt="Profile Preview"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                formData.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 rounded-full">
              <button
                type="button"
                onClick={() => profilePictureInputRef.current?.click()}
                className="flex w-full h-full items-center gap-2 text-white p-2 rounded-full hover:bg-gray-700/50 cursor-pointer"
              >
                <span className="text-sm">Change Photo</span>
              </button>
              <Input
                id="profilePicture"
                name="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
                ref={profilePictureInputRef}
                className="hidden"
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., minju1"
                disabled={profileLoading || updateLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g., LA"
                disabled={profileLoading || updateLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                placeholder="Instagram URL"
                disabled={profileLoading || updateLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="x">X</Label>
              <Input
                id="x"
                name="x"
                value={formData.x}
                onChange={handleInputChange}
                placeholder="X URL"
                disabled={profileLoading || updateLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tiktok">TikTok</Label>
              <Input
                id="tiktok"
                name="tiktok"
                value={formData.tiktok}
                onChange={handleInputChange}
                placeholder="TikTok URL"
                disabled={profileLoading || updateLoading}
              />
            </div>

            {updateError && (
              <p className="text-red-500 text-sm">{updateError.message}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={profileLoading || updateLoading}
            >
              {updateLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
