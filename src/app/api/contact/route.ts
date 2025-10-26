import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { render } from '@react-email/components';
import { resend, ADMIN_EMAIL, FROM_EMAIL } from '@/lib/resend';
import ClientConfirmationEmail from '@/emails/client-confirmation';
import AdminNotificationEmail from '@/emails/admin-notification';

// Type pour un lead
interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'converted';
}

// Type pour le fichier leads.json
interface LeadsData {
  leads: Lead[];
}

// Chemin vers le fichier leads.json
const leadsFilePath = path.join(process.cwd(), 'leads.json');

// Fonction pour lire les leads
async function readLeads(): Promise<LeadsData> {
  try {
    const fileContents = await fs.readFile(leadsFilePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    // Si le fichier n'existe pas, retourner un tableau vide
    return { leads: [] };
  }
}

// Fonction pour écrire les leads
async function writeLeads(data: LeadsData): Promise<void> {
  await fs.writeFile(leadsFilePath, JSON.stringify(data, null, 2), 'utf8');
}

// POST - Créer un nouveau lead
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation des données
    const { name, email, phone, service, message } = body;

    if (!name || !email || !phone || !service || !message) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      );
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    // Validation du téléphone (format français basique)
    const phoneRegex = /^[\d\s+()-]+$/;
    if (!phoneRegex.test(phone)) {
      return NextResponse.json(
        { error: 'Numéro de téléphone invalide' },
        { status: 400 }
      );
    }

    // Créer le nouveau lead
    const newLead: Lead = {
      id: uuidv4(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      service,
      message: message.trim(),
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    // Lire les leads existants
    const leadsData = await readLeads();

    // Ajouter le nouveau lead
    leadsData.leads.unshift(newLead); // unshift pour mettre le plus récent en premier

    // Sauvegarder
    await writeLeads(leadsData);

    // Envoyer les emails
    try {
      // Email de confirmation au client
      const clientEmailHtml = render(
        ClientConfirmationEmail({
          name: newLead.name,
          service: newLead.service,
        })
      );

      await resend.emails.send({
        from: FROM_EMAIL,
        to: newLead.email,
        subject: 'Confirmation de votre demande - Royal Wash Pro',
        html: clientEmailHtml,
      });

      // Email de notification à l'admin
      const adminEmailHtml = render(
        AdminNotificationEmail({
          name: newLead.name,
          email: newLead.email,
          phone: newLead.phone,
          service: newLead.service,
          message: newLead.message,
          createdAt: newLead.createdAt,
        })
      );

      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `🎉 Nouveau lead: ${newLead.name} - ${newLead.service}`,
        html: adminEmailHtml,
      });

      console.log('Emails envoyés avec succès');
    } catch (emailError) {
      // On ne fait pas échouer la requête si l'email ne part pas
      console.error('Erreur lors de l\'envoi des emails:', emailError);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Votre demande a été envoyée avec succès!',
        lead: newLead,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur lors de la création du lead:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue. Veuillez réessayer.' },
      { status: 500 }
    );
  }
}

// GET - Récupérer tous les leads (pour le dashboard admin)
export async function GET() {
  try {
    const leadsData = await readLeads();

    return NextResponse.json({
      success: true,
      leads: leadsData.leads,
      total: leadsData.leads.length,
    });
  } catch (error) {
    console.error('Erreur lors de la lecture des leads:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}
