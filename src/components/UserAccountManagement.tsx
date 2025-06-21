
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useDatabase } from '@/contexts/DatabaseContext';
import { User } from '@/services/database/DatabaseAdapter';
import { CheckIcon, XIcon } from 'lucide-react';

interface UserFormData {
  id?: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  password: string;
  isActive?: boolean;
}

const UserAccountManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<UserFormData>({
    username: '',
    email: '',
    fullName: '',
    role: 'caissier',
    password: ''
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { adapter } = useDatabase();
  const { toast } = useToast();

  useEffect(() => {
    if (adapter) {
      fetchUsers();
    }
  }, [adapter]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const result = await adapter?.getUsers();
      if (result?.success) {
        setUsers(result.data || []);
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de charger les utilisateurs: " + result?.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du chargement des utilisateurs",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value
    });
  };

  const handleAddUser = async () => {
    if (!adapter) return;

    if (!formData.username || !formData.email || !formData.fullName || !formData.password) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await adapter.createUser({
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName,
        password: formData.password,
        role: formData.role
      });

      if (result.success) {
        toast({
          title: "Succès",
          description: "Utilisateur créé avec succès"
        });
        setIsAddModalOpen(false);
        resetForm();
        fetchUsers();
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de créer l'utilisateur: " + result.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de l'utilisateur",
        variant: "destructive"
      });
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUserId(user.id);
    setFormData({
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      password: '',
      isActive: user.isActive
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!adapter || !selectedUserId) return;

    try {
      const updateData = {
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName,
        role: formData.role,
        isActive: formData.isActive
      };

      if (formData.password) {
        (updateData as any).password = formData.password;
      }

      const result = await adapter.updateUser(selectedUserId, updateData);

      if (result.success) {
        toast({
          title: "Succès",
          description: "Utilisateur mis à jour avec succès"
        });
        setIsEditModalOpen(false);
        resetForm();
        fetchUsers();
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour l'utilisateur: " + result.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de l'utilisateur",
        variant: "destructive"
      });
    }
  };

  const handleDeletePrompt = (userId: string) => {
    setSelectedUserId(userId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteUser = async () => {
    if (!adapter || !selectedUserId) return;

    try {
      const result = await adapter.deleteUser(selectedUserId);

      if (result.success) {
        toast({
          title: "Succès",
          description: "Utilisateur supprimé avec succès"
        });
        setIsDeleteModalOpen(false);
        fetchUsers();
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de supprimer l'utilisateur: " + result.error,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de l'utilisateur",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      fullName: '',
      role: 'caissier',
      password: ''
    });
    setSelectedUserId(null);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    resetForm();
  };

  if (isLoading) {
    return <div className="text-center p-10">Chargement des utilisateurs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Utilisateurs</h2>
          <p className="text-gray-500">Ajoutez, modifiez ou supprimez des comptes utilisateurs</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>Ajouter un utilisateur</Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom d'utilisateur</TableHead>
              <TableHead>Nom complet</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  Aucun utilisateur trouvé
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? 'Administrateur' : 'Caissier'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {user.isActive !== false ? (
                      <span className="flex items-center text-green-600">
                        <CheckIcon className="w-4 h-4 mr-1" /> Actif
                      </span>
                    ) : (
                      <span className="flex items-center text-red-600">
                        <XIcon className="w-4 h-4 mr-1" /> Inactif
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeletePrompt(user.id)}
                    >
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal d'ajout */}
      <Dialog open={isAddModalOpen} onOpenChange={handleCloseAddModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un utilisateur</DialogTitle>
            <DialogDescription>
              Créez un nouveau compte utilisateur avec les permissions appropriées.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nom d'utilisateur</Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="ex: jdupont"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="ex: Jean Dupont"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ex: jean.dupont@example.com"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Mot de passe sécurisé"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rôle</Label>
              <Select
                value={formData.role}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="caissier">Caissier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button onClick={handleAddUser}>Créer l'utilisateur</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de modification */}
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations du compte utilisateur.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-username">Nom d'utilisateur</Label>
                <Input
                  id="edit-username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fullName">Nom complet</Label>
                <Input
                  id="edit-fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-password">Mot de passe (laisser vide pour ne pas changer)</Label>
              <Input
                id="edit-password"
                name="password"
                type="password"
                placeholder="Nouveau mot de passe"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role">Rôle</Label>
                <Select
                  value={formData.role}
                  onValueChange={handleRoleChange}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="caissier">Caissier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Statut</Label>
                <Select
                  value={formData.isActive === false ? "inactive" : "active"}
                  onValueChange={(value) => 
                    setFormData({
                      ...formData, 
                      isActive: value === "active"
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button onClick={handleUpdateUser}>Enregistrer les modifications</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de suppression */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserAccountManagement;
