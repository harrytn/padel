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
  availableSlots: string;
  slotsPerDay: string;
  footerArrivalNote: string;
  courts: string;
  staffAccess: string;
  legend: string;
  available: string;
  occupied: string;
  selected: string;
  passed: string;
  reserved: string;
  reserve: string;
  durationMinutes: string;
  court: string;
  dateLabel: string;

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

  confirm_another_btn: string;
  bookingConfirmed: string;
  reservationConfirmed: string;
  yourBookingPin: string;
  screenshotPinHint: string;
  date: string;
  slot: string;
  amountToPay: string;
  instructions: string;
  confirmationInstructions: string;
  bookAnotherSlot: string;

  // Language toggle
  lang_fr: string;
  lang_en: string;
  lang_de: string;

  // Admin
  admin_schedule_title: string;
  admin_settings_title: string;
  admin_settings_duration: string;
  admin_mark_paid: string;
  admin_mark_pending: string;
  admin_cancel_booking: string;
  admin_block_slot: string;
  admin_unblock_slot: string;

  // Errors & Validation
  error_validation: string;
  error_generic: string;
  error_name_invalid: string;
  error_room_invalid: string;

  // Login
  login_title: string;
  login_password_placeholder: string;
  login_btn: string;
  login_error: string;

  // Admin Operational Statuses
  status_free: string;
  status_pending: string;
  status_paid: string;
  status_arrived: string;
  status_no_show: string;
  status_cancelled: string;

  // Admin Actions
  admin_action_checkin: string;
  admin_action_noshow: string;

  // Admin Table Headers
  admin_col_time: string;
  admin_col_type: string;
  admin_col_client: string;
  admin_col_room: string;
  admin_col_pin: string;
  admin_col_price: string;
  admin_col_status: string;
  admin_col_actions: string;
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
    book_peak_badge: "Heure de pointe",
    book_lighting_badge: "Éclairage disponible",
    book_duration: "{count} min",
    book_ends_at: "Jusqu'à",
    availableSlots: "Créneaux disponibles",
    slotsPerDay: "9 slots / jour",
    footerArrivalNote: "Merci de vous présenter à la réception 15 minutes avant votre session.",
    courts: "Courts",
    staffAccess: "Accès Staff",
    legend: "Légende",
    available: "Disponible",
    occupied: "Occupé",
    selected: "Sélectionné",
    passed: "Passé",
    reserved: "Réservé",
    reserve: "Réserver",
    durationMinutes: "min",
    court: "Court",
    dateLabel: "Date",

    checkout_title: "Finaliser la réservation",
    checkout_selected_slot: "Créneau sélectionné",
    checkout_first_name: "Prénom",
    checkout_last_name: "Nom",
    checkout_room_number: "Numéro de chambre",
    checkout_first_name_placeholder: "Votre prénom",
    checkout_last_name_placeholder: "Votre nom",
    checkout_room_placeholder: "Numéro de chambre",
    checkout_rackets_label: "Raquettes (balles incluses)",
    checkout_rackets_desc: "Nombre de raquettes (+5 DT chacune)",
    checkout_balls_only_label: "Louer des balles uniquement",
    checkout_balls_only_desc: "+10 DT — Sans raquette",
    checkout_lighting_label: "Éclairage du terrain",
    checkout_lighting_desc: "+20 DT — Recommandé après 18h30",
    checkout_price_breakdown: "Détail du prix",
    checkout_base: "Court ({count} min)",
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


    confirm_another_btn: "Réserver un autre créneau",
    bookingConfirmed: "Réservation confirmée !",
    reservationConfirmed: "Réservation confirmée",
    yourBookingPin: "Votre code PIN",
    screenshotPinHint: "Prenez une capture d'écran pour ne pas perdre ce code.",
    date: "Date",
    slot: "Créneau",
    amountToPay: "Montant à payer",
    instructions: "Instructions",
    confirmationInstructions: "Prenez une capture d'écran de ce code PIN et présentez-vous à la réception au moins 30 minutes avant votre créneau pour finaliser le paiement.",
    bookAnotherSlot: "Réserver un autre créneau",

    lang_fr: "Français",
    lang_en: "English",
    lang_de: "Deutsch",

    admin_schedule_title: "Planning du jour",
    admin_settings_title: "Paramètres",
    admin_settings_duration: "Durée d'un créneau",
    admin_mark_paid: "Marquer Payé",
    admin_mark_pending: "Marquer En Attente",
    admin_cancel_booking: "Annuler",
    admin_block_slot: "Bloquer",
    admin_unblock_slot: "Débloquer",

    error_validation: "Veuillez remplir tous les champs obligatoires.",
    error_generic: "Une erreur est survenue. Veuillez réessayer.",
    error_name_invalid: "Le nom ne doit contenir que des lettres, espaces, traits d'union ou apostrophes.",
    error_room_invalid: "Veuillez saisir un numéro de chambre valide.",

    login_title: "Accès Staff",
    login_password_placeholder: "Mot de passe staff",
    login_btn: "Se connecter",
    login_error: "Mot de passe incorrect.",

    status_free: "Libre",
    status_pending: "⏳ En attente",
    status_paid: "✅ Payé",
    status_arrived: "📍 Arrivé",
    status_no_show: "👻 No-show",
    status_cancelled: "❌ Annulé",

    admin_action_checkin: "📍 Check-in",
    admin_action_noshow: "👻 No-show",

    admin_col_time: "Heure",
    admin_col_type: "Type",
    admin_col_client: "Client",
    admin_col_room: "Chambre",
    admin_col_pin: "PIN",
    admin_col_price: "Prix",
    admin_col_status: "Statut",
    admin_col_actions: "Actions",
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
    book_peak_badge: "Peak Hour",
    book_lighting_badge: "Lighting available",
    book_duration: "{count} minutes",
    book_ends_at: "Until",
    availableSlots: "Available slots",
    slotsPerDay: "9 slots / day",
    footerArrivalNote: "Please arrive at reception 15 minutes before your session.",
    courts: "Courts",
    staffAccess: "Staff access",
    legend: "Legend",
    available: "Available",
    occupied: "Occupied",
    selected: "Selected",
    passed: "Past",
    reserved: "Reserved",
    reserve: "Reserve",
    durationMinutes: "min",
    court: "Court",
    dateLabel: "Date",

    checkout_title: "Complete Your Booking",
    checkout_selected_slot: "Selected Slot",
    checkout_first_name: "First Name",
    checkout_last_name: "Last Name",
    checkout_room_number: "Room Number",
    checkout_first_name_placeholder: "Your first name",
    checkout_last_name_placeholder: "Your last name",
    checkout_room_placeholder: "Room number",
    checkout_rackets_label: "Rackets (balls included)",
    checkout_rackets_desc: "Number of rackets (+5 DT each)",
    checkout_balls_only_label: "Rent balls only",
    checkout_balls_only_desc: "+10 DT — Without rackets",
    checkout_lighting_label: "Court Lighting",
    checkout_lighting_desc: "+20 DT — Recommended after 6:30 PM",
    checkout_price_breakdown: "Price Breakdown",
    checkout_base: "Court ({count} min)",
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


    confirm_another_btn: "Book Another Slot",
    bookingConfirmed: "Booking Confirmed!",
    reservationConfirmed: "Reservation confirmed",
    yourBookingPin: "Your booking PIN",
    screenshotPinHint: "Take a screenshot now so you don't lose this PIN.",
    date: "Date",
    slot: "Slot",
    amountToPay: "Amount to pay",
    instructions: "Instructions",
    confirmationInstructions: "Take a screenshot of this PIN and go to the reception desk at least 30 minutes before your slot to complete payment.",
    bookAnotherSlot: "Book another slot",

    lang_fr: "Français",
    lang_en: "English",
    lang_de: "Deutsch",

    admin_schedule_title: "Daily Schedule",
    admin_settings_title: "Settings",
    admin_settings_duration: "Slot duration",
    admin_mark_paid: "Mark as Paid",
    admin_mark_pending: "Mark as Pending",
    admin_cancel_booking: "Cancel",
    admin_block_slot: "Block Slot",
    admin_unblock_slot: "Unblock",

    error_validation: "Please fill in all required fields.",
    error_generic: "An error occurred. Please try again.",
    error_name_invalid: "Name must contain only letters, spaces, hyphens, or apostrophes.",
    error_room_invalid: "Give a valid room number.",

    login_title: "Staff Access",
    login_password_placeholder: "Staff password",
    login_btn: "Login",
    login_error: "Incorrect password.",

    status_free: "Free",
    status_pending: "⏳ Pending",
    status_paid: "✅ Paid",
    status_arrived: "📍 Arrived",
    status_no_show: "👻 No-show",
    status_cancelled: "❌ Cancelled",

    admin_action_checkin: "📍 Check-in",
    admin_action_noshow: "👻 No-show",

    admin_col_time: "Time",
    admin_col_type: "Type",
    admin_col_client: "Client",
    admin_col_room: "Room",
    admin_col_pin: "PIN",
    admin_col_price: "Price",
    admin_col_status: "Status",
    admin_col_actions: "Actions",
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
    book_peak_badge: "Stoßzeit",
    book_lighting_badge: "Beleuchtung verfügbar",
    book_duration: "{count} Min.",
    book_ends_at: "Bis",
    availableSlots: "Verfügbare Zeiten",
    slotsPerDay: "9 Slots / Tag",
    footerArrivalNote: "Bitte melden Sie sich 15 Minuten vor Ihrer Einheit an der Rezeption.",
    courts: "Courts",
    staffAccess: "Mitarbeiterzugang",
    legend: "Legende",
    available: "Verfügbar",
    occupied: "Belegt",
    selected: "Ausgewählt",
    passed: "Vergangen",
    reserved: "Reserviert",
    reserve: "Reservieren",
    durationMinutes: "min",
    court: "Court",
    dateLabel: "Datum",

    checkout_title: "Buchung abschließen",
    checkout_selected_slot: "Ausgewählter Slot",
    checkout_first_name: "Vorname",
    checkout_last_name: "Nachname",
    checkout_room_number: "Zimmernummer",
    checkout_first_name_placeholder: "Ihr Vorname",
    checkout_last_name_placeholder: "Ihr Nachname",
    checkout_room_placeholder: "Zimmernummer",
    checkout_rackets_label: "Schläger (Bälle inklusive)",
    checkout_rackets_desc: "Anzahl der Schläger (+5 DT pro Schläger)",
    checkout_balls_only_label: "Nur Bälle mieten",
    checkout_balls_only_desc: "+10 DT — Ohne Schläger",
    checkout_lighting_label: "Platzbeleuchtung",
    checkout_lighting_desc: "+20 DT — Empfohlen nach 18:30 Uhr",
    checkout_price_breakdown: "Preisaufschlüsselung",
    checkout_base: "Court ({count} Min.)",
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


    confirm_another_btn: "Weiteren Slot buchen",
    bookingConfirmed: "Buchung bestätigt!",
    reservationConfirmed: "Reservierung bestätigt",
    yourBookingPin: "Ihre Buchungs-PIN",
    screenshotPinHint: "Machen Sie einen Screenshot, damit Sie diese PIN nicht verlieren.",
    date: "Datum",
    slot: "Slot",
    amountToPay: "Zu zahlender Betrag",
    instructions: "Anweisungen",
    confirmationInstructions: "Machen Sie einen Screenshot dieser PIN und melden Sie sich mindestens 30 Minuten vor Ihrem Slot an der Rezeption, um die Zahlung abzuschließen.",
    bookAnotherSlot: "Weiteren Slot buchen",

    lang_fr: "Français",
    lang_en: "English",
    lang_de: "Deutsch",

    admin_schedule_title: "Tagesplan",
    admin_settings_title: "Einstellungen",
    admin_settings_duration: "Slotdauer",
    admin_mark_paid: "Als bezahlt markieren",
    admin_mark_pending: "Als ausstehend markieren",
    admin_cancel_booking: "Stornieren",
    admin_block_slot: "Slot sperren",
    admin_unblock_slot: "Entsperren",

    error_validation: "Bitte füllen Sie alle Pflichtfelder aus.",
    error_generic: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
    error_name_invalid: "Name darf nur Buchstaben, Leerzeichen, Bindestriche oder Apostrophe enthalten.",
    error_room_invalid: "Bitte geben Sie eine gültige Zimmernummer ein.",

    login_title: "Mitarbeiterzugang",
    login_password_placeholder: "Mitarbeiter-Passwort",
    login_btn: "Anmelden",
    login_error: "Falsches Passwort.",

    status_free: "Frei",
    status_pending: "⏳ Ausstehend",
    status_paid: "✅ Bezahlt",
    status_arrived: "📍 Angekommen",
    status_no_show: "👻 No-show",
    status_cancelled: "❌ Storniert",

    admin_action_checkin: "📍 Check-in",
    admin_action_noshow: "👻 No-show",

    admin_col_time: "Zeit",
    admin_col_type: "Typ",
    admin_col_client: "Kunde",
    admin_col_room: "Zimmer",
    admin_col_pin: "PIN",
    admin_col_price: "Preis",
    admin_col_status: "Status",
    admin_col_actions: "Aktionen",
  },
};
