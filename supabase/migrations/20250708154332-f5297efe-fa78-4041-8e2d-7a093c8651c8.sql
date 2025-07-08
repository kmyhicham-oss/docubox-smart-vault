-- Configuration pour l'authentification email dans Supabase
-- Cette migration active la confirmation par email et configure les templates

-- Configuration des templates d'email (cela sera fait via l'interface Supabase)
-- Vous devrez configurer manuellement dans l'interface Supabase :
-- 1. Aller dans Authentication > Email Templates
-- 2. Configurer le template "Reset Password" avec votre domaine
-- 3. Configurer le SMTP ou utiliser le service email de Supabase