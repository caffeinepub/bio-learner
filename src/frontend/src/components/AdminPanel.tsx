import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  ArrowLeft,
  Bell,
  BookOpen,
  Images,
  Loader2,
  LogOut,
  Plus,
  ShieldCheck,
  Trash2,
  Upload,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import type { Notice, Photo, StudyMaterial } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateNotice,
  useDeleteNotice,
  useDeletePhoto,
  useDeleteStudyMaterial,
  useGetAllNotices,
  useGetAllPhotos,
  useGetAllStudyMaterials,
  useIsCallerAdmin,
  useUploadPhoto,
  useUploadStudyMaterial,
} from "../hooks/useQueries";

interface AdminPanelProps {
  onBack: () => void;
}

function formatDate(nanoseconds: bigint): string {
  const ms = Number(nanoseconds / 1_000_000n);
  if (ms <= 0) return "—";
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Notices Tab ─────────────────────────────────────────────────────────────

function NoticesTab() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { data: notices, isLoading } = useGetAllNotices();
  const createNotice = useCreateNotice();
  const deleteNotice = useDeleteNotice();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    try {
      await createNotice.mutateAsync({
        title: title.trim(),
        content: content.trim(),
      });
      toast.success("Notice posted successfully!");
      setTitle("");
      setContent("");
    } catch {
      toast.error("Failed to post notice. Please try again.");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteNotice.mutateAsync(id);
      toast.success("Notice deleted.");
    } catch {
      toast.error("Failed to delete notice.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Notice Form */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            Post New Notice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="notice-title">Title</Label>
              <Input
                id="notice-title"
                placeholder="e.g. Exam Schedule Released"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notice-content">Content</Label>
              <Textarea
                id="notice-content"
                placeholder="Write the notice content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={
                createNotice.isPending || !title.trim() || !content.trim()
              }
              className="gap-2"
            >
              {createNotice.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Bell className="w-4 h-4" />
              )}
              {createNotice.isPending ? "Posting…" : "Post Notice"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing Notices */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-display">All Notices</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <Skeleton key={n} className="h-14 rounded-lg" />
              ))}
            </div>
          ) : !notices || notices.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No notices posted yet.
            </p>
          ) : (
            <div className="space-y-3">
              {notices.map((notice: Notice) => (
                <div
                  key={String(notice.id)}
                  className="flex items-start justify-between gap-3 p-3 rounded-lg border border-border/50 bg-background"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {notice.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(notice.date)}
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0 h-8 w-8"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Notice?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete "{notice.title}". This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(notice.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Study Materials Tab ──────────────────────────────────────────────────────

function MaterialsTab() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const { data: materials, isLoading } = useGetAllStudyMaterials();
  const uploadMaterial = useUploadStudyMaterial();
  const deleteMaterial = useDeleteStudyMaterial();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file || !title.trim() || !subject) return;

    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) =>
        setProgress(pct),
      );
      await uploadMaterial.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        subject,
        file: blob,
      });
      toast.success("Study material uploaded!");
      setTitle("");
      setDescription("");
      setSubject("");
      setProgress(0);
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      toast.error("Upload failed. Please try again.");
      setProgress(0);
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteMaterial.mutateAsync(id);
      toast.success("Material deleted.");
    } catch {
      toast.error("Failed to delete material.");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            Upload Study Material
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="mat-title">Title</Label>
                <Input
                  id="mat-title"
                  placeholder="e.g. Cell Biology Notes"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="mat-subject">Subject</Label>
                <Select value={subject} onValueChange={setSubject} required>
                  <SelectTrigger id="mat-subject">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Biology">Biology</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="General Science">
                      General Science
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mat-desc">Description</Label>
              <Textarea
                id="mat-desc"
                placeholder="Describe what this material covers..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mat-file">File (PDF, DOC, etc.)</Label>
              <Input
                id="mat-file"
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                required
                className="cursor-pointer"
              />
            </div>
            {progress > 0 && progress < 100 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Uploading…</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
            <Button
              type="submit"
              disabled={uploadMaterial.isPending || !title.trim() || !subject}
              className="gap-2"
            >
              {uploadMaterial.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {uploadMaterial.isPending ? "Uploading…" : "Upload Material"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-display">
            All Materials
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <Skeleton key={n} className="h-14 rounded-lg" />
              ))}
            </div>
          ) : !materials || materials.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No materials uploaded yet.
            </p>
          ) : (
            <div className="space-y-3">
              {materials.map((mat: StudyMaterial) => (
                <div
                  key={String(mat.id)}
                  className="flex items-center justify-between gap-3 p-3 rounded-lg border border-border/50 bg-background"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{mat.title}</p>
                    <Badge variant="secondary" className="text-xs mt-0.5">
                      {mat.subject}
                    </Badge>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0 h-8 w-8"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Material?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete "{mat.title}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(mat.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Photos Tab ───────────────────────────────────────────────────────────────

function PhotosTab() {
  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const { data: photos, isLoading } = useGetAllPhotos();
  const uploadPhoto = useUploadPhoto();
  const deletePhoto = useDeletePhoto();

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file || !title.trim()) return;

    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) =>
        setProgress(pct),
      );
      await uploadPhoto.mutateAsync({ title: title.trim(), image: blob });
      toast.success("Photo uploaded!");
      setTitle("");
      setProgress(0);
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      toast.error("Upload failed. Please try again.");
      setProgress(0);
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deletePhoto.mutateAsync(id);
      toast.success("Photo deleted.");
    } catch {
      toast.error("Failed to delete photo.");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-display flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            Upload Photo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="photo-title">Photo Title</Label>
              <Input
                id="photo-title"
                placeholder="e.g. Lab Session — March 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="photo-file">Image (JPG, PNG, WebP)</Label>
              <Input
                id="photo-file"
                ref={fileRef}
                type="file"
                accept="image/*"
                required
                className="cursor-pointer"
              />
            </div>
            {progress > 0 && progress < 100 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Uploading…</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
            <Button
              type="submit"
              disabled={uploadPhoto.isPending || !title.trim()}
              className="gap-2"
            >
              {uploadPhoto.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {uploadPhoto.isPending ? "Uploading…" : "Upload Photo"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-base font-display">All Photos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[1, 2, 3].map((n) => (
                <Skeleton key={n} className="aspect-[4/3] rounded-lg" />
              ))}
            </div>
          ) : !photos || photos.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No photos uploaded yet.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {photos.map((photo: Photo) => (
                <div
                  key={String(photo.id)}
                  className="relative group rounded-lg overflow-hidden border border-border/50"
                >
                  <img
                    src={photo.image.getDirectURL()}
                    alt={photo.title}
                    className="w-full aspect-[4/3] object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-1.5 text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Photo?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{photo.title}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(photo.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium truncate">
                      {photo.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Admin Panel ─────────────────────────────────────────────────────────

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const { data: isAdmin, isLoading: checkingAdmin } = useIsCallerAdmin();

  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const principal = identity?.getPrincipal().toString();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-foreground">
                Admin Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">
                Bio-Learner Content Manager
              </p>
            </div>
          </div>
        </motion.div>

        {/* Not logged in */}
        {!isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="font-display text-xl">
                  Admin Login Required
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Sign in with your Internet Identity to access the admin
                  dashboard and manage Bio-Learner content.
                </p>
                <Button
                  onClick={() => login()}
                  disabled={isLoggingIn || isInitializing}
                  className="w-full gap-2"
                  size="lg"
                >
                  {isLoggingIn ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  {isLoggingIn ? "Connecting…" : "Login to Admin"}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Logged in but not admin */}
        {isLoggedIn && !checkingAdmin && isAdmin === false && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <Card className="text-center border-destructive/30 bg-destructive/5">
              <CardHeader>
                <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-2">
                  <AlertTriangle className="w-8 h-8 text-destructive" />
                </div>
                <CardTitle className="font-display text-xl">
                  Access Denied
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Your account doesn't have admin privileges. Please contact the
                  site administrator.
                </p>
                {principal && (
                  <p className="text-xs font-mono bg-muted rounded p-2 break-all text-muted-foreground">
                    {principal}
                  </p>
                )}
                <Button
                  variant="outline"
                  onClick={() => clear()}
                  className="w-full gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Loading admin check */}
        {isLoggedIn && checkingAdmin && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        )}

        {/* Admin dashboard */}
        {isLoggedIn && !checkingAdmin && isAdmin === true && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* User bar */}
            <div className="flex items-center justify-between mb-6 p-3 rounded-xl bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    Admin Access Granted
                  </p>
                  {principal && (
                    <p className="text-xs font-mono text-muted-foreground truncate max-w-xs">
                      {principal.slice(0, 24)}…
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => clear()}
                className="gap-1.5 text-muted-foreground"
              >
                <LogOut className="w-3.5 h-3.5" />
                Logout
              </Button>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="notices">
              <TabsList className="mb-6 w-full sm:w-auto">
                <TabsTrigger value="notices" className="gap-1.5">
                  <Bell className="w-3.5 h-3.5" />
                  Notices
                </TabsTrigger>
                <TabsTrigger value="materials" className="gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Materials
                </TabsTrigger>
                <TabsTrigger value="photos" className="gap-1.5">
                  <Images className="w-3.5 h-3.5" />
                  Photos
                </TabsTrigger>
              </TabsList>

              <TabsContent value="notices">
                <NoticesTab />
              </TabsContent>
              <TabsContent value="materials">
                <MaterialsTab />
              </TabsContent>
              <TabsContent value="photos">
                <PhotosTab />
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </div>
    </div>
  );
}
