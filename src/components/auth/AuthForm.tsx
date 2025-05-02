
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = (e: React.FormEvent<HTMLFormElement>, type: "login" | "register") => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock authentication
    setTimeout(() => {
      setIsLoading(false);
      
      if (type === "login") {
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur DocuBox"
        });
      } else {
        toast({
          title: "Compte créé avec succès",
          description: "Votre compte a été créé"
        });
      }
      
      navigate("/");
    }, 1000);
  };

  return (
    <Card className="w-[350px]">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">DocuBox</CardTitle>
        <CardDescription>Gérez intelligemment vos documents</CardDescription>
      </CardHeader>
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Connexion</TabsTrigger>
          <TabsTrigger value="register">Inscription</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <form onSubmit={(e) => handleAuth(e, "login")}>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="votre@email.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <a href="#" className="text-xs text-primary hover:underline">
                    Mot de passe oublié?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>

        <TabsContent value="register">
          <form onSubmit={(e) => handleAuth(e, "register")}>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input id="register-email" type="email" placeholder="votre@email.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Mot de passe</Label>
                <Input id="register-password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmation du mot de passe</Label>
                <Input id="confirm-password" type="password" required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Création en cours..." : "Créer un compte"}
              </Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthForm;
