"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, Loader2, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { ApiEnvelope } from "@/lib/api";
import {
  getCurrentUserProfile,
  type PublicUser,
  updateCurrentUserProfile,
} from "@/lib/auth-api";
import AccountPanelFrame, { fieldClass } from "./account-panel-frame";
import {
  ProfileErrorContainer,
  ProfileLoadingSkeleton,
  ProfileNotFoundContainer,
} from "./profile-panel-states";

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

const emptyProfile: ProfileFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
};

const formatFileSize = (size: number) =>
  size < 1024 * 1024
    ? `${Math.ceil(size / 1024)} KB`
    : `${(size / (1024 * 1024)).toFixed(1)} MB`;

const ProfilePanel = () => {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();
  const accessToken = session?.user.accessToken;
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<ProfileFormValues>(emptyProfile);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const profileQuery = useQuery({
    queryKey: ["user", "profile", accessToken],
    queryFn: () => getCurrentUserProfile(accessToken!),
    enabled: status === "authenticated" && Boolean(accessToken),
  });

  const profile = profileQuery.data?.data;

  useEffect(() => {
    if (!profile) return;
    setValues({
      firstName: profile.firstName ?? "",
      lastName: profile.lastName ?? "",
      email: profile.email ?? "",
      phoneNumber: profile.phoneNumber ?? "",
    });
  }, [profile]);

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(photoFile);
    setPhotoPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [photoFile]);

  const updateProfileMutation = useMutation({
    mutationFn: () => updateCurrentUserProfile(accessToken!, { ...values, photo: photoFile }),
    onSuccess: (response) => {
      queryClient.setQueryData<ApiEnvelope<PublicUser>>(
        ["user", "profile", accessToken],
        response,
      );
      setPhotoFile(null);
      toast.success(response.message || "Profile updated successfully.");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unable to update your profile.");
    },
  });

  const updateField = (field: keyof ProfileFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const selectPhoto = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Choose an image smaller than 5 MB.");
      return;
    }
    setPhotoFile(file);
  };

  const clearSelectedPhoto = () => {
    setPhotoFile(null);
    if (photoInputRef.current) photoInputRef.current.value = "";
  };

  const submitProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accessToken) {
      toast.error("Your session has expired. Please sign in again.");
      return;
    }
    updateProfileMutation.mutate();
  };

  if (status === "loading" || (Boolean(accessToken) && profileQuery.isLoading)) {
    return <ProfileLoadingSkeleton />;
  }

  if (status !== "authenticated" || !accessToken) {
    return <ProfileErrorContainer onRetry={() => window.location.assign("/login")} actionLabel="Go to login" message="Your session has expired. Please sign in again to view and update your profile." />;
  }

  if (profileQuery.isError) {
    return <ProfileErrorContainer onRetry={() => profileQuery.refetch()} isRetrying={profileQuery.isFetching} />;
  }

  if (!profile) {
    return <ProfileNotFoundContainer />;
  }

  const profilePhoto = photoPreview ?? profile?.photo;
  const initials = `${values.firstName[0] ?? ""}${values.lastName[0] ?? ""}`.toUpperCase() || "U";

  return (
    <AccountPanelFrame
      title="Profile"
      footer={
        <button
          type="submit"
          form="profile-form"
          disabled={updateProfileMutation.isPending}
          className="flex h-12 min-w-[180px] items-center justify-center gap-2 rounded-[6px] bg-[#0073df] px-4 text-base font-medium text-white transition hover:bg-[#0067c7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {updateProfileMutation.isPending && <Loader2 className="size-4 animate-spin" />}
          {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
        </button>
      }
    >
      <form id="profile-form" onSubmit={submitProfile} className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[#d8e6f3] bg-[#f8fbff] p-4 sm:col-span-2 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="mx-auto shrink-0 sm:mx-0">
              <div className="grid size-20 place-items-center overflow-hidden rounded-full border-4 border-white bg-[#d1e4f6] text-2xl font-bold text-[#104170] shadow-[0_4px_12px_rgba(16,65,112,0.14)]">
                {profilePhoto ? (
                  // Remote profile URLs are returned by the API and may use a configurable image host.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profilePhoto} alt="Profile preview" className="size-full object-cover" />
                ) : (
                  <span aria-label="Profile initials">{initials}</span>
                )}
              </div>
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-[#104170]">Profile photo</p>
                  <p className="mt-1 text-sm text-[#667085]">PNG, JPG, or WEBP · Maximum file size 5 MB</p>
                </div>
                {photoFile && <span className="mx-auto w-fit rounded-full bg-[#dff7ed] px-2.5 py-1 text-xs font-semibold text-[#087f5b] sm:mx-0">New photo selected</span>}
              </div>
              {photoFile && <p className="mt-3 truncate text-sm font-medium text-[#36546e]" title={photoFile.name}>Ready to save: {photoFile.name} ({formatFileSize(photoFile.size)})</p>}
              <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                <button type="button" onClick={() => photoInputRef.current?.click()} className="inline-flex h-10 items-center gap-2 rounded-full border border-[#104170] bg-white px-4 text-sm font-semibold text-[#104170] shadow-sm transition hover:bg-[#edf6ff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df] focus-visible:ring-offset-2">
                  <Camera size={16} /> {profilePhoto || photoFile ? "Replace photo" : "Upload photo"}
                </button>
                {photoFile && <button type="button" onClick={clearSelectedPhoto} className="inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-sm font-medium text-[#667085] transition hover:bg-[#edf1f5] hover:text-[#344054] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0073df]"><X size={16} /> Undo</button>}
              </div>
            </div>

            <input
              ref={photoInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="sr-only"
              onChange={(event) => {
                selectPhoto(event.target.files?.[0]);
                event.currentTarget.value = "";
              }}
            />
          </div>
        </div>

        <label className="text-base font-medium text-[#104170]">
          First name
          <input placeholder="Enter your first name" value={values.firstName} onChange={(event) => updateField("firstName", event.target.value)} required className={`${fieldClass} placeholder:text-[#98a2b3]`} />
        </label>
        <label className="text-base font-medium text-[#104170]">
          Last name
          <input placeholder="Enter your last name" value={values.lastName} onChange={(event) => updateField("lastName", event.target.value)} required className={`${fieldClass} placeholder:text-[#98a2b3]`} />
        </label>
        <label className="text-base font-medium text-[#104170]">
          Email Address
          <input type="email" placeholder="Enter your email address" value={values.email} disabled className={`${fieldClass} cursor-not-allowed text-[#667085] placeholder:text-[#98a2b3] opacity-75`} />
        </label>
        <label className="text-base font-medium text-[#104170]">
          Phone Number
          <input type="tel" placeholder="Enter your phone number" value={values.phoneNumber} onChange={(event) => updateField("phoneNumber", event.target.value)} required className={`${fieldClass} placeholder:text-[#98a2b3]`} />
        </label>
      </form>
    </AccountPanelFrame>
  );
};

export default ProfilePanel;
