import fs from 'fs';
import path from 'path';
import { format, addMinutes, parse, isBefore, isAfter, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

// Chemin vers le fichier availability.json
const AVAILABILITY_FILE = path.join(process.cwd(), 'availability.json');

// Types pour la disponibilité
export interface WorkingHours {
  enabled: boolean;
  start: string; // Format "HH:mm"
  end: string; // Format "HH:mm"
}

export interface AvailabilityConfig {
  workingHours: {
    monday: WorkingHours;
    tuesday: WorkingHours;
    wednesday: WorkingHours;
    thursday: WorkingHours;
    friday: WorkingHours;
    saturday: WorkingHours;
    sunday: WorkingHours;
  };
  slotDuration: number; // Durée en minutes
  blockedDates: string[]; // Dates bloquées (format ISO "YYYY-MM-DD")
  bookedSlots: BookedSlot[];
}

export interface BookedSlot {
  date: string; // Format "YYYY-MM-DD"
  time: string; // Format "HH:mm"
  bookingId: string;
  formula: string;
  customerName: string;
}

export interface TimeSlot {
  time: string; // Format "HH:mm"
  available: boolean;
  reason?: string; // Raison si indisponible
}

/**
 * Charge la configuration de disponibilité depuis le fichier JSON
 */
function loadAvailability(): AvailabilityConfig {
  try {
    const data = fs.readFileSync(AVAILABILITY_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erreur lors du chargement des disponibilités:', error);
    throw new Error('Impossible de charger les disponibilités');
  }
}

/**
 * Sauvegarde la configuration de disponibilité dans le fichier JSON
 */
function saveAvailability(config: AvailabilityConfig): void {
  try {
    fs.writeFileSync(AVAILABILITY_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des disponibilités:', error);
    throw new Error('Impossible de sauvegarder les disponibilités');
  }
}

/**
 * Obtient le nom du jour de la semaine en anglais (pour correspondre aux clés de workingHours)
 */
function getDayName(date: Date): keyof AvailabilityConfig['workingHours'] {
  const days: Array<keyof AvailabilityConfig['workingHours']> = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ];
  return days[date.getDay()];
}

/**
 * Génère tous les créneaux possibles pour une journée donnée
 * (sans tenir compte des réservations, juste basé sur les horaires de travail)
 */
function generateDaySlots(date: Date, config: AvailabilityConfig): string[] {
  const dayName = getDayName(date);
  const dayConfig = config.workingHours[dayName];

  // Si le jour n'est pas actif, retourner tableau vide
  if (!dayConfig.enabled) {
    return [];
  }

  const slots: string[] = [];
  const [startHour, startMinute] = dayConfig.start.split(':').map(Number);
  const [endHour, endMinute] = dayConfig.end.split(':').map(Number);

  // Créer des objets Date pour le début et la fin de la journée
  const dayStart = new Date(date);
  dayStart.setHours(startHour, startMinute, 0, 0);

  const dayEnd = new Date(date);
  dayEnd.setHours(endHour, endMinute, 0, 0);

  // Générer les créneaux par intervalles de slotDuration
  let currentSlot = new Date(dayStart);
  while (isBefore(currentSlot, dayEnd)) {
    const nextSlot = addMinutes(currentSlot, config.slotDuration);

    // Vérifier que le créneau + durée ne dépasse pas la fin de journée
    if (isBefore(nextSlot, dayEnd) || isSameDay(nextSlot, dayEnd)) {
      const timeString = format(currentSlot, 'HH:mm');
      slots.push(timeString);
    }

    currentSlot = nextSlot;
  }

  return slots;
}

/**
 * Vérifie si une date est bloquée manuellement
 */
function isDateBlocked(date: Date, config: AvailabilityConfig): boolean {
  const dateString = format(date, 'yyyy-MM-dd');
  return config.blockedDates.includes(dateString);
}

/**
 * Vérifie si un créneau spécifique est déjà réservé
 */
function isSlotBooked(date: string, time: string, config: AvailabilityConfig): BookedSlot | null {
  const bookedSlot = config.bookedSlots.find(
    (slot) => slot.date === date && slot.time === time
  );
  return bookedSlot || null;
}

/**
 * Obtient tous les créneaux disponibles pour une date donnée
 * Retourne un tableau d'objets TimeSlot avec disponibilité et raison d'indisponibilité
 */
export function getAvailableSlots(date: Date): TimeSlot[] {
  const config = loadAvailability();
  const dateString = format(date, 'yyyy-MM-dd');

  // Vérifier si la date est bloquée
  if (isDateBlocked(date, config)) {
    return [];
  }

  // Générer tous les créneaux possibles pour ce jour
  const allSlots = generateDaySlots(date, config);

  // Vérifier la disponibilité de chaque créneau
  const slots: TimeSlot[] = allSlots.map((time) => {
    const bookedSlot = isSlotBooked(dateString, time, config);

    if (bookedSlot) {
      return {
        time,
        available: false,
        reason: `Réservé par ${bookedSlot.customerName}`,
      };
    }

    return {
      time,
      available: true,
    };
  });

  return slots;
}

/**
 * Vérifie si un créneau spécifique est disponible
 */
export function isSlotAvailable(date: string, time: string): boolean {
  const config = loadAvailability();
  const dateObj = parse(date, 'yyyy-MM-dd', new Date());

  // Vérifier si la date est bloquée
  if (isDateBlocked(dateObj, config)) {
    return false;
  }

  // Vérifier si le jour est activé
  const dayName = getDayName(dateObj);
  if (!config.workingHours[dayName].enabled) {
    return false;
  }

  // Vérifier si le créneau est réservé
  const bookedSlot = isSlotBooked(date, time, config);
  return bookedSlot === null;
}

/**
 * Réserve un créneau pour une réservation
 */
export function bookSlot(
  date: string,
  time: string,
  bookingId: string,
  formula: string,
  customerName: string
): boolean {
  const config = loadAvailability();

  // Vérifier que le créneau est disponible
  if (!isSlotAvailable(date, time)) {
    return false;
  }

  // Ajouter le créneau réservé
  config.bookedSlots.push({
    date,
    time,
    bookingId,
    formula,
    customerName,
  });

  // Sauvegarder
  saveAvailability(config);
  return true;
}

/**
 * Libère un créneau (en cas d'annulation)
 */
export function releaseSlot(bookingId: string): boolean {
  const config = loadAvailability();

  // Trouver l'index du créneau à libérer
  const index = config.bookedSlots.findIndex((slot) => slot.bookingId === bookingId);

  if (index === -1) {
    return false; // Créneau non trouvé
  }

  // Supprimer le créneau réservé
  config.bookedSlots.splice(index, 1);

  // Sauvegarder
  saveAvailability(config);
  return true;
}

/**
 * Obtient tous les créneaux réservés pour une période donnée
 */
export function getBookedSlots(startDate: Date, endDate: Date): BookedSlot[] {
  const config = loadAvailability();
  const start = format(startDate, 'yyyy-MM-dd');
  const end = format(endDate, 'yyyy-MM-dd');

  return config.bookedSlots.filter((slot) => {
    return slot.date >= start && slot.date <= end;
  });
}

/**
 * Bloque une date manuellement (congés, jour férié, etc.)
 */
export function blockDate(date: string): void {
  const config = loadAvailability();

  if (!config.blockedDates.includes(date)) {
    config.blockedDates.push(date);
    saveAvailability(config);
  }
}

/**
 * Débloque une date
 */
export function unblockDate(date: string): void {
  const config = loadAvailability();

  const index = config.blockedDates.indexOf(date);
  if (index !== -1) {
    config.blockedDates.splice(index, 1);
    saveAvailability(config);
  }
}

/**
 * Obtient les dates qui ont au moins un créneau disponible
 * dans une plage donnée (utile pour désactiver les dates dans le calendrier)
 */
export function getDatesWithAvailability(startDate: Date, endDate: Date): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);

  while (isBefore(current, endDate) || isSameDay(current, endDate)) {
    const slots = getAvailableSlots(current);
    const hasAvailableSlot = slots.some((slot) => slot.available);

    if (hasAvailableSlot) {
      dates.push(format(current, 'yyyy-MM-dd'));
    }

    // Passer au jour suivant
    current.setDate(current.getDate() + 1);
  }

  return dates;
}
