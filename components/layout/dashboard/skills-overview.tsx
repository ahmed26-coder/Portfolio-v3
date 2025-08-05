"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Loader2, ImagePlus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

interface Skill {
  id: number;
  title: string;
  img: string;
  description: string;
}

export default function SkillsOverview() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [newSkill, setNewSkill] = useState({
    title: "",
    description: "",
    img: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Fetch data
  useEffect(() => {
    const fetchSkills = async () => {
      const { data, error } = await supabase.from("Skills").select("*");
      if (error) {
        toast.error(`Error fetching skills: ${error.message}`);
      } else {
        setSkills(data);
      }
    };
    fetchSkills();
  }, []);

  // Upload image
  const uploadImage = async (file: File) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("skills").upload(fileName, file);
    if (error) {
      toast.error(`Image upload error: ${error.message}`);
      return "";
    }
    const { data: publicUrl } = supabase.storage.from("skills").getPublicUrl(fileName);
    return publicUrl.publicUrl;
  };

  // Add new skill
  const handleAddSkill = async () => {
    if (!newSkill.title || !newSkill.description) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoadingAction(true);
    let imgUrl = "";
    if (imageFile) {
      imgUrl = await uploadImage(imageFile);
    }

    const { data, error } = await supabase
      .from("Skills")
      .insert([{ title: newSkill.title, description: newSkill.description, img: imgUrl }])
      .select();

    setLoadingAction(false);
    if (error) {
      toast.error(`Error adding skill: ${error.message}`);
    } else if (data) {
      setSkills([...skills, ...data]);
      setNewSkill({ title: "", description: "", img: "" });
      setImageFile(null);
      setIsAddDialogOpen(false);
      toast.success("Skill added successfully!");
    }
  };

  // Edit skill
  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setNewSkill({ title: skill.title, description: skill.description, img: skill.img });
  };

  // Update skill
  const handleUpdateSkill = async () => {
    if (!newSkill.title || !newSkill.description) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoadingAction(true);
    let imgUrl = newSkill.img;
    if (imageFile) {
      imgUrl = await uploadImage(imageFile);
    }

    if (editingSkill) {
      const { data, error } = await supabase
        .from("Skills")
        .update({ title: newSkill.title, description: newSkill.description, img: imgUrl })
        .eq("id", editingSkill.id)
        .select();

      setLoadingAction(false);
      if (error) {
        toast.error(`Error updating skill: ${error.message}`);
      } else if (data) {
        setSkills(skills.map((s) => (s.id === editingSkill.id ? data[0] : s)));
        setEditingSkill(null);
        setNewSkill({ title: "", description: "", img: "" });
        setImageFile(null);
        toast.success("Skill updated successfully!");
      }
    }
  };

  // Delete skill
  const handleDeleteSkill = async (id: number) => {
    const { error } = await supabase.from("Skills").delete().eq("id", id);
    if (error) {
      toast.error(`Error deleting skill: ${error.message}`);
    } else {
      setSkills(skills.filter((skill) => skill.id !== id));
      toast.success("Skill deleted successfully!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
          <p className="text-muted-foreground">Manage your technical skills and expertise levels</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Skill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Skill</DialogTitle>
              <DialogDescription>Add a new skill to your portfolio</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Label>Title</Label>
              <Input value={newSkill.title} onChange={(e) => setNewSkill({ ...newSkill, title: e.target.value })} />
              <Label>Description</Label>
              <Input value={newSkill.description} onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })} />

              {/* Attractive Image Upload */}
              <Label>Image</Label>
              <div
                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                {imageFile ? (
                  <Image src={URL.createObjectURL(imageFile)} alt="preview" width={150} height={150} className="mx-auto rounded-md" />
                ) : (
                  <div className="flex flex-col items-center text-gray-500">
                    <ImagePlus className="h-10 w-10" />
                    <p>Click to upload image</p>
                  </div>
                )}
              </div>
              <input id="image-upload" type="file" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            </div>
            <DialogFooter>
              <Button onClick={handleAddSkill} disabled={loadingAction}>
                {loadingAction && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Skill
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
  {skills.map((skill) => (
    <Card key={skill.id} className="flex flex-row items-center p-4">
      {skill.img && (
        <div className="flex-shrink-0 w-22 h-22 relative rounded-md overflow-hidden">
          <Image
            src={skill.img}
            alt={skill.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-col justify-between flex-1 ml-4">
        <div className="flex justify-end space-x-1">
          <Button variant="ghost" size="sm" onClick={() => handleEditSkill(skill)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(skill.id)}>
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
        <div>
          <h3 className="font-semibold text-lg">{skill.title}</h3>
          <p className="text-sm text-muted-foreground">{skill.description}</p>
        </div>
      </div>
    </Card>
  ))}
</div>


      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>Are you sure you want to delete this skill?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => { handleDeleteSkill(deleteConfirm!); setDeleteConfirm(null); }}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingSkill} onOpenChange={() => setEditingSkill(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
            <DialogDescription>Update your skill information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label>Title</Label>
            <Input value={newSkill.title} onChange={(e) => setNewSkill({ ...newSkill, title: e.target.value })} />
            <Label>Description</Label>
            <Input value={newSkill.description} onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })} />

            {/* Image Upload with Preview */}
            <Label>Image</Label>
            <div
              className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
              onClick={() => document.getElementById("edit-image-upload")?.click()}
            >
              {imageFile ? (
                <Image src={URL.createObjectURL(imageFile)} alt="preview" width={150} height={150} className="mx-auto rounded-md" />
              ) : newSkill.img ? (
                <Image src={newSkill.img} alt="current" width={150} height={150} className="mx-auto rounded-md" />
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <ImagePlus className="h-10 w-10" />
                  <p>Click to upload image</p>
                </div>
              )}
            </div>
            <input id="edit-image-upload" type="file" className="hidden" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateSkill} disabled={loadingAction}>
              {loadingAction && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Skill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
