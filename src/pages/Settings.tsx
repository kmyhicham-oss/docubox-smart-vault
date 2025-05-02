
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { BellRing, Fingerprint, Lock, LogOut, User2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Settings() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !"
    });
    navigate("/login");
  };

  return (
    <div className="pb-20">
      <header className="bg-background border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold tracking-tight">Paramètres</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 space-y-6 max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User2 className="mr-2" size={18} />
              Profil
            </CardTitle>
            <CardDescription>
              Gérer vos informations personnelles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email</div>
                <div className="text-sm text-muted-foreground">
                  user@example.com
                </div>
              </div>
              <Button variant="outline" size="sm">
                Modifier
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Mot de passe</div>
                <div className="text-sm text-muted-foreground">
                  Dernière modification il y a 2 mois
                </div>
              </div>
              <Button variant="outline" size="sm">
                Modifier
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BellRing className="mr-2" size={18} />
              Notifications
            </CardTitle>
            <CardDescription>
              Gérer vos préférences de notification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Documents expirants</div>
                <div className="text-sm text-muted-foreground">
                  Notifications pour documents qui expirent
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Timing des alertes</div>
                <div className="text-sm text-muted-foreground">
                  30 jours, 7 jours et jour d'expiration
                </div>
              </div>
              <Button variant="outline" size="sm">
                Configurer
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="mr-2" size={18} />
              Sécurité
            </CardTitle>
            <CardDescription>
              Paramètres de sécurité de votre compte
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Verrouillage par code PIN</div>
                <div className="text-sm text-muted-foreground">
                  Protéger l'accès à l'application
                </div>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">Authentification biométrique</div>
                <div className="text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Fingerprint size={14} className="mr-1" />
                    Déverrouillage par empreinte digitale
                  </div>
                </div>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Déconnexion</CardTitle>
          </CardHeader>
          <CardFooter>
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="mr-2" size={16} />
              Se déconnecter
            </Button>
          </CardFooter>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
}
