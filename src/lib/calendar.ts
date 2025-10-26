// Calendar helper to generate .ics files for calendar apps
// This creates downloadable calendar event files that users can add to Google Calendar, Outlook, Apple Calendar, etc.

import { ICS } from 'ics';

/**
 * Generate a calendar event (.ics file) for a booking
 * @param bookingData - The booking information
 * @returns The .ics file content as a string
 */
export function generateCalendarEvent(bookingData: {
  formula: string;
  date: string; // Format: YYYY-MM-DD
  time: string; // Format: HH:MM
  customerName: string;
  address: string;
}): string {
  // Parse date and time
  const [year, month, day] = bookingData.date.split('-').map(Number);
  const [hours, minutes] = bookingData.time.split(':').map(Number);

  // Calculate duration based on formula (in hours)
  const durationMap: Record<string, number> = {
    standard: 1.5,
    premium: 2,
    royal: 2.5,
  };
  const duration = durationMap[bookingData.formula] || 2;

  // Create event object in ICS format
  const event = {
    start: [year, month, day, hours, minutes],
    duration: { hours: duration },
    title: `Lavage Auto ${bookingData.formula.charAt(0).toUpperCase() + bookingData.formula.slice(1)}`,
    description: `Lavage automobile professionnel à domicile\nFormule: ${bookingData.formula}\nAdresse: ${bookingData.address}`,
    location: bookingData.address,
    status: 'CONFIRMED' as const,
    busyStatus: 'BUSY' as const,
    organizer: { name: 'Royal Wash Pro', email: 'contact@royalwash-pro.fr' },
    attendees: [
      { name: bookingData.customerName, email: '', rsvp: true, partstat: 'ACCEPTED' as const, role: 'REQ-PARTICIPANT' as const },
    ],
  };

  // Generate ICS file content
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Royal Wash Pro//Booking System//FR
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
UID:${Date.now()}@royalwash-pro.fr
DTSTAMP:${formatICSDate(new Date())}
DTSTART:${formatICSDate(new Date(year, month - 1, day, hours, minutes))}
DTEND:${formatICSDate(new Date(year, month - 1, day, hours + duration, minutes))}
SUMMARY:${event.title}
DESCRIPTION:${event.description.replace(/\n/g, '\\n')}
LOCATION:${event.location}
STATUS:${event.status}
ORGANIZER:CN=${event.organizer.name}:MAILTO:${event.organizer.email}
ATTENDEE:CN=${event.attendees[0].name};RSVP=TRUE;PARTSTAT=${event.attendees[0].partstat};ROLE=${event.attendees[0].role}
END:VEVENT
END:VCALENDAR`;

  return icsContent;
}

/**
 * Format a date for ICS format: YYYYMMDDTHHMMSS
 */
function formatICSDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

/**
 * Generate download link for calendar file
 */
export function createCalendarDownloadLink(icsContent: string): string {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  return URL.createObjectURL(blob);
}
