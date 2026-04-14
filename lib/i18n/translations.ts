export type Language = "fr" | "en" | "de";

export interface Translations {
  // Navigation / Header
  nav_title: string;
  nav_subtitle: string;

  // Booking page
  book_title: string;
  book_subtitle: string;
  book_select_date: string;
  book_available: string;
  book_booked: string;
  book_blocked: string;
  book_peak_badge: string;
  book_lighting_badge: string;
  book_duration: string;
  book_ends_at: string;

  // Checkout modal
  checkout_title: string;
  checkout_selected_slot: string;
  checkout_first_name: string;
  checkout_last_name: string;
  checkout_room_number: string;
  checkout_first_name_placeholder: string;
  checkout_last_name_placeholder: string;
  checkout_room_placeholder: string;
  checkout_rackets_label: string;
  checkout_rackets_desc: string;
  checkout_balls_only_label: string;
  checkout_balls_only_desc: string;
  checkout_lighting_label: string;
  checkout_lighting_desc: string;
  checkout_price_breakdown: string;
  checkout_base: string;
  checkout_peak_surcharge: string;
  checkout_rackets_fee: string;
  checkout_balls_fee: string;
  checkout_lighting_fee: string;
  checkout_total: string;
  checkout_confirm_btn: string;
  checkout_cancel_btn: string;
  checkout_processing: string;
  checkout_slot_taken: string;

  // Confirmation page
  confirm_title: string;
  confirm_pin_label: string;
  confirm_booking_details: string;
  confirm_slot: string;
  confirm_date: string;
  confirm_total: string;
  confirm_instruction_title: string;
  confirm_instruction_body: string;
  confirm_screenshot_hint: string;
  confirm_another_btn: string;

  // Language toggle
  lang_fr: string;
  lang_en: string;
  lang_de: string;

  // Admin
  admin_schedule_title: string;
  admin_settings_title: string;
  admin_mark_paid: string;
  admin_mark_pending: string;
  admin_cancel_booking: string;
  admin_block_slot: string;
  admin_unblock_slot: string;

  // Errors
  error_validation: string;
  error_generic: string;
}

export const translations: Record<Language, Translations> = {
  fr: {
    nav_title: "Caribbean World Djerba",
    nav_subtitle: "Court de Padel",

    book_title: "Réserver un Court de Padel",
    book_subtitle: "Sélectionnez une date et un créneau disponible",
    book_select_date: "Choisir une date",
    book_available: "Disponible",
    book_booked: "Réservé",
    book_blocked: "Bloqué",
    book_peak_badge: "+10 DT Heure de pointe",
    book_lighting_badge: "Éclairage disponible",
    book_duration: "90 min",
    book_ends_at: "Jusqu'à",

    checkout_title: "Finaliser la réservation",
    checkout_selected_slot: "Créneau sélectionné",
    checkout_first_name: "Prénom",
    checkout_last_name: "Nom",
    checkout_room_number: "Numéro de chambre",
    checkout_first_name_placeholder: "Votre prénom",
    checkout_last_name_placeholder: "Votre nom",
    checkout_room_placeholder: "Ex: 214",
    checkout_rackets_label: "Raquettes (balles incluses)",
    checkout_rackets_desc: "Nombre de raquettes (+5 DT chacune)",
    checkout_balls_only_label: "Louer des balles uniquement",
    checkout_balls_only_desc: "+10 DT — Sans raquette",
    checkout_lighting_label: "Éclairage du terrain",
    checkout_lighting_desc: "+20 DT — Recommandé après 18h30",
    checkout_price_breakdown: "Détail du prix",
    checkout_base: "Court (90 min)",
    checkout_peak_surcharge: "Supplément heure de pointe",
    checkout_rackets_fee: "Raquettes",
    checkout_balls_fee: "Location de balles",
    checkout_lighting_fee: "Éclairage",
    checkout_total: "Total",
    checkout_confirm_btn: "Confirmer la réservation",
    checkout_cancel_btn: "Annuler",
    checkout_processing: "Traitement en cours...",
    checkout_slot_taken:
      "Ce créneau vient d'être réservé. Veuillez en choisir un autre.",

    confirm_title: "Réservation Confirmée !",
    confirm_pin_label: "Votre Code de Réservation",
    confirm_booking_details: "Détails de la réservation",
    confirm_slot: "Créneau",
    confirm_date: "Date",
    confirm_total: "Montant à payer",
    confirm_instruction_title: "Comment procéder ?",
    confirm_instruction_body:
      "Prenez une capture d'écran de ce code et présentez-vous à la réception **au moins 30 minutes avant** votre créneau pour effectuer le paiement.",
    confirm_screenshot_hint:
      "📸 Faites une capture d'écran maintenant pour ne pas perdre ce code.",
    confirm_another_btn: "Réserver un autre créneau",

    lang_fr: "Français",
    lang_en: "English",
    lang_de: "Deutsch",

    admin_schedule_title: "Planning du jour",
    admin_settings_title: "Paramètres",
    admin_mark_paid: "Marquer Payé",
    admin_mark_pending: "Marquer En Attente",
    admin_cancel_booking: "Annuler",
    admin_block_slot: "Bloquer",
    admin_unblock_slot: "Débloquer",

    error_validation: "Veuillez remplir tous les champs obligatoires.",
    error_generic: "Une erreur est survenue. Veuillez réessayer.",
  },

  en: {
    nav_title: "Caribbean World Djerba",
    nav_subtitle: "Padel Court",

    book_title: "Book a Padel Court",
    book_subtitle: "Select a date and an available slot",
    book_select_date: "Select a date",
    book_available: "Available",
    book_booked: "Booked",
    book_blocked: "Blocked",
    book_peak_badge: "+10 DT Peak Hour",
    book_lighting_badge: "Lighting available",
    book_duration: "90 min",
    book_ends_at: "Until",

    checkout_title: "Complete Your Booking",
    checkout_selected_slot: "Selected Slot",
    checkout_first_name: "First Name",
    checkout_last_name: "Last Name",
    checkout_room_number: "Room Number",
    checkout_first_name_placeholder: "Your first name",
    checkout_last_name_placeholder: "Your last name",
    checkout_room_placeholder: "e.g. 214",
    checkout_rackets_label: "Rackets (balls included)",
    checkout_rackets_desc: "Number of rackets (+5 DT each)",
    checkout_balls_only_label: "Rent balls only",
    checkout_balls_only_desc: "+10 DT — Without rackets",
    checkout_lighting_label: "Court Lighting",
    checkout_lighting_desc: "+20 DT — Recommended after 6:30 PM",
    checkout_price_breakdown: "Price Breakdown",
    checkout_base: "Court (90 min)",
    checkout_peak_surcharge: "Peak hour surcharge",
    checkout_rackets_fee: "Rackets",
    checkout_balls_fee: "Ball rental",
    checkout_lighting_fee: "Lighting",
    checkout_total: "Total",
    checkout_confirm_btn: "Confirm Booking",
    checkout_cancel_btn: "Cancel",
    checkout_processing: "Processing...",
    checkout_slot_taken:
      "This slot was just booked. Please select another one.",

    confirm_title: "Booking Confirmed!",
    confirm_pin_label: "Your Booking PIN",
    confirm_booking_details: "Booking Details",
    confirm_slot: "Slot",
    confirm_date: "Date",
    confirm_total: "Amount to Pay",
    confirm_instruction_title: "What's Next?",
    confirm_instruction_body:
      "Take a screenshot of this PIN and go to the reception desk **at least 30 minutes before** your slot to complete payment.",
    confirm_screenshot_hint:
      "📸 Take a screenshot now so you don't lose this PIN.",
    confirm_another_btn: "Book Another Slot",

    lang_fr: "Français",
    lang_en: "English",
    lang_de: "Deutsch",

    admin_schedule_title: "Daily Schedule",
    admin_settings_title: "Settings",
    admin_mark_paid: "Mark as Paid",
    admin_mark_pending: "Mark as Pending",
    admin_cancel_booking: "Cancel",
    admin_block_slot: "Block Slot",
    admin_unblock_slot: "Unblock",

    error_validation: "Please fill in all required fields.",
    error_generic: "An error occurred. Please try again.",
  },

  de: {
    nav_title: "Caribbean World Djerba",
    nav_subtitle: "Padel-Platz",

    book_title: "Padel-Platz Buchen",
    book_subtitle: "Wählen Sie ein Datum und einen verfügbaren Slot",
    book_select_date: "Datum wählen",
    book_available: "Verfügbar",
    book_booked: "Gebucht",
    book_blocked: "Gesperrt",
    book_peak_badge: "+10 DT Stoßzeit",
    book_lighting_badge: "Beleuchtung verfügbar",
    book_duration: "90 Min",
    book_ends_at: "Bis",

    checkout_title: "Buchung abschließen",
    checkout_selected_slot: "Ausgewählter Slot",
    checkout_first_name: "Vorname",
    checkout_last_name: "Nachname",
    checkout_room_number: "Zimmernummer",
    checkout_first_name_placeholder: "Ihr Vorname",
    checkout_last_name_placeholder: "Ihr Nachname",
    checkout_room_placeholder: "z.B. 214",
    checkout_rackets_label: "Schläger (Bälle inklusive)",
    checkout_rackets_desc: "Anzahl der Schläger (+5 DT pro Schläger)",
    checkout_balls_only_label: "Nur Bälle mieten",
    checkout_balls_only_desc: "+10 DT — Ohne Schläger",
    checkout_lighting_label: "Platzbeleuchtung",
    checkout_lighting_desc: "+20 DT — Empfohlen nach 18:30 Uhr",
    checkout_price_breakdown: "Preisaufschlüsselung",
    checkout_base: "Platz (90 Min)",
    checkout_peak_surcharge: "Stoßzeit-Zuschlag",
    checkout_rackets_fee: "Schläger",
    checkout_balls_fee: "Ballmiete",
    checkout_lighting_fee: "Beleuchtung",
    checkout_total: "Gesamt",
    checkout_confirm_btn: "Buchung bestätigen",
    checkout_cancel_btn: "Abbrechen",
    checkout_processing: "Wird verarbeitet...",
    checkout_slot_taken:
      "Dieser Slot wurde gerade gebucht. Bitte wählen Sie einen anderen.",

    confirm_title: "Buchung Bestätigt!",
    confirm_pin_label: "Ihre Buchungs-PIN",
    confirm_booking_details: "Buchungsdetails",
    confirm_slot: "Slot",
    confirm_date: "Datum",
    confirm_total: "Zu zahlender Betrag",
    confirm_instruction_title: "Wie geht es weiter?",
    confirm_instruction_body:
      "Machen Sie einen Screenshot dieser PIN und gehen Sie **mindestens 30 Minuten vor** Ihrem Slot zur Rezeption, um die Zahlung abzuschließen.",
    confirm_screenshot_hint:
      "📸 Machen Sie jetzt einen Screenshot, damit Sie diese PIN nicht verlieren.",
    confirm_another_btn: "Weiteren Slot buchen",

    lang_fr: "Français",
    lang_en: "English",
    lang_de: "Deutsch",

    admin_schedule_title: "Tagesplan",
    admin_settings_title: "Einstellungen",
    admin_mark_paid: "Als bezahlt markieren",
    admin_mark_pending: "Als ausstehend markieren",
    admin_cancel_booking: "Stornieren",
    admin_block_slot: "Slot sperren",
    admin_unblock_slot: "Entsperren",

    error_validation: "Bitte füllen Sie alle Pflichtfelder aus.",
    error_generic: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
  },
};
