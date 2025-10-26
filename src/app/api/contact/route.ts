import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Interface pour typer les données du formulaire
interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  timestamp: string;
  id: string;
}

// Fonction pour générer un ID unique basé sur le timestamp
function generateId(): string {
  return `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Fonction pour sauvegarder les leads localement sans base de données
async function saveLead(data: ContactFormData) {
  const leadsPath = path.join(process.cwd(), 'leads.json');
  
  let leads: ContactFormData[] = [];
  
  // Lire les leads existants si le fichier existe
  if (existsSync(leadsPath)) {
    const fileContent = await readFile(leadsPath, 'utf-8');
    leads = JSON.parse(fileContent);
  }
  
  // Ajouter le nouveau lead
  leads.push(data);
  
  // Sauvegarder dans le fichier
  await writeFile(leadsPath, JSON.stringify(leads, null, 2));
  
  return leads.length; // Retourne le nombre total de leads
}

// Configuration pour l'envoi d'email via service gratuit
// Note: Pour production, configurez les variables d'environnement
async function sendEmailNotification(data: ContactFormData) {
  // Pour l'instant, on log simplement les données
  // En production, vous pouvez utiliser des services comme:
  // - Resend (gratuit jusqu'à 3000 emails/mois)
  // - SendGrid
  // - Mailgun (gratuit jusqu'à 5000 emails/mois)
  // - EmailJS (côté client)
  
  console.log('=== NOUVEAU LEAD REÇU ===');
  console.log('Nom:', data.name);
  console.log('Email:', data.email);
  console.log('Téléphone:', data.phone);
  console.log('Service:', data.service);
  console.log('Message:', data.message);
  console.log('ID:', data.id);
  console.log('Timestamp:', data.timestamp);
  console.log('========================');
  
  // TODO: Implémenter l'envoi d'email réel ici
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Parser le body de la requête
    const body = await request.json();
    
    // Validation basique des données
    const { name, email, phone, service, message } = body;
    
    if (!name || !email || !phone || !service || !message) {
      return NextResponse.json(
        { success: false, error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }
    
    // Validation email format basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Format d\'email invalide' },
        { status: 400 }
      );
    }
    
    // Créer l'objet lead avec timestamp et ID unique
    const leadData: ContactFormData = {
      name,
      email,
      phone,
      service,
      message,
      timestamp: new Date().toISOString(),
      id: generateId()
    };
    
    // Sauvegarder le lead localement
    const totalLeads = await saveLead(leadData);
    
    // Envoyer notification (pour l'instant juste console.log)
    await sendEmailNotification(leadData);
    
    // Retourner succès avec informations
    return NextResponse.json({
      success: true,
      message: 'Votre demande a été reçue avec succès! Nous vous contacterons dans les plus brefs délais.',
      leadId: leadData.id,
      totalLeads
    }, { status: 200 });
    
  } catch (error) {
    console.error('Erreur lors du traitement de la demande de contact:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Une erreur est survenue lors du traitement de votre demande. Veuillez réessayer.' 
      },
      { status: 500 }
    );
  }
}

// Méthode GET pour récupérer tous les leads (admin seulement - à sécuriser)
export async function GET() {
  try {
    const leadsPath = path.join(process.cwd(), 'leads.json');
    
    if (!existsSync(leadsPath)) {
      return NextResponse.json({ leads: [], total: 0 });
    }
    
    const fileContent = await readFile(leadsPath, 'utf-8');
    const leads = JSON.parse(fileContent);
    
    return NextResponse.json({ 
      leads, 
      total: leads.length 
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des leads:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des leads' },
      { status: 500 }
    );
  }
}
